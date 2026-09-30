// INFRA-100: Dark Mode Toggle Logic - FIXED PERSISTENCE

(function() {
  'use strict';
  
  const themeToggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  if (!themeToggleBtn) return;

  // Функция применения темы
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);
    console.log('Theme applied and saved:', theme);
  };

  // Функция получения текущей темы
  const getCurrentTheme = () => {
    return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  };

  // Обработчик клика
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // Слушатель изменений системной темы (только если пользователь не выбрал вручную)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

})();
