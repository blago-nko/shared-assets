// INFRA-082 V5 FINAL: Dynamic Menu, Unified Popovers & Image A11y
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
      // Sun icon
      svg.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    } else {
      // Moon icon
      svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  function closeAllPopovers() {
    document.querySelectorAll('.dock-popover').forEach(el => el.remove());
    document.querySelectorAll('.dock-overlay').forEach(el => el.remove());
  }

  // Generic Popover Creator (Always Centered)
  function createPopover(items) {
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
        a.textContent = item.label;
        // Internal links don't need target blank usually, but safe to keep or remove based on preference
        // For menu items, they are internal. For share, external.
        if (item.external) {
             a.target = '_blank';
             a.rel = 'noopener noreferrer';
        }
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
        { type: 'link', label: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, external: true },
        { type: 'link', label: 'VK', href: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, external: true },
        { type: 'link', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`, external: true },
        { type: 'link', label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, external: true },
        { type: 'link', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, external: true },
        { type: 'action', label: '📋 Скопировать ссылку', action: () => navigator.clipboard.writeText(url).then(() => alert('Ссылка скопирована')) }
      ];
      
      createPopover(items);
    });
  }

  // --- Menu Button (Dynamic Links Extraction) ---
  const menuBtn = document.getElementById('sticky-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Try to find real navigation links from header/nav
      // Selector might vary depending on theme structure, trying common patterns
      let navLinks = [];
      const mainNav = document.querySelector('header nav ul') || document.querySelector('.main-navigation ul');
      
      if (mainNav) {
        const lis = mainNav.querySelectorAll('li:not(.nav-search-item)'); // Exclude search trigger
        lis.forEach(li => {
          const anchor = li.querySelector('a');
          if (anchor && anchor.href && anchor.textContent.trim()) {
            navLinks.push({
              type: 'link',
              label: anchor.textContent.trim(),
              href: anchor.getAttribute('href'), // Use relative path for internal consistency
              external: false
            });
          }
        });
      }

      // Fallback if extraction fails (hardcoded defaults)
      if (navLinks.length === 0) {
         navLinks = [
          { type: 'link', label: 'Главная', href: '/', external: false },
          { type: 'link', label: 'Статьи', href: '/posts/', external: false },
          { type: 'link', label: 'О нас', href: '/about/', external: false },
          { type: 'link', label: 'Ярлыки', href: '/tags/', external: false }
        ];
      }

      createPopover(navLinks);
    });
  }

  // --- Top Button ---
  const topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Image Accessibility Enhancement ---
  // Adds native tooltip (title attribute) if missing, using alt text or caption
  document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.post-content img, article img');
    images.forEach(img => {
      // If no title exists, try to generate one from alt or nearby figcaption
      if (!img.getAttribute('title')) {
        const alt = img.getAttribute('alt');
        const parentFigure = img.closest('figure');
        let captionText = '';
        
        if (parentFigure) {
          const cap = parentFigure.querySelector('figcaption');
          if (cap) captionText = cap.textContent.trim();
        }

        const finalTitle = captionText || alt;
        if (finalTitle) {
          img.setAttribute('title', finalTitle);
        }
      }
    });
  });

  // Global Escape Key Handler
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllPopovers();
    }
  });

})();
