// INFRA-082 V4 FINAL: Unified Dock, Theme & Popover Logic
(function () {
  
  // --- Helpers ---
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('dock-theme-btn');
    if (!btn) return;
    const svg = btn.querySelector('svg');
    if (!svg) return;

    if (theme === 'dark') {
      // Sun icon (Click to go Light)
      svg.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    } else {
      // Moon icon (Click to go Dark)
      svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  // Close any existing popovers
  function closeAllPopovers() {
    document.querySelectorAll('.dock-popover').forEach(el => el.remove());
    document.querySelectorAll('.dock-overlay').forEach(el => el.remove());
  }

  // Create a generic popover structure
  function createPopover(items, anchorElement = null) {
    closeAllPopovers();

    const overlay = document.createElement('div');
    overlay.className = 'dock-overlay is-active';
    overlay.addEventListener('click', closeAllPopovers);
    document.body.appendChild(overlay);

    const popover = document.createElement('div');
    popover.className = 'dock-popover is-open';
    
    items.forEach(item => {
      if (item.type === 'link') {
        const a = document.createElement('a');
        a.href = item.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.label;
        popover.appendChild(a);
      } else if (item.type === 'action') {
        const btn = document.createElement('button');
        btn.className = 'popover-action';
        btn.textContent = item.label;
        btn.onclick = () => {
          item.action();
          closeAllPopovers();
        };
        popover.appendChild(btn);
      }
    });

    document.body.appendChild(popover);

    // Positioning Logic
    if (anchorElement && window.innerWidth >= 768) {
      // Anchor Mode (Desktop/Hybrid): Above the button
      const rect = anchorElement.getBoundingClientRect();
      popover.style.bottom = `${window.innerHeight - rect.top + 8}px`; 
      popover.style.right = `${window.innerWidth - rect.right}px`;
      popover.style.left = 'auto';
      popover.style.top = 'auto';
    } else {
      // Center Mode (Mobile Portrait): Screen Center
      popover.style.top = '50%';
      popover.style.left = '50%';
      popover.style.transform = 'translate(-50%, -50%)';
      popover.style.bottom = 'auto';
      popover.style.right = 'auto';
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

  // --- Share Button ---
  const shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const url = window.location.href;
      const title = document.title;
      
      const items = [
        { type: 'link', label: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
        { type: 'link', label: 'VK', href: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
        { type: 'link', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}` },
        { type: 'link', label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
        { type: 'link', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
        { type: 'action', label: '📋 Скопировать ссылку', action: () => navigator.clipboard.writeText(url).then(() => alert('Ссылка скопирована')) }
      ];
      
      createPopover(items, shareBtn);
    });
  }

  // --- Menu Button ---
  const menuBtn = document.getElementById('sticky-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Define navigation links
      const items = [
        { type: 'link', label: 'Главная', href: '/' },
        { type: 'link', label: 'Статьи', href: '/posts/' },
        { type: 'link', label: 'О нас', href: '/about/' },
        { type: 'link', label: 'Ярлыки', href: '/tags/' }
      ];
      
      createPopover(items, menuBtn);
    });
  }

  // --- Top Button ---
  const topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Global Escape Key Handler
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllPopovers();
    }
  });

})();
