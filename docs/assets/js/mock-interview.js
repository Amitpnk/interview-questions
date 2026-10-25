/* Mock interview – pick topics, answer out loud, get a confidence score.
 * Questions and model answers are read from the topic pages (*.md); scoring lives in mock-scoring.js.
 * Everything runs in the browser: nothing is uploaded or stored by this site.
 */
(function () {
  'use strict';

  var S = window.MockScoring;
  var app = document.getElementById('mock-app');
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var canListen = !!SpeechRecognition;
  var canSpeak = 'speechSynthesis' in window;

  // Topics that are better practised by writing code than by talking
  var EXCLUDED = ['SimpleProgram.md'];
  var HISTORY_KEY = 'mockHistory';
  var SETTINGS_KEY = 'mockSettings';

  var state = {
    groups: [],          // [{ name, topics: [{ file, title, questions }] }]
    settings: loadSettings(),
    session: null        // { questions, index, results }
  };

  /* ---------- Helpers ---------- */

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function esc(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function inline(md) {
    return window.marked ? window.marked.parseInline(md) : esc(md);
  }

  function plain(md) {
    return md.replace(/`/g, '').replace(/\*\*/g, '');
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { }
  }

  function loadSettings() {
    var s = load(SETTINGS_KEY, {});
    return {
      topics: s.topics || [],
      level: s.level || 'all',
      count: s.count || 5,
      seconds: s.seconds || 120,
      lang: s.lang || 'en-US',
      readAloud: s.readAloud !== false,
      mode: canListen ? (s.mode || 'voice') : 'type'
    };
  }

  function scoreClass(score) {
    return score >= 80 ? 'strong' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'weak';
  }

  function ring(score, size) {
    var r = 42, c = 2 * Math.PI * r;
    return '<div class="score-ring ' + scoreClass(score) + '" style="--size:' + (size || 140) + 'px">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="' + r + '"/>' +
      '<circle class="value" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - score / 100)) + '"/></svg>' +
      '<span class="score-number">' + score + '</span></div>';
  }

  function bar(label, score) {
    return '<div class="score-bar ' + scoreClass(score) + '"><div class="score-bar-label"><span>' + label + '</span><b>' + score + '</b></div>' +
      '<div class="score-bar-track"><div class="score-bar-fill" style="width:' + score + '%"></div></div></div>';
  }

  function topicUrl(question) {
    return 'index.html#/' + question.file.replace(/\.md$/, '') + '?id=' + question.id;
  }

  function speak(text) {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(plain(text));
    u.lang = state.settings.lang;
    u.rate = 1;
    window.speechSynthesis.speak(u);
  }

  /* ---------- Load topics from the sidebar and topic pages ---------- */

  function loadTopics() {
    return fetch('_sidebar.md').then(function (r) { return r.text(); }).then(function (md) {
      var groups = [], group = null;
      md.split('\n').forEach(function (line) {
        var g = /^- \*\*(.+)\*\*/.exec(line);
        if (g) { group = { name: g[1], topics: [] }; groups.push(group); return; }
        var t = /^\s+- \[(.+)\]\((.+\.md)\)/.exec(line);
        if (t && group && EXCLUDED.indexOf(t[2]) === -1) group.topics.push({ title: t[1], file: t[2], questions: [] });
      });

      var all = [];
      groups.forEach(function (g) { all = all.concat(g.topics); });
      return Promise.all(all.map(function (topic) {
        return fetch(topic.file).then(function (r) { return r.ok ? r.text() : ''; }).then(function (text) {
          topic.questions = S.parsePage(text).filter(S.isSpeakable).map(function (q) {
            q.file = topic.file;
            q.topic = topic.title;
            return q;
          });
        });
      })).then(function () { return groups; });
    });
  }

  /* ---------- Screen 1: setup ---------- */

  function renderSetup() {
    stopEverything();
    var s = state.settings;
    var history = load(HISTORY_KEY, []);

    var groupsHtml = state.groups.map(function (g) {
      var chips = g.topics.map(function (t) {
        var n = t.questions.length;
        var on = s.topics.indexOf(t.file) !== -1 && n > 0;
        return '<button type="button" class="topic-chip' + (on ? ' selected' : '') + '" data-file="' + esc(t.file) + '"' +
          (n ? '' : ' disabled') + ' aria-pressed="' + on + '">' + esc(t.title) +
          '<span class="chip-count">' + (n ? n : 'soon') + '</span></button>';
      }).join('');
      return '<div class="topic-group"><h3>' + esc(g.name) + '</h3><div class="chips">' + chips + '</div></div>';
    }).join('');

    var historyHtml = history.length ? '<section class="mock-card history"><h2>Recent sessions</h2><ul>' +
      history.slice(0, 5).map(function (h) {
        return '<li><span class="history-score ' + scoreClass(h.average) + '">' + h.average + '</span>' +
          '<span class="history-topics">' + esc(h.topics.join(', ')) + '</span>' +
          '<span class="history-meta">' + h.count + ' questions · ' + new Date(h.date).toLocaleDateString() + '</span></li>';
      }).join('') + '</ul></section>' : '';

    app.innerHTML =
      '<header class="mock-hero">' +
      '  <span class="mock-eyebrow">Mock interview</span>' +
      '  <h1>Practise answering out loud</h1>' +
      '  <p>Pick your topics, answer each question by speaking, and get a confidence score with feedback on what you covered and how you sounded.</p>' +
      '</header>' +
      (canListen ? '' : '<div class="mock-alert">Voice answers need <b>Chrome</b> or <b>Edge</b>. In this browser you can still practise by typing your answers.</div>') +
      '<section class="mock-card"><div class="card-head"><h2>1. Choose topics</h2>' +
      '<div class="card-actions"><button type="button" class="link-btn" data-action="all">Select all</button>' +
      '<button type="button" class="link-btn" data-action="none">Clear</button></div></div>' + groupsHtml + '</section>' +
      '<section class="mock-card"><h2>2. Settings</h2><div class="settings-grid">' +
      field('Difficulty', 'level', [['all', 'All levels'], ['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']], s.level) +
      field('Questions', 'count', [[5, '5 questions'], [10, '10 questions'], [15, '15 questions']], s.count) +
      field('Time per answer', 'seconds', [[60, '1 minute'], [120, '2 minutes'], [180, '3 minutes']], s.seconds) +
      field('Answer by', 'mode', canListen ? [['voice', 'Speaking'], ['type', 'Typing']] : [['type', 'Typing']], s.mode) +
      field('Accent (speech recognition)', 'lang', [['en-US', 'English (US)'], ['en-GB', 'English (UK)'], ['en-IN', 'English (India)'], ['en-AU', 'English (Australia)']], s.lang) +
      '<label class="toggle"><input type="checkbox" name="readAloud"' + (s.readAloud ? ' checked' : '') + (canSpeak ? '' : ' disabled') + '> Read questions aloud</label>' +
      '</div></section>' +
      '<div class="start-row"><p class="pool-info" id="pool-info"></p>' +
      '<button type="button" class="btn btn-primary btn-lg" id="start-btn">Start interview</button></div>' +
      historyHtml +
      '<p class="privacy-note">Your answers stay in your browser – this site doesn\'t upload or store them. ' +
      'Speech-to-text is done by your browser; Chrome sends the audio to Google to transcribe it.</p>';

    app.querySelectorAll('.topic-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var file = chip.getAttribute('data-file');
        var i = s.topics.indexOf(file);
        if (i === -1) s.topics.push(file); else s.topics.splice(i, 1);
        chip.classList.toggle('selected', i === -1);
        chip.setAttribute('aria-pressed', i === -1);
        updatePool();
      });
    });
    app.querySelector('[data-action="all"]').addEventListener('click', function () {
      s.topics = [];
      state.groups.forEach(function (g) { g.topics.forEach(function (t) { if (t.questions.length) s.topics.push(t.file); }); });
      renderSetup();
    });
    app.querySelector('[data-action="none"]').addEventListener('click', function () { s.topics = []; renderSetup(); });
    app.querySelectorAll('select, input[name="readAloud"]').forEach(function (input) {
      input.addEventListener('change', function () {
        var v = input.type === 'checkbox' ? input.checked : input.value;
        if (input.name === 'count' || input.name === 'seconds') v = parseInt(v, 10);
        s[input.name] = v;
        updatePool();
      });
    });
    app.querySelector('#start-btn').addEventListener('click', startSession);
    updatePool();
  }

  function field(label, name, options, value) {
    return '<label class="field"><span>' + label + '</span><select name="' + name + '">' +
      options.map(function (o) {
        return '<option value="' + o[0] + '"' + (String(o[0]) === String(value) ? ' selected' : '') + '>' + o[1] + '</option>';
      }).join('') + '</select></label>';
  }

  function pool() {
    var s = state.settings, list = [];
    state.groups.forEach(function (g) {
      g.topics.forEach(function (t) {
        if (s.topics.indexOf(t.file) === -1) return;
        t.questions.forEach(function (q) { if (s.level === 'all' || q.level === s.level) list.push(q); });
      });
    });
    return list;
  }

  function updatePool() {
    save(SETTINGS_KEY, state.settings);
    var n = pool().length;
    var info = app.querySelector('#pool-info');
    var btn = app.querySelector('#start-btn');
    if (!state.settings.topics.length) info.textContent = 'Select at least one topic to start.';
    else if (!n) info.textContent = 'No questions match this difficulty – choose another level or more topics.';
    else info.textContent = n + ' questions available · you\'ll get ' + Math.min(n, state.settings.count) + '.';
    btn.disabled = !n;
  }

  function startSession() {
    var questions = shuffle(pool()).slice(0, state.settings.count);
    if (!questions.length) return;
    state.session = { questions: questions, index: 0, results: [] };
    renderQuestion();
  }

  /* ---------- Screen 2: question ---------- */

  var rec = null;      // active recorder
  var timer = null;

  function stopEverything() {
    if (rec) { rec.stop(); rec = null; }
    clearInterval(timer);
    if (canSpeak) window.speechSynthesis.cancel();
  }

  function renderQuestion() {
    stopEverything();
    var sess = state.session, q = sess.questions[sess.index], s = state.settings;
    var voice = s.mode === 'voice';
    var remaining = s.seconds;
    var answer = { text: '', spoken: false, speakingMs: 0, longPauses: 0 };

    app.innerHTML =
      progressBar() +
      '<section class="mock-card question-card">' +
      '  <div class="question-meta"><span class="topic-tag">' + esc(q.topic) + '</span>' +
      '  <span class="level level-' + q.level + '">' + q.level + '</span>' +
      (canSpeak ? '<button type="button" class="icon-btn" id="read-btn" title="Read the question aloud" aria-label="Read the question aloud">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg></button>' : '') +
      '  </div>' +
      '  <h2 class="question-title">' + inline(q.title) + '</h2>' +
      '  <p class="question-hint">Structure your answer: <b>what it is</b> → <b>how it works</b> → <b>an example</b>.</p>' +
      '</section>' +
      '<section class="mock-card answer-card">' +
      (voice ?
        '<div class="recorder"><button type="button" class="mic-btn" id="mic-btn" aria-label="Start answering">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg></button>' +
        '<div class="recorder-status"><b id="rec-state">Press the mic and start speaking</b><span id="rec-timer">' + fmtTime(remaining) + ' remaining</span></div></div>' :
        '<div class="recorder-status typing"><b>Type your answer</b><span id="rec-timer">' + fmtTime(remaining) + ' remaining</span></div>') +
      '<textarea id="answer-box" rows="7" placeholder="' + (voice ? 'Your answer appears here as you speak. You can correct mistakes before submitting.' : 'Type your answer here…') + '"></textarea>' +
      '<p class="mock-error" id="rec-error" hidden></p>' +
      '<div class="answer-actions"><button type="button" class="btn" id="skip-btn">Skip</button>' +
      '<button type="button" class="btn btn-primary" id="submit-btn" disabled>Submit answer</button></div>' +
      '</section>' +
      endLink();

    var box = app.querySelector('#answer-box');
    var submit = app.querySelector('#submit-btn');
    var timerEl = app.querySelector('#rec-timer');

    box.addEventListener('input', function () { answer.text = box.value; submit.disabled = !box.value.trim(); });
    app.querySelector('#skip-btn').addEventListener('click', function () { finish(true); });
    submit.addEventListener('click', function () { finish(false); });
    bindEnd();

    if (canSpeak) app.querySelector('#read-btn').addEventListener('click', function () { speak(q.title); });
    if (s.readAloud) speak(q.title);

    function tick() {
      remaining--;
      timerEl.textContent = remaining > 0 ? fmtTime(remaining) + ' remaining' : 'Time is up';
      timerEl.classList.toggle('low', remaining <= 15);
      if (remaining <= 0) {
        clearInterval(timer);
        if (rec) stopRecording();
      }
    }

    if (!voice) {
      timer = setInterval(tick, 1000);
      box.focus();
    } else {
      var mic = app.querySelector('#mic-btn');
      var stateEl = app.querySelector('#rec-state');
      mic.addEventListener('click', function () { if (rec) stopRecording(); else startRecording(); });

      var startRecording = function () {
        if (canSpeak) window.speechSynthesis.cancel();
        app.querySelector('#rec-error').hidden = true;
        rec = new Recorder(s.lang, box.value, {
          update: function (text) { box.value = text; answer.text = text; submit.disabled = !text.trim(); box.scrollTop = box.scrollHeight; },
          error: function (message) {
            var err = app.querySelector('#rec-error');
            err.textContent = message;
            err.hidden = false;
            stopRecording();
          }
        });
        rec.start();
        mic.classList.add('recording');
        mic.setAttribute('aria-label', 'Stop answering');
        stateEl.textContent = 'Listening… press again to stop';
        box.readOnly = true;
        if (!timer) timer = setInterval(tick, 1000);
      };

      var stopRecording = function () {
        if (!rec) return;
        var r = rec;
        rec = null;
        var stats = r.stop();
        answer.spoken = answer.spoken || stats.words > 0;
        answer.speakingMs += stats.speakingMs;
        answer.longPauses += stats.longPauses;
        mic.classList.remove('recording');
        mic.setAttribute('aria-label', 'Continue answering');
        stateEl.textContent = stats.words ? 'Stopped – check your answer, then submit (or press the mic to continue)' : 'Didn\'t catch that – press the mic and try again';
        box.readOnly = false;
        clearInterval(timer);
        timer = null;
      };
    }

    function finish(skipped) {
      if (rec) {
        var stats = rec.stop();
        rec = null;
        answer.spoken = answer.spoken || stats.words > 0;
        answer.speakingMs += stats.speakingMs;
        answer.longPauses += stats.longPauses;
      }
      stopEverything();
      var text = skipped ? '' : box.value;
      var result = S.scoreAnswer(q.title, q.answer, {
        transcript: text,
        spoken: answer.spoken,
        speakingMs: answer.speakingMs,
        longPauses: answer.longPauses
      });
      result.question = q;
      result.transcript = text;
      result.skipped = skipped;
      result.timeUsed = s.seconds - Math.max(remaining, 0);
      sess.results[sess.index] = result;
      renderResult(result);
    }
  }

  function progressBar() {
    var sess = state.session;
    var pct = Math.round((sess.index / sess.questions.length) * 100);
    return '<div class="mock-progress"><span>Question ' + (sess.index + 1) + ' of ' + sess.questions.length + '</span>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';
  }

  function endLink() {
    return '<p class="end-row"><button type="button" class="link-btn" id="end-btn">End interview</button></p>';
  }

  function bindEnd() {
    app.querySelector('#end-btn').addEventListener('click', function () {
      stopEverything();
      if (state.session.results.filter(Boolean).length) renderSummary(); else renderSetup();
    });
  }

  /* ---------- Speech recognition ---------- */

  function Recorder(lang, existing, handlers) {
    var recognition = new SpeechRecognition();
    var finalText = existing ? existing.trim() + ' ' : '';
    var interim = '';
    var active = false;
    var firstAt = 0, lastAt = 0, longPauses = 0, words = 0;

    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function (e) {
      var now = Date.now();
      if (!firstAt) firstAt = now;
      else if (now - lastAt > S.LIMITS.longPauseMs) longPauses++;
      lastAt = now;
      interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalText += chunk.trim() + ' ';
          words += S.tokenize(chunk).length;
        } else {
          interim += chunk;
        }
      }
      handlers.update((finalText + interim).trim());
    };

    recognition.onerror = function (e) {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      active = false;
      var messages = {
        'not-allowed': 'Microphone access was blocked. Allow the microphone in your browser\'s address bar, or switch to typing in the settings.',
        'service-not-allowed': 'Speech recognition isn\'t available here. Switch to typing in the settings.',
        'audio-capture': 'No microphone was found. Connect one, or switch to typing in the settings.',
        'network': 'Speech recognition needs an internet connection. Check your connection and try again.'
      };
      handlers.error(messages[e.error] || 'Speech recognition stopped (' + e.error + '). Press the mic to try again.');
    };

    // Chrome ends continuous recognition after a while – restart until the user stops
    recognition.onend = function () {
      if (active) { try { recognition.start(); } catch (err) { } }
    };

    this.start = function () {
      active = true;
      try { recognition.start(); } catch (err) { }
    };

    this.stop = function () {
      if (active) {
        active = false;
        try { recognition.stop(); } catch (err) { }
      }
      if (interim.trim()) {
        words += S.tokenize(interim).length;
        finalText += interim.trim() + ' ';
        interim = '';
        handlers.update(finalText.trim());
      }
      return {
        words: words,
        speakingMs: firstAt ? (lastAt - firstAt) + 1000 : 0,
        longPauses: longPauses
      };
    };
  }

  /* ---------- Screen 3: result for one question ---------- */

  function modelAnswerHtml(md) {
    var cleaned = md.replace(/```mermaid[\s\S]*?```/g, '> **Note:** This answer has a diagram – open it on the topic page.\n');
    return window.marked ? window.marked.parse(cleaned) : '<pre>' + esc(cleaned) + '</pre>';
  }

  function renderResult(r) {
    var sess = state.session;
    var last = sess.index === sess.questions.length - 1;
    var d = r.delivery;

    var metrics = [
      ['Words', d.words],
      ['Pace', d.wpm !== null && r.question && r.transcript ? d.wpm + ' wpm' : '–'],
      ['Filler words', d.fillers.total],
      ['Hedging', d.hedges.total],
      ['Long pauses', d.longPauses !== null ? d.longPauses : '–'],
      ['Time used', fmtTime(r.timeUsed)]
    ];

    app.innerHTML =
      progressBar() +
      '<section class="mock-card result-card">' +
      '  <div class="result-top">' + ring(r.confidence) +
      '    <div class="result-summary"><span class="result-label ' + scoreClass(r.confidence) + '">' + (r.skipped ? 'Skipped' : r.label) + '</span>' +
      '    <h2 class="question-title">' + inline(r.question.title) + '</h2>' +
      bar('Content – key points covered', r.content.score) +
      bar(d.wpm !== null ? 'Delivery – pace, fillers, pauses' : 'Clarity – length and certainty', d.score) +
      '    </div>' +
      '  </div>' +
      '  <div class="metrics">' + metrics.map(function (m) {
        return '<div class="metric"><b>' + esc(m[1]) + '</b><span>' + m[0] + '</span></div>';
      }).join('') + '</div>' +
      '</section>' +
      '<section class="mock-card"><h3>Key points</h3><div class="keypoints">' +
      r.content.covered.map(function (k) { return '<span class="kp covered">✓ ' + esc(k) + '</span>'; }).join('') +
      r.content.missed.map(function (k) { return '<span class="kp missed">' + esc(k) + '</span>'; }).join('') +
      '</div><h3>Feedback</h3><ul class="tips">' + r.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>' +
      (r.transcript.trim() ? '<section class="mock-card"><h3>Your answer</h3><p class="your-answer">' + esc(r.transcript) + '</p></section>' : '') +
      '<section class="mock-card"><details class="model-answer" open><summary>Model answer</summary>' +
      '<div class="markdown-section">' + modelAnswerHtml(r.question.answer) + '</div>' +
      '<p><a href="' + topicUrl(r.question) + '" target="_blank" rel="noopener">Open this question on the ' + esc(r.question.topic) + ' page ↗</a></p>' +
      '</details></section>' +
      '<div class="answer-actions sticky-actions"><button type="button" class="btn" id="retry-btn">Try again</button>' +
      '<button type="button" class="btn btn-primary" id="next-btn">' + (last ? 'See results' : 'Next question') + '</button></div>' +
      endLink();

    if (window.Prism && window.Prism.highlightAllUnder) window.Prism.highlightAllUnder(app);
    styleCallouts(app);
    app.querySelector('#retry-btn').addEventListener('click', renderQuestion);
    app.querySelector('#next-btn').addEventListener('click', function () {
      if (last) renderSummary();
      else { sess.index++; renderQuestion(); }
    });
    bindEnd();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Same callout boxes as the docs pages (> **Interview tip:** …)
  function styleCallouts(root) {
    root.querySelectorAll('.markdown-section blockquote').forEach(function (q) {
      var label = q.querySelector('p:first-child > strong:first-child');
      if (!label) return;
      var t = label.textContent.trim();
      var cls = /^(interview tip|tip)/i.test(t) ? 'tip' : /^(common mistake|warning)/i.test(t) ? 'warning' : /^note/i.test(t) ? 'note' : '';
      if (cls) q.classList.add('callout', 'callout-' + cls);
    });
  }

  /* ---------- Screen 4: summary ---------- */

  function renderSummary() {
    stopEverything();
    var results = state.session.results.filter(Boolean);
    var avg = results.length ? Math.round(results.reduce(function (a, r) { return a + r.confidence; }, 0) / results.length) : 0;
    var content = results.length ? Math.round(results.reduce(function (a, r) { return a + r.content.score; }, 0) / results.length) : 0;
    var delivery = results.length ? Math.round(results.reduce(function (a, r) { return a + r.delivery.score; }, 0) / results.length) : 0;
    var weakest = results.slice().sort(function (a, b) { return a.confidence - b.confidence; }).filter(function (r) { return r.confidence < 70; }).slice(0, 3);
    var topics = [];
    results.forEach(function (r) { if (topics.indexOf(r.question.topic) === -1) topics.push(r.question.topic); });

    if (results.length) {
      var history = load(HISTORY_KEY, []);
      history.unshift({ date: Date.now(), topics: topics, count: results.length, average: avg });
      save(HISTORY_KEY, history.slice(0, 20));
    }

    app.innerHTML =
      '<section class="mock-card result-card summary">' +
      '  <div class="result-top">' + ring(avg, 160) +
      '    <div class="result-summary"><span class="mock-eyebrow">Interview complete</span>' +
      '    <h2>' + S.label(avg) + ' – average confidence ' + avg + '</h2>' +
      bar('Content', content) + bar('Delivery', delivery) +
      '    </div></div></section>' +
      '<section class="mock-card"><h3>Your answers</h3><ol class="summary-list">' +
      results.map(function (r) {
        return '<li><span class="history-score ' + scoreClass(r.confidence) + '">' + r.confidence + '</span>' +
          '<span class="summary-q">' + inline(r.question.title) + '<small>' + esc(r.question.topic) + (r.skipped ? ' · skipped' : '') + '</small></span>' +
          '<a href="' + topicUrl(r.question) + '" target="_blank" rel="noopener">Revise ↗</a></li>';
      }).join('') + '</ol></section>' +
      (weakest.length ? '<section class="mock-card"><h3>Revise these first</h3><ul class="tips">' +
        weakest.map(function (r) {
          return '<li><a href="' + topicUrl(r.question) + '" target="_blank" rel="noopener">' + inline(r.question.title) + '</a> – ' +
            (r.content.missed.length ? 'missed: ' + esc(r.content.missed.slice(0, 3).join(', ')) : esc(r.tips[0])) + '</li>';
        }).join('') + '</ul></section>' : '') +
      '<div class="answer-actions"><button type="button" class="btn" id="setup-btn">Change topics</button>' +
      '<button type="button" class="btn btn-primary" id="again-btn">New set of questions</button></div>';

    app.querySelector('#setup-btn').addEventListener('click', renderSetup);
    app.querySelector('#again-btn').addEventListener('click', startSession);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Start ---------- */

  window.addEventListener('beforeunload', stopEverything);

  loadTopics().then(function (groups) {
    state.groups = groups;
    // Default selection: the first few topics that have questions
    if (!state.settings.topics.length) {
      groups.forEach(function (g) {
        g.topics.forEach(function (t) { if (t.questions.length && state.settings.topics.length < 2) state.settings.topics.push(t.file); });
      });
    }
    renderSetup();
  }).catch(function () {
    app.innerHTML = '<div class="mock-alert">Couldn\'t load the questions. Check your connection and reload the page.</div>';
  });
})();
