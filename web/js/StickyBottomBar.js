// INFRA-082 REFACTOR: Popover Menu & Unified Theme Control
(function () {
  
  // --- Helpers ---
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('dock-theme-btn');
    if (!btn) return;
    const svg = btn.querySelector('svg');
    if (!svg) return;

    if (theme === 'dark') {
      svg.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    } else {
      svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  // --- Init Theme Button in Dock ---
  const dockThemeBtn = document.getElementById('dock-theme-btn');
  if (dockThemeBtn) {
    const initialTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);

    dockThemeBtn.addEventListener('click', function () {
      const current = getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // --- Share Button (Custom Menu Only) ---
  const shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showCustomShareMenu(window.location.href, document.title);
    });
  }

  function showCustomShareMenu(url, title) {
    closeAllPopovers(); // Закрываем другие меню, если открыты
    
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const networks = [
      { name: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
      { name: 'VK', href: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}` },
      { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
      { name: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
      { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` }
    ];

    let html = `<div id="custom-share-menu" class="mobile-menu-popover is-open">`;
    networks.forEach(net => {
      html += `<a href="${net.href}" target="_blank" rel="noopener noreferrer">${net.name}</a>`;
    });
    html += `<button onclick="navigator.clipboard.writeText('${url}').then(()=>alert('Ссылка скопирована'));closeAllPopovers();" style="border:none;background:none;text-align:left;padding:8px 16px;font-size:14px;color:var(--color-text,#333);cursor:pointer;">📋 Скопировать ссылку</button>`;
    html += `</div><div id="share-overlay" class="menu-overlay is-active"></div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    const overlay = document.getElementById('share-overlay');
    if (overlay) overlay.addEventListener('click', closeAllPopovers);
  }

  // --- Menu Button (Popover Logic for Desktop/Landscape) ---
  const menuBtn = document.getElementById('sticky-menu-btn');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Проверяем разрешение: если мобильный портрет -> используем старый Drawer
      const isMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
      
      if (isMobilePortrait) {
        toggleMobileDrawer(); // Старая логика для телефона
      } else {
        showNavPopover();     // Новая логика для десктопа/ландшафта
      }
    });
  }

  function showNavPopover() {
    closeAllPopovers();

    // Получаем ссылки из основного навигационного меню (предположим, они есть в header nav)
    // Или хардкодим основные разделы сайта
    const links = [
      { name: 'Главная', href: '/' },
      { name: 'Статьи', href: '/posts/' },
      { name: 'О нас', href: '/about/' }
    ];

    let html = `<div id="nav-popover" class="mobile-menu-popover is-open">`;
    links.forEach(link => {
      html += `<a href="${link.href}">${link.name}</a>`;
    });
    html += `</div><div id="nav-overlay" class="menu-overlay is-active"></div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    const overlay = document.getElementById('nav-overlay');
    if (overlay) overlay.addEventListener('click', closeAllPopovers);
  }

  function closeAllPopovers() {
    const menus = ['custom-share-menu', 'nav-popover'];
    const overlays = ['share-overlay', 'nav-overlay'];
    
    menus.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    overlays.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllPopovers();
      // Also close mobile drawer if open
      const drawer = document.getElementById('mobile-menu');
      if (drawer && !drawer.hidden) {
         drawer.classList.remove('mobile-menu--open');
         setTimeout(() => { drawer.hidden = true; }, 250);
         document.body.classList.remove('no-scroll');
      }
    }
  });

  // --- Top Button ---
  const topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Legacy Mobile Drawer Support (Only for Portrait) ---
  function toggleMobileDrawer() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;

    if (menu.hidden) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('mobile-menu--open'));
      document.body.classList.add('no-scroll');
    } else {
      menu.classList.remove('mobile-menu--open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => { menu.hidden = true; }, 250);
    }
  }

})();
