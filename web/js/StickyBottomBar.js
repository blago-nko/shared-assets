// INFRA-082 FINAL SPEC: Unified Dock Logic
(function () {
  // Helper: Get current theme state
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  // Helper: Set theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  }

  // Update Icon inside the dock button
  function updateThemeIcon(theme) {
    const btn = document.getElementById('dock-theme-btn');
    if (!btn) return;
    
    const svg = btn.querySelector('svg');
    if (!svg) return;

    if (theme === 'dark') {
      // Sun icon for Dark Mode (click to go Light)
      svg.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    } else {
      // Moon icon for Light Mode (click to go Dark)
      svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  // 1. Init Theme Button in Dock
  const dockThemeBtn = document.getElementById('dock-theme-btn');
  if (dockThemeBtn) {
    // Initial render based on saved/system preference
    const initialTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);

    dockThemeBtn.addEventListener('click', function () {
      const current = getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // 2. Share Button (Custom Menu Only)
  const shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showCustomShareMenu(window.location.href, document.title);
    });
  }

  function showCustomShareMenu(url, title) {
    const oldMenu = document.getElementById('custom-share-menu');
    if (oldMenu) oldMenu.remove();

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const networks = [
      { name: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
      { name: 'VK', href: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}` },
      { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
      { name: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
      { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` }
    ];

    let html = `<div id="custom-share-menu" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--color-bg, #fff); border: 1px solid var(--color-border, #ddd); border-radius: 12px; padding: 16px; z-index: 2000; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 8px; min-width: 200px;">`;
    
    networks.forEach(net => {
      html += `<a href="${net.href}" target="_blank" rel="noopener noreferrer" style="display: block; text-decoration: none; color: var(--color-text, #333); font-size: 14px; padding: 8px; border-radius: 6px;" onmouseover="this.style.backgroundColor='var(--color-bg-secondary, #f5f5f5)'" onmouseout="this.style.backgroundColor='transparent'">${net.name}</a>`;
    });

    html += `<button onclick="navigator.clipboard.writeText('${url}').then(()=>alert('Ссылка скопирована'));document.getElementById('custom-share-menu').remove();" style="margin-top: 4px; padding: 8px; border: 1px dashed var(--color-border, #ddd); background: transparent; cursor: pointer; border-radius: 6px; font-size: 13px; color: var(--color-text, #333);">📋 Скопировать ссылку</button>`;
    html += `</div><div id="share-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1999;"></div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    // Close handlers
    const overlay = document.getElementById('share-overlay');
    const menu = document.getElementById('custom-share-menu');
    
    function closeMenu() {
      if (menu) menu.remove();
      if (overlay) overlay.remove();
    }

    if (overlay) overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeMenu();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  // 3. Top Button
  const topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Menu Button (Only active on Mobile Portrait due to CSS hiding it elsewhere)
  const menuBtn = document.getElementById('sticky-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      if (mobileMenu.hidden) {
        mobileMenu.hidden = false;
        requestAnimationFrame(() => mobileMenu.classList.add('mobile-menu--open'));
        document.body.classList.add('no-scroll');
      } else {
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.classList.remove('no-scroll');
        setTimeout(() => { mobileMenu.hidden = true; }, 250);
      }
    });
  }
})();
