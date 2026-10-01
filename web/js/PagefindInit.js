// INFRA-097: Pagefind Initialization (Official Vanilla JS approach)

(function() {
  'use strict';

  const overlay = document.getElementById('search-overlay');
  const openBtn = document.getElementById('open-search-btn');
  const closeBtn = document.querySelector('.close-search-btn');

  if (!overlay || !openBtn) {
    console.warn('Search DOM elements not found. Skipping Pagefind init.');
    return;
  }

  let isInitialized = false;

  const initPagefind = () => {
    if (isInitialized) return;

    // 1. Определяем базовый путь для подкаталога GitHub Pages
    const isSubdir = window.location.pathname.startsWith('/obrazslov/');
    const basePath = isSubdir ? '/obrazslov/pagefind/' : '/pagefind/';
    const baseUrl = isSubdir ? '/obrazslov/' : '/';

    console.log(`[Pagefind] Initializing with basePath: ${basePath}`);

    // 2. Динамически загружаем CSS интерфейса
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + 'pagefind-ui.css';
    document.head.appendChild(link);

    // 3. Динамически загружаем JS интерфейс
    const script = document.createElement('script');
    script.src = basePath + 'pagefind-ui.js';

    script.onload = () => {
      if (typeof window.PagefindUI !== 'undefined') {
        // 4. Инициализируем UI с ЯВНЫМ указанием русского языка
        new window.PagefindUI({
          element: "#pagefind-ui-root",
          baseUrl: baseUrl,
          language: 'ru', // КРИТИЧЕСКИ ВАЖНО: правильный токенайзер и стемминг для русского языка
          showSubResults: true,
          excerptLength: 30,
          highlightParam: 'highlight',
          translations: {
            placeholder: 'Введите запрос...',
            clear_search: 'Очистить',
            load_more: 'Загрузить ещё',
            no_results: 'Ничего не найдено',
          }
        });
        isInitialized = true;
        console.log('✅ Pagefind UI successfully initialized with Russian language support');
      } else {
        console.error('❌ PagefindUI is not defined after script load');
      }
    };

    script.onerror = (e) => {
      console.error('❌ Failed to load Pagefind UI script:', e);
      const root = document.getElementById('pagefind-ui-root');
      if (root) {
        root.innerHTML = '<p style="color:red; padding: 1rem;">Ошибка загрузки скрипта поиска. Проверьте консоль (F12).</p>';
      }
    };

    document.head.appendChild(script);
  };

  // Обработчик открытия
  openBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    initPagefind();

    setTimeout(() => {
      const input = document.querySelector('.pagefind-ui__search-input');
      if (input) input.focus();
    }, 200);
  });

  // Обработчики закрытия
  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

})();
