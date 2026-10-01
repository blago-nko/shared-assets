// INFRA-097: Pagefind Initialization (Official Vanilla JS approach)

(function() {
  'use strict';

  const overlay = document.getElementById('search-overlay');
  const openBtn = document.getElementById('search-open-btn') || document.getElementById('open-search-btn');
  const closeBtn = document.querySelector('.close-search-btn');

  if (!overlay || !openBtn) {
    console.warn('Search DOM elements not found. Skipping Pagefind init.');
    return;
  }

  let isInitialized = false;

  const initPagefind = () => {
    if (isInitialized) return;

    const isSubdir = window.location.pathname.startsWith('/obrazslov/');
    const basePath = isSubdir ? '/obrazslov/pagefind/' : '/pagefind/';
    const baseUrl = isSubdir ? '/obrazslov/' : '/';

    console.log(`[Pagefind] Initializing with basePath: ${basePath}`);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + 'pagefind-ui.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = basePath + 'pagefind-ui.js';

    script.onload = () => {
      if (typeof window.PagefindUI !== 'undefined') {
        new window.PagefindUI({
          element: "#pagefind-ui-root",
          baseUrl: baseUrl,
          language: 'ru',
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

        // INFRA-097: automatic phrase mode for multi-word queries (capture-normalize, NO dispatch).
        // Pagefind has NO stopwords, so a single-letter preposition ("о") in "О нас" matches every
        // page and pollutes ranking + highlighting. Rule set (final, edge-case-tested):
        //   • No quotes in value  -> wrap into "..." iff >=2 words (1 word / spacing untouched).
        //   • Any quote in value  -> RESPECT it (explicit user phrase or our finished phrase), EXCEPT
        //     a symmetric ONE-word phrase "word" which we auto-unwrap to word (semantically identical
        //     for Pagefind, and it prevents a stuck quote when the user deletes the 2nd word back).
        // Done in CAPTURE so Pagefind reads the normalized value on the SAME event => one search,
        // no re-dispatch, no recursion guard. Caret kept inside quotes on wrap; at end on unwrap.
        const pfInput = document.querySelector('.pagefind-ui__search-input');
        if (pfInput) {
          pfInput.addEventListener('input', function () {
            const cur = pfInput.value;

            if (cur.indexOf('"') === -1) {
              // No quotes at all: only wrap when there are >=2 words.
              const words = cur.trim().split(/\s+/).filter(Boolean);
              if (words.length < 2) return;            // 0..1 word: leave as-is (keeps spacing while typing)
              const want = '"' + cur.trim() + '"';
              if (want === cur) return;
              pfInput.value = want;
              const caret = want.length - 1;            // inside the closing quote
              try { pfInput.setSelectionRange(caret, caret); } catch (e) {}
              return;
            }

            // Has quote(s): respect explicit/user input by default. Auto-unwrap ONLY a symmetric
            // one-word phrase so deleting the 2nd word of an auto-phrase leaves no stuck quotes.
            if (cur.length >= 2 && cur.charCodeAt(0) === 34 && cur.charCodeAt(cur.length - 1) === 34) {
              const inner = cur.slice(1, -1).trim();
              const iw = inner.length ? inner.split(/\s+/).filter(Boolean) : [];
              if (iw.length <= 1) {                     // "word" or "" -> unwrap to word (safe, equivalent)
                if (inner === cur) return;
                pfInput.value = inner;
                const caret = inner.length;
                try { pfInput.setSelectionRange(caret, caret); } catch (e) {}
              }
              // else: >=2 words inside quotes = valid phrase (ours or explicit) -> untouched.
            }
            // asymmetric quotes (user mid-typing an explicit phrase) -> untouched.
          }, true);
        }
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

  openBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    initPagefind();

    setTimeout(() => {
      const input = document.querySelector('.pagefind-ui__search-input');
      if (input) input.focus();
    }, 200);
  });

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
