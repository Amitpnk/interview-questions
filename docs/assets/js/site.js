/* Site enhancements – registered as a docsify plugin in index.html */
(function () {
  var REPO = 'https://github.com/Amitpnk/interview-questions';
  var WORDS_PER_MINUTE = 200;
  var LEVELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  var CALLOUTS = [
    { match: /^interview tip/i, cls: 'tip' },
    { match: /^tip/i, cls: 'tip' },
    { match: /^(common mistake|warning)/i, cls: 'warning' },
    { match: /^(note|coming soon)/i, cls: 'note' }
  ];

  /* ---------- Reading progress bar and back-to-top button ---------- */

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var bar = document.querySelector('.read-progress');
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';

    var top = document.querySelector('.back-to-top');
    if (top) top.classList.toggle('show', window.scrollY > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- Press "/" to focus the search box ---------- */

  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || document.activeElement.isContentEditable) return;

    var input = document.querySelector('.search input');
    if (!input) return;
    e.preventDefault();
    if (document.body.classList.contains('close')) document.body.classList.remove('close');
    input.focus();
    input.select();
  });

  /* ---------- Mermaid diagrams (re-rendered when the theme changes) ---------- */

  var diagramCount = 0;

  function renderDiagrams() {
    if (!window.mermaid) return;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    window.mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default', fontFamily: 'Inter, sans-serif' });

    // Turn ```mermaid code blocks into diagram containers
    document.querySelectorAll('.markdown-section pre[data-lang="mermaid"]').forEach(function (pre) {
      var box = document.createElement('div');
      box.className = 'mermaid-diagram';
      // Read only the <code> element – the copy-code plugin adds button text to <pre>
      var code = pre.querySelector('code') || pre;
      box.setAttribute('data-source', code.textContent);
      pre.replaceWith(box);
    });

    document.querySelectorAll('.mermaid-diagram').forEach(function (box) {
      var id = 'mermaid-' + (++diagramCount);
      window.mermaid.render(id, box.getAttribute('data-source')).then(function (result) {
        box.innerHTML = result.svg;
      }).catch(function () {
        box.textContent = box.getAttribute('data-source');
      });
    });
  }

  window.addEventListener('themechange', renderDiagrams);

  /* ---------- Page helpers ---------- */

  function addDifficultyBadges(html) {
    // <!-- level: beginner --> written under a question heading becomes a badge inside the heading
    return html.replace(/<\/h3>\s*<!--\s*level:\s*(beginner|intermediate|advanced)\s*-->/gi, function (_, level) {
      level = level.toLowerCase();
      return '<span class="level level-' + level + '">' + LEVELS[level] + '</span></h3>';
    });
  }

  /* ---------- Revision progress (saved in this browser only) ---------- */

  var REVISED_KEY = 'revised';

  function loadRevised() {
    try { return JSON.parse(localStorage.getItem(REVISED_KEY)) || {}; } catch (e) { return {}; }
  }

  function saveRevised(all) {
    try { localStorage.setItem(REVISED_KEY, JSON.stringify(all)); } catch (e) { }
  }

  function revisedFor(file) {
    return loadRevised()[file] || [];
  }

  function setRevised(file, id, done) {
    var all = loadRevised();
    var list = (all[file] || []).filter(function (x) { return x !== id; });
    if (done) list.push(id);
    if (list.length) all[file] = list; else delete all[file];
    saveRevised(all);
  }

  /* ---------- Toast message ---------- */

  var toastTimer;

  function toast(message) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  /* ---------- Practice mode: hide answers, click a question to reveal ---------- */

  var PRACTICE_KEY = 'practice';

  function practiceOn() {
    return document.documentElement.getAttribute('data-practice') === 'on';
  }

  function setPractice(on) {
    document.documentElement.setAttribute('data-practice', on ? 'on' : 'off');
    try { localStorage.setItem(PRACTICE_KEY, on ? 'on' : 'off'); } catch (e) { }
    document.querySelectorAll('.answer.revealed').forEach(function (a) { a.classList.remove('revealed'); });
  }

  try { if (localStorage.getItem(PRACTICE_KEY) === 'on') document.documentElement.setAttribute('data-practice', 'on'); } catch (e) { }

  window.togglePractice = function () {
    var on = !practiceOn();
    setPractice(on);
    toast(on ? 'Practice mode on – click a question to reveal its answer' : 'Practice mode off');
  };

  // Wrap everything between one question (h3) and the next heading in <div class="answer">
  function wrapAnswers() {
    var section = document.querySelector('.markdown-section');
    if (!section) return;
    var stop = function (el) {
      return /^H[1-3]$/.test(el.tagName) || el.classList.contains('page-footer') ||
        el.classList.contains('docsify-pagination-container');
    };

    section.querySelectorAll('h3').forEach(function (h3) {
      var answer = document.createElement('div');
      answer.className = 'answer';
      var next = h3.nextElementSibling;
      while (next && !stop(next)) {
        var move = next;
        next = next.nextElementSibling;
        answer.appendChild(move);
      }
      h3.insertAdjacentElement('afterend', answer);
    });
  }

  document.addEventListener('click', function (e) {
    if (!practiceOn()) return;
    var h3 = e.target.closest && e.target.closest('.markdown-section h3');
    if (!h3 || e.target.closest('.q-actions')) return;
    var answer = h3.nextElementSibling;
    if (!answer || !answer.classList.contains('answer')) return;
    e.preventDefault();
    e.stopPropagation();
    answer.classList.toggle('revealed');
    h3.classList.toggle('open', answer.classList.contains('revealed'));
  }, true);

  /* ---------- Question actions: copy link, mark as revised ---------- */

  // Fallback for browsers or contexts where the async clipboard API is blocked
  function copyWithTextarea(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { }
    area.remove();
    return ok;
  }

  var ICON_LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function addQuestionActions(vm, comingSoon) {
    var file = vm.route.file;
    var done = revisedFor(file);

    document.querySelectorAll('.markdown-section h3[id]').forEach(function (h3) {
      var id = h3.id;
      var actions = document.createElement('span');
      actions.className = 'q-actions';

      var link = document.createElement('button');
      link.type = 'button';
      link.className = 'q-btn q-link';
      link.title = 'Copy link to this question';
      link.setAttribute('aria-label', 'Copy link to this question');
      link.innerHTML = ICON_LINK;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var url = location.href.split('#')[0] + '#' + vm.route.path + '?id=' + id;
        var copied = navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject();
        copied.then(function () { toast('Link copied'); }, function () {
          toast(copyWithTextarea(url) ? 'Link copied' : 'Could not copy – use the address bar');
          history.replaceState(null, '', url);
        });
      });
      actions.appendChild(link);

      if (!comingSoon) {
        var check = document.createElement('button');
        check.type = 'button';
        check.className = 'q-btn q-check';
        check.innerHTML = ICON_CHECK;
        var update = function (isDone) {
          check.classList.toggle('done', isDone);
          check.title = isDone ? 'Revised – click to undo' : 'Mark as revised';
          check.setAttribute('aria-label', check.title);
          check.setAttribute('aria-pressed', isDone);
        };
        update(done.indexOf(id) !== -1);
        check.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var isDone = !check.classList.contains('done');
          setRevised(file, id, isDone);
          update(isDone);
          updateRevisedCount(file);
        });
        actions.appendChild(check);
      }

      h3.appendChild(actions);
    });
  }

  function updateRevisedCount(file) {
    var el = document.querySelector('.page-meta .revised-count');
    if (!el) return;
    var total = document.querySelectorAll('.markdown-section .q-check').length;
    var ids = [].map.call(document.querySelectorAll('.markdown-section h3[id]'), function (h) { return h.id; });
    // Only count ids that still exist on the page
    var count = revisedFor(file).filter(function (id) { return ids.indexOf(id) !== -1; }).length;
    el.textContent = count + ' / ' + total + ' revised';
    el.parentNode.classList.toggle('has-progress', count > 0);
  }

  /* ---------- Page stats line under the title ---------- */

  function isComingSoon() {
    var label = document.querySelector('.markdown-section blockquote.callout-note strong');
    return !!label && /coming soon/i.test(label.textContent);
  }

  function addPageStats(vm, comingSoon) {
    var section = document.querySelector('.markdown-section');
    var title = section && section.querySelector('h1');
    var questions = section ? section.querySelectorAll('h3').length : 0;
    if (!title || !questions) return;

    var words = section.textContent.trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

    var meta = document.createElement('p');
    meta.className = 'page-meta';
    if (comingSoon) {
      meta.textContent = questions + ' questions planned · coming soon';
    } else {
      meta.innerHTML = '<span>' + questions + ' questions · ' + minutes + ' min read</span>' +
        '<span class="sep">·</span><span class="revised-count"></span>' +
        '<button type="button" class="reset-progress">Reset</button>';
      meta.querySelector('.reset-progress').addEventListener('click', function () {
        if (!confirm('Clear your revised ticks for this page?')) return;
        var all = loadRevised();
        delete all[vm.route.file];
        saveRevised(all);
        document.querySelectorAll('.q-check.done').forEach(function (c) {
          c.classList.remove('done');
          c.setAttribute('aria-pressed', false);
          c.title = 'Mark as revised';
        });
        updateRevisedCount(vm.route.file);
      });
    }
    title.insertAdjacentElement('afterend', meta);
  }

  function styleCallouts() {
    document.querySelectorAll('.markdown-section blockquote').forEach(function (quote) {
      var label = quote.querySelector('p:first-child > strong:first-child');
      if (!label) return;
      for (var i = 0; i < CALLOUTS.length; i++) {
        if (CALLOUTS[i].match.test(label.textContent.trim())) {
          quote.classList.add('callout', 'callout-' + CALLOUTS[i].cls);
          return;
        }
      }
    });
  }

  // Home page: show the number of questions (and revision progress) on each topic card
  function addCardCounts() {
    var revised = loadRevised();
    document.querySelectorAll('.topic-card').forEach(function (card) {
      if (card.querySelector('.topic-count')) return;
      var page = card.getAttribute('href').replace('#/', '');
      fetch(page + '.md').then(function (res) {
        return res.ok ? res.text() : '';
      }).then(function (text) {
        var count = (text.match(/^### /gm) || []).length;
        if (!count) return;
        var done = (revised[page + '.md'] || []).length;
        var span = document.createElement('span');
        span.className = 'topic-count';
        span.textContent = count + ' questions';
        if (done) {
          span.innerHTML = count + ' questions · <span class="topic-revised">' + Math.min(done, count) + ' revised</span>';
          card.style.setProperty('--progress', Math.min(1, done / count));
          card.classList.add('has-progress');
        }
        card.querySelector('.topic-body').appendChild(span);
      });
    });
  }

  /* ---------- Docsify plugin ---------- */

  window.sitePlugin = function (hook, vm) {
    hook.mounted(function () {
      var bar = document.createElement('div');
      bar.className = 'read-progress';
      document.body.appendChild(bar);
    });

    hook.afterEach(function (html, next) {
      html = addDifficultyBadges(html);

      var file = vm.route.file;
      var isNotFound = html.indexOf('class="not-found"') !== -1;
      if (file && !isNotFound && !/(^|\/)_/.test(file)) {
        html += '<div class="page-footer">' +
          '<a href="' + REPO + '/blob/main/docs/' + file + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>' +
          'Edit this page on GitHub</a></div>';
      }
      next(html);
    });

    hook.doneEach(function () {
      styleCallouts();
      var comingSoon = isComingSoon();
      addPageStats(vm, comingSoon);
      addQuestionActions(vm, comingSoon);
      updateRevisedCount(vm.route.file);
      wrapAnswers();
      addCardCounts();
      renderDiagrams();
      onScroll();
    });
  };
})();
