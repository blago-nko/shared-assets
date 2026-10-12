// INFRA-082: Логика кнопок адаптивного навигационного дока
(function () {
  // 1. Кнопка "Наверх"
  const topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Кнопка "Поделиться"
  const shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          console.log('Ссылка скопирована в буфер обмена');
        });
      }
    });
  }

  // 3. Кнопка "Меню" (Drawer)
  const menu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('sticky-menu-btn');
  if (menu && menuBtn) {
    const open = function () {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('mobile-menu--open'); });
      document.body.classList.add('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'true');
    };
    const close = function () {
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
