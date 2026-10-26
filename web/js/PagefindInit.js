(function () {
  'use strict';

  var overlay = document.getElementById('search-overlay');
  var openBtn = document.getElementById('search-open-btn') || document.getElementById('open-search-btn');
  var closeBtn = document.querySelector('.close-search-btn');
  var root = document.getElementById('pagefind-ui-root');

  if (!overlay || !openBtn || !root) {
    console.warn('Search DOM elements not found. Skipping Pagefind init.');
    return;
  }

  var isInitialized = false;
  var lastFocusedElement = null;

  var focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  function getBaseUrl() {
    var meta = document.querySelector('meta[name="pagefind-base"]');
    var base = meta && meta.content ? meta.content : '/';
    if (base.charAt(base.length - 1) !== '/') base += '/';
    return base;
  }

  function getFocusables(container) {
    return Array.prototype.slice.call(container.querySelectorAll(focusableSelector))
      .filter(function (el) {
        return !el.hasAttribute('disabled') && el.offsetParent !== null;
      });
  }

  function handleKeydown(event) {
    if (!overlay.classList.contains('active')) return;

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key === 'Tab') {
      var focusables = getFocusables(overlay);
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function initPagefind() {
    if (isInitialized) return;

    var baseUrl = getBaseUrl();
    var basePath = baseUrl + 'pagefind/';

    console.log('[Pagefind] Initializing with basePath:', basePath);

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + 'pagefind-ui.css';
    document.head.appendChild(link);

    var script = document.createElement('script');
    script.src = basePath + 'pagefind-ui.js';

    script.onload = function () {
      if (typeof window.PagefindUI === 'undefined') {
        console.error('PagefindUI is not defined after script load');
        root.innerHTML = '<p style="color:red; padding:1rem;">Ошибка инициализации поиска.</p>';
        return;
      }

      new window.PagefindUI({
        element: '#pagefind-ui-root',
        baseUrl: baseUrl,
        language: 'ru',
        showSubResults: true,
        excerptLength: 30,
        highlightParam: 'highlight',
        translations: {
          placeholder: 'Введите запрос...',
          clear_search: 'Очистить',
          load_more: 'Загрузить ещё',
          no_results: 'Ничего не найдено'
        }
      });

      isInitialized = true;

      var pfInput = document.querySelector('.pagefind-ui__search-input');
      if (!pfInput) return;

      pfInput.addEventListener('input', function () {
        var cur = pfInput.value;

        if (cur.indexOf('"') === -1) {
          var words = cur.trim().split(/\s+/).filter(Boolean);
          if (words.length < 2) return;

          var want = '"' + cur.trim() + '"';
          if (want === cur) return;

          pfInput.value = want;
          var caret = want.length - 1;
          try { pfInput.setSelectionRange(caret, caret); } catch (e) {}
          return;
        }

        if (
          cur.length >= 2 &&
          cur.charCodeAt(0) === 34 &&
          cur.charCodeAt(cur.length - 1) === 34
        ) {
          var inner = cur.slice(1, -1).trim();
          var innerWords = inner.length ? inner.split(/\s+/).filter(Boolean) : [];

          if (innerWords.length <= 1) {
            if (inner === cur) return;
            pfInput.value = inner;
            var caret2 = inner.length;
            try { pfInput.setSelectionRange(caret2, caret2); } catch (e2) {}
          }
        }
      }, true);
    };

    script.onerror = function () {
      console.error('Failed to load Pagefind UI script');
      root.innerHTML = '<p style="color:red; padding:1rem;">Ошибка загрузки скрипта поиска. Проверьте консоль (F12).</p>';
    };

    document.head.appendChild(script);
  }

  function openModal() {
    lastFocusedElement = document.activeElement;

    overlay.removeAttribute('hidden');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    initPagefind();

    window.setTimeout(function () {
      var input = document.querySelector('.pagefind-ui__search-input');
      if (input) {
        input.focus();
      } else {
        var focusables = getFocusables(overlay);
        if (focusables.length) focusables[0].focus();
      }
    }, 120);
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  }

  openBtn.addEventListener('click', openModal);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeModal();
  });

  overlay.addEventListener('keydown', handleKeydown);
})();
