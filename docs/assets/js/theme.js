/* Light/dark mode – loaded in <head> so the theme is applied before the page renders */
(function () {
  var KEY = 'theme';
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Base theme stylesheets (only on pages that load them)
    var light = document.getElementById('theme-light');
    var dark = document.getElementById('theme-dark');
    if (light) light.media = theme === 'light' ? 'all' : 'not all';
    if (dark) dark.media = theme === 'dark' ? 'all' : 'not all';
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }

  window.toggleTheme = function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (e) { }
    apply(next);
  };

  // Follow the system setting until the visitor picks a theme
  systemDark.addEventListener('change', function (e) {
    if (!saved()) apply(e.matches ? 'dark' : 'light');
  });

  apply(saved() || (systemDark.matches ? 'dark' : 'light'));
})();
