// INFRA-097: Pagefind Initialization Script

(function() {
  // Проверка наличия элементов DOM
  const overlay = document.getElementById('search-overlay');
  const openBtn = document.getElementById('open-search-btn');
  const closeBtn = document.querySelector('.close-search-btn');
  
  if (!overlay || !openBtn) {
    console.warn('Search elements not found in DOM. Skipping initialization.');
    return;
  }

  let pagefindInstance = null;
  let isLoaded = false;

  // Функция загрузки библиотеки Pagefind
  async function loadPagefind() {
    if (isLoaded) return;
    
    try {
      // Динамическая импортирование модуля ES
      // Путь /pagefind/pagefind.js предполагает, что индекс лежит в корне сайта после билда
      const module = await import(new URL('../pagefind/pagefind.js', import.meta.url).href);
      
      // Инициализация экземпляра
      pagefindInstance = new module.PagefindUI({
        element: '#pagefind-ui-root',
        showSubResults: true,
        translations: {
          placeholder: 'Введите запрос...',
          clear_search_label: 'Очистить',
          load_more: 'Загрузить ещё',
          no_results: 'Ничего не найдено',
          results_count_1: '{count} результат',
          results_count_n: '{count} результата',
        },
        excerptLength: 20,
        sort: {
          field: 'date',
          direction: 'desc'
        }
      });
      
      isLoaded = true;
      console.log('✅ Pagefind initialized successfully.');
    } catch (error) {
      console.error('❌ Failed to load Pagefind:', error);
      // Fallback: можно показать сообщение об ошибке пользователю
      const root = document.getElementById('pagefind-ui-root');
      if(root) root.innerHTML = '<p style="color:red;">Ошибка загрузки поиска. Попробуйте позже.</p>';
    }
  }

  // Обработчик открытия оверлея
  openBtn.addEventListener('click', async () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    
    // Ленивая загрузка: грузим Pagefind только при первом открытии
    if (!isLoaded) {
      await loadPagefind();
    } else {
      // Если уже загружено, просто фокусируем поле ввода
      setTimeout(() => {
        const input = document.querySelector('.pagefind-ui__search-input');
        if(input) input.focus();
      }, 100);
    }
  });

  // Обработчик закрытия
  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Возвращаем скролл
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Закрытие по клику вне контейнера
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Закрытие по клавише Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

})();
