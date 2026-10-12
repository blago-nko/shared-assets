// INFRA-082: Sticky Bottom Bar (всегда виден) + мобильное меню-drawer
(function () {
  // Кнопка "Наверх": плавный скролл к началу страницы
  var topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Кнопка "Поделиться": Web Share API, fallback — копирование ссылки
  var shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          alert('Ссылка скопирована в буфер обмена');
        });
      }
    });
  }

  // Кнопка "Меню": открытие/закрытие drawer-панели
  var menu = document.getElementById('mobile-menu');
  var menuBtn = document.getElementById('sticky-menu-btn');
  if (menu && menuBtn) {
    var open = function () {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('mobile-menu--open'); });
      document.body.classList.add('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'true');
    };
    var close = function () {
      menu.classList.remove('mobile-menu--open');
      document.body.classList.remove('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'false');
      setTimeout(function () { menu.hidden = true; }, 250);
    };
    menuBtn.addEventListener('click', function () { menu.hidden ? open() : close(); });
    menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) close();
    });
  }
})();
