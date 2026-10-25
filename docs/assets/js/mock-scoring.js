/* Mock interview scoring – runs entirely in the browser (no server, no AI).
 *
 * Confidence score = 60% content + 40% delivery
 *   content  – how many key points from the model answer were mentioned
 *   delivery – speaking pace, filler words, hedging, long pauses and answer length
 *
 * Written as a UMD module so it can be unit-tested in Node.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MockScoring = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STOPWORDS = (
    'a about above after again against all also am an and any are as at be because been before being below between ' +
    'both but by can cannot could did do does doing down during each else etc even every few for from further get gets ' +
    'given gives go had has have having he her here hers how however i if in into is it its itself just let lets like make ' +
    'makes many may me might more most much must my need needs no nor not now of off often on once one only or other ' +
    'our out over own per same shall she should so some such than that the their them then there these they this ' +
    'those through to too under until up upon us use used uses using very via was way we well were what when where ' +
    'whether which while who whom why will with within without would yes yet you your example examples e.g eg i.e ' +
    'ie means mean called call calls different difference between first second third new old want wants instead ' +
    'thing things something every always never usually typically time times part parts done see able allows allow ' +
    'across although sometimes often complete whole full original simply really quite rather already still since ' +
    'unless though instead specific certain several various another others important good better best easy easily ' +
    'help helps keep keeps take takes put puts give gives look looks run runs work works way ways case cases ones'
  ).split(/\s+/);
  var STOP = {};
  STOPWORDS.forEach(function (w) { STOP[w] = true; });

  var FILLERS = ['um', 'umm', 'uh', 'uhh', 'erm', 'er', 'ah', 'hmm', 'basically', 'actually', 'literally',
    'you know', 'i mean', 'sort of', 'kind of', 'so yeah', 'okay so'];
  var HEDGES = ['i think', 'i guess', 'maybe', 'probably', 'not sure', 'i am not sure', "i'm not sure",
    'i believe', 'perhaps', 'kind of', 'sort of', 'i suppose', 'might be', 'something like'];

  // Generic parts of code names – "AddScoped" is spoken as "scoped", "IDisposable" as "disposable"
  var OPTIONAL_TOKENS = { add: 1, get: 1, set: 1, is: 1, has: 1, i: 1, on: 1, to: 1, as: 1, the: 1, a: 1 };

  var LIMITS = {
    idealPace: [110, 165],   // words per minute
    longPauseMs: 3000,
    shortAnswerWords: 25,
    goodAnswerWords: 50,
    longAnswerWords: 260,
    maxKeyPoints: 10,
    coverageForFullMarks: 0.6 // covering 60% of the weighted key points earns 100
  };

  /* ---------- Text helpers ---------- */

  function splitCamel(text) {
    return text
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  }

  function stem(word) {
    var w = word.toLowerCase().replace(/'s$/, '');
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + 'y';
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /ed$/.test(w) && !/eed$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
    return w;
  }

  function tokenize(text) {
    return splitCamel(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9#+@\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  function countPhrase(text, phrase) {
    var re = new RegExp('(^|[^a-z])' + phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[^a-z])', 'g');
    return ((' ' + text.toLowerCase() + ' ').match(re) || []).length;
  }

  // Levenshtein distance capped at 2 (enough for small speech-recognition mistakes)
  function closeEnough(a, b) {
    if (a === b) return true;
    if (Math.min(a.length, b.length) < 5 || Math.abs(a.length - b.length) > 1) return false;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length] <= 1;
  }

  /* ---------- Model answer → key points ---------- */

  // Remove what can't be spoken: code blocks, diagrams, images, HTML, tip boxes
  function speakableText(markdown) {
    return (markdown || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/^>\s*\*\*(interview tip|common mistake|tip|warning)[\s\S]*?(\n\n|$)/gim, ' ')
      .replace(/<[^>]+>/g, ' ');
  }

  function cleanPhrase(raw) {
    return tokenize(raw).filter(function (t) { return !STOP[t]; }).join(' ');
  }

  /**
   * Extract weighted key points from a model answer.
   * - Bold text and inline code are the strongest signals (weight 2)
   * - The most frequent remaining content words fill the rest (weight 1)
   * Words that already appear in the question are ignored – repeating the question earns nothing.
   */
  function extractKeyPoints(question, answerMarkdown) {
    var text = speakableText(answerMarkdown);
    var questionStems = {};
    tokenize(question).forEach(function (t) { questionStems[stem(t)] = true; });

    var points = [];
    var seen = {};

    function add(label, weight) {
      if (/:\/\/|\/|\|=|;|\{|\}/.test(label)) return; // URLs, paths and code snippets can't be spoken
      label = label.replace(/\(\)$/, '').trim();
      var phrase = cleanPhrase(label);
      if (!phrase || phrase.length < 2 || seen[phrase]) return;
      var tokens = phrase.split(' ');
      var core = tokens.filter(function (t) { return !OPTIONAL_TOKENS[t]; });
      if (core.length) tokens = core;
      if (tokens.length > 5) return;
      // Skip points that only repeat words from the question
      var fresh = tokens.filter(function (t) { return !questionStems[stem(t)]; });
      if (!fresh.length) return;
      seen[phrase] = true;
      points.push({ label: label, tokens: tokens.map(stem), weight: weight });
    }

    var emphasis = /\*\*([^*]+)\*\*|`([^`]+)`/g, m;
    while ((m = emphasis.exec(text)) !== null) {
      var raw = (m[1] || m[2] || '').replace(/[:.,]$/, '');
      if (raw.length <= 40) add(raw, 2);
      if (points.length >= 7) break;
    }

    // Frequent content words not already covered by a phrase
    var covered = {};
    points.forEach(function (p) { p.tokens.forEach(function (t) { covered[t] = true; }); });
    var counts = {}, labels = {};
    var prose = text
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/`[^`]*[\/\][^`]*`/g, ' ')
      .replace(/\*\*|`/g, ' ');
    tokenize(prose).forEach(function (t) {
      if (t.length < 4 || STOP[t] || /^\d+$/.test(t)) return;
      var s = stem(t);
      if (questionStems[s] || covered[s]) return;
      counts[s] = (counts[s] || 0) + 1;
      labels[s] = labels[s] || t;
    });
    // Words used at least twice are real topics; single mentions are only used for short answers
    var ranked = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || b.length - a.length; });
    var repeated = ranked.filter(function (s) { return counts[s] >= 2; });
    var pool = points.length + repeated.length >= 4 ? repeated : ranked;
    pool
      .slice(0, Math.max(0, LIMITS.maxKeyPoints - points.length))
      .forEach(function (s) { points.push({ label: labels[s], tokens: [s], weight: 1 }); });

    return points.slice(0, LIMITS.maxKeyPoints);
  }

  /* ---------- Scoring ---------- */

  function pointCovered(point, answerStems) {
    var hits = point.tokens.filter(function (t) {
      return answerStems.some(function (a) { return closeEnough(a, t); });
    }).length;
    return hits >= Math.ceil(point.tokens.length * 0.6);
  }

  function scoreContent(keyPoints, transcript) {
    var answerStems = tokenize(transcript).map(stem);
    var total = 0, got = 0, covered = [], missed = [];
    keyPoints.forEach(function (p) {
      total += p.weight;
      if (pointCovered(p, answerStems)) { got += p.weight; covered.push(p.label); }
      else missed.push(p.label);
    });
    var ratio = total ? got / total : 0;
    return {
      score: Math.round(100 * Math.min(1, ratio / LIMITS.coverageForFullMarks)),
      coverage: Math.round(ratio * 100),
      covered: covered,
      missed: missed
    };
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function paceScore(wpm) {
    var lo = LIMITS.idealPace[0], hi = LIMITS.idealPace[1];
    if (wpm >= lo && wpm <= hi) return 100;
    if (wpm < lo) return clamp(Math.round(100 - (lo - wpm) * 1.5), 30, 100);
    return clamp(Math.round(100 - (wpm - hi) * 1.2), 30, 100);
  }

  function lengthScore(words) {
    if (words < LIMITS.shortAnswerWords) return 40;
    if (words < LIMITS.goodAnswerWords) return 70;
    if (words > LIMITS.longAnswerWords) return 85;
    return 100;
  }

  function countAll(text, phrases) {
    var found = {};
    var total = 0;
    phrases.forEach(function (p) {
      var n = countPhrase(text, p);
      if (n) { found[p] = n; total += n; }
    });
    return { total: total, found: found };
  }

  /**
   * @param {object} input
   *   transcript   – the answer text
   *   spoken       – true if the answer was spoken (delivery metrics apply)
   *   speakingMs   – time from the first to the last recognised word
   *   longPauses   – number of gaps longer than LIMITS.longPauseMs
   */
  function scoreDelivery(input) {
    var words = tokenize(input.transcript).length;
    var fillers = countAll(input.transcript, FILLERS);
    var hedges = countAll(input.transcript, HEDGES);
    var length = lengthScore(words);
    var hedge = clamp(100 - hedges.total * 20, 40, 100);

    if (!input.spoken) {
      return {
        score: Math.round((length + hedge) / 2),
        words: words, wpm: null, fillers: fillers, hedges: hedges, longPauses: null,
        parts: { length: length, hedges: hedge }
      };
    }

    var minutes = Math.max(input.speakingMs || 0, 1000) / 60000;
    var wpm = Math.round(words / minutes);
    var per100 = words ? (fillers.total / words) * 100 : 0;
    var parts = {
      pace: paceScore(wpm),
      fillers: clamp(Math.round(100 - Math.max(0, per100 - 1) * 15), 20, 100),
      hedges: hedge,
      pauses: clamp(100 - (input.longPauses || 0) * 15, 40, 100),
      length: length
    };
    var sum = 0, n = 0;
    Object.keys(parts).forEach(function (k) { sum += parts[k]; n++; });
    return {
      score: Math.round(sum / n),
      words: words, wpm: wpm, fillers: fillers, hedges: hedges, longPauses: input.longPauses || 0,
      parts: parts
    };
  }

  function label(score) {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs work';
    return 'Keep practising';
  }

  function feedback(content, delivery, spoken) {
    var tips = [];
    if (!delivery.words) return ['No answer was recorded. Try again – even a short definition earns points.'];
    if (content.missed.length && content.score < 100) {
      tips.push('Mention the key points you missed: ' + content.missed.slice(0, 4).join(', ') + '.');
    }
    if (delivery.words < LIMITS.shortAnswerWords) tips.push('Your answer was very short – explain the "why" and give an example.');
    else if (delivery.words > LIMITS.longAnswerWords) tips.push('Your answer was long – lead with a one-sentence summary, then add detail.');
    if (spoken && delivery.wpm !== null) {
      if (delivery.wpm > LIMITS.idealPace[1]) tips.push('You spoke at ' + delivery.wpm + ' words per minute – slow down a little.');
      else if (delivery.wpm < LIMITS.idealPace[0] && delivery.words >= LIMITS.shortAnswerWords) tips.push('You spoke at ' + delivery.wpm + ' words per minute – try to keep a steadier pace.');
      if (delivery.parts.fillers < 80) tips.push('Cut filler words (' + Object.keys(delivery.fillers.found).join(', ') + ') – a short pause sounds more confident.');
      if (delivery.longPauses > 1) tips.push(delivery.longPauses + ' long pauses – structure your answer before you start: definition, how it works, example.');
    }
    if (delivery.hedges.total) tips.push('Avoid hedging phrases (' + Object.keys(delivery.hedges.found).join(', ') + ') – state what you know clearly.');
    if (!tips.length) tips.push('Great answer – clear, complete and confident.');
    return tips;
  }

  /**
   * Score one answer.
   * @returns {{confidence:number,label:string,content:object,delivery:object,tips:string[]}}
   */
  function scoreAnswer(question, modelAnswer, input) {
    var keyPoints = extractKeyPoints(question, modelAnswer);
    var content = scoreContent(keyPoints, input.transcript);
    var delivery = scoreDelivery(input);
    var confidence = Math.round(0.6 * content.score + 0.4 * delivery.score);
    if (!tokenize(input.transcript).length) { confidence = 0; delivery.score = 0; }
    return {
      confidence: confidence,
      label: label(confidence),
      content: content,
      delivery: delivery,
      tips: feedback(content, delivery, input.spoken)
    };
  }

  /* ---------- Topic pages → questions ---------- */

  // Same id docsify gives a heading, so results can link straight to the question
  function slugify(title) {
    return title.toLowerCase()
      .replace(/`/g, '')
      .replace(/[^a-z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  /**
   * Split a topic page into questions. Placeholder questions ("Answer coming soon") are skipped.
   * @returns {{title:string, section:string, level:string, answer:string, id:string}[]}
   */
  function parsePage(markdown) {
    var questions = [];
    var section = '';
    var current = null;

    function finish() {
      if (!current) return;
      current.answer = current.lines.join('\n').trim();
      delete current.lines;
      if (current.answer && !/^\*answer coming soon\.?\*$/i.test(current.answer)) questions.push(current);
      current = null;
    }

    (markdown || '').replace(/\r\n/g, '\n').split('\n').forEach(function (line) {
      var h = /^(#{1,3}) (.*)$/.exec(line);
      if (h) {
        finish();
        if (h[1] === '##') section = h[2].trim();
        if (h[1] === '###') {
          current = { title: h[2].trim(), section: section, level: 'beginner', lines: [], id: slugify(h[2]) };
        }
        return;
      }
      if (!current) return;
      var level = /<!--\s*level:\s*(beginner|intermediate|advanced)\s*-->/i.exec(line);
      if (level) { current.level = level[1].toLowerCase(); return; }
      current.lines.push(line);
    });
    finish();
    return questions;
  }

  // A question works in a spoken mock interview only if its answer has enough prose to score against
  function isSpeakable(question) {
    return extractKeyPoints(question.title, question.answer).length >= 3;
  }

  return {
    LIMITS: LIMITS,
    parsePage: parsePage,
    isSpeakable: isSpeakable,
    slugify: slugify,
    stem: stem,
    tokenize: tokenize,
    extractKeyPoints: extractKeyPoints,
    scoreContent: scoreContent,
    scoreDelivery: scoreDelivery,
    scoreAnswer: scoreAnswer,
    label: label
  };
});
