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

  function addPageStats() {
    var section = document.querySelector('.markdown-section');
    var title = section && section.querySelector('h1');
    var questions = section ? section.querySelectorAll('h3').length : 0;
    if (!title || !questions) return;

    var words = section.textContent.trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    var comingSoon = !!section.querySelector('blockquote.callout-note strong') &&
      /coming soon/i.test(section.querySelector('blockquote.callout-note strong').textContent);

    var meta = document.createElement('p');
    meta.className = 'page-meta';
    meta.textContent = comingSoon
      ? questions + ' questions planned · coming soon'
      : questions + ' questions · ' + minutes + ' min read';
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

  // Home page: show the number of questions on each topic card
  function addCardCounts() {
    document.querySelectorAll('.topic-card').forEach(function (card) {
      if (card.querySelector('.topic-count')) return;
      var page = card.getAttribute('href').replace('#/', '');
      fetch(page + '.md').then(function (res) {
        return res.ok ? res.text() : '';
      }).then(function (text) {
        var count = (text.match(/^### /gm) || []).length;
        if (!count) return;
        var span = document.createElement('span');
        span.className = 'topic-count';
        span.textContent = count + ' questions';
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
      addPageStats();
      addCardCounts();
      renderDiagrams();
      onScroll();
    });
  };
})();
