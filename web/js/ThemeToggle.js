// INFRA-100: Dark Mode Toggle Logic
(function() {
  'use strict';
  const themeToggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  if (!themeToggleBtn) return;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  };

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
