// INFRA-082: Adaptive sticky navigation dock
(function () {
  // 1. Кнопка "Наверх"
  var topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Кнопка "Поделиться"
  var shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href
        }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          alert('Ссылка скопирована в буфер обмена');
        }).catch(function () {
          window.prompt('Скопируйте ссылку:', window.location.href);
        });
      } else {
        window.prompt('Скопируйте ссылку:', window.location.href);
      }
    });
  }

  // 3. Кнопка "Меню": открытие/закрытие drawer-панели
  var menu = document.getElementById('mobile-menu');
  var menuBtn = document.getElementById('sticky-menu-btn');

  if (menu && menuBtn) {
    var lastFocused = null;

    var open = function () {
      lastFocused = document.activeElement;

      menu.hidden = false;
      menu.setAttribute('aria-hidden', 'false');

      requestAnimationFrame(function () {
        menu.classList.add('mobile-menu--open');
      });

      document.body.classList.add('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'true');

      var focusable = menu.querySelector('button, a[href]');
      if (focusable) {
        focusable.focus();
      }
    };

    var close = function () {
      menu.classList.remove('mobile-menu--open');
      document.body.classList.remove('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');

      setTimeout(function () {
        menu.hidden = true;

        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        } else {
          menuBtn.focus();
        }
      }, 250);
    };

    menuBtn.addEventListener('click', function () {
      if (menu.hidden) {
        open();
      } else {
        close();
      }
    });

    menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        close();
      }
    });

    // Закрываем мобильное меню при переходе на tablet/desktop breakpoint
    var desktopQuery = window.matchMedia('(min-width: 768px)');

    var closeIfDesktop = function () {
      if (desktopQuery.matches && !menu.hidden) {
        close();
      }
    };

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', closeIfDesktop);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(closeIfDesktop);
    }
  }
})();
