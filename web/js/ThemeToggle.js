// INFRA-100: Theme Toggle (Click handler only)
(function() {
  'use strict';
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', newTheme);
    console.log('%c[THEME-TOGGLE] Тема изменена на: ' + newTheme, 'color: #fbbc04; font-weight: bold;');
  });
})();
