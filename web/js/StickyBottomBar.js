document.addEventListener('DOMContentLoaded', () => {
  console.log('[DOCK] Initializing...');
  
  const getElement = (id) => document.getElementById(id);

  // 1. Theme Toggle
  const themeBtn = getElement('dock-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        // Optional: Update icon to Sun
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        // Optional: Update icon to Moon
      }
    });
  }

  // 2. Share Button
  const shareBtn = getElement('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, url: window.location.href });
        } catch (err) {
          console.error('Share failed:', err);
        }
      } else {
        alert('Sharing not supported.');
      }
    });
  }

  // 3. Scroll Top
  const topBtn = getElement('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Menu Toggle (Mobile)
  const menuBtn = getElement('mobile-menu-btn') || getElement('sticky-menu-btn');
  const mobileMenu = getElement('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.hasAttribute('hidden');
      if (isOpen) {
        mobileMenu.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.removeAttribute('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });
    
    const backdrop = mobileMenu.querySelector('.mobile-menu__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        mobileMenu.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }
});
