document.addEventListener('DOMContentLoaded', () => {
  console.log('[DOCK] Initializing State Manager...');

  // Helpers
  const getElement = (id) => document.getElementById(id);
  
  /**
   * Opens a modal by ID
   */
  function openModal(modalId) {
    const modal = getElement(modalId);
    if (!modal) return;
    
    // Close others first to prevent stacking issues
    document.querySelectorAll('.dock-modal-overlay').forEach(m => {
      m.classList.remove('active');
      m.setAttribute('aria-hidden', 'true');
    });

    modal.classList.add('active');
    modal.removeAttribute('hidden'); // Remove hidden attribute for accessibility tools
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock scroll
    
    // Focus trap simple implementation
    setTimeout(() => {
      const focusable = modal.querySelector('a, button');
      if(focusable) focusable.focus();
    }, 100);
  }

  /**
   * Closes a modal by ID
   */
  function closeModal(modalId) {
    const modal = getElement(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    // Keep hidden attribute removed once initialized, rely on CSS visibility/opacity
    // Or re-add it if strict HTML validity is preferred during inactive state
    // modal.setAttribute('hidden', ''); 
    
    // Unlock scroll only if no other modals are active
    if (!document.querySelector('.dock-modal-overlay.active')) {
       document.body.style.overflow = '';
    }
  }

  // --- 1. THEME TOGGLE ---
  const themeBtn = getElement('dock-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- 2. SCROLL TOP ---
  const topBtn = getElement('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. MENU MODAL CONTROLS ---
  const menuTrigger = getElement('sticky-menu-btn');
  if (menuTrigger) {
    menuTrigger.addEventListener('click', () => openModal('modal-menu'));
  }

  // --- 4. SHARE MODAL CONTROLS & LOGIC ---
  const shareTrigger = getElement('sticky-share-btn');
  if (shareTrigger) {
    shareTrigger.addEventListener('click', () => {
      // Prepare URLs before opening
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      
      const links = {
        telegram: `https://t.me/share/url?url=${url}&text=${title}`,
        vkontakte: `https://vk.com/share.php?url=${url}&title=${title}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`,
        email: `mailto:?subject=${title}&body=${url}`
      };

      // Update href attributes dynamically
      Object.keys(links).forEach(key => {
        const btn = document.querySelector(`[data-social="${key}"]`);
        if(btn && btn.tagName === 'A') btn.href = links[key];
      });

      openModal('modal-share');
    });
  }

  // Handle Copy Button inside Share Modal
  const copyBtn = document.querySelector('[data-social="copy"]');
  if(copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span style="color:green;">✓ Скопировано!</span>';
        setTimeout(() => {
           copyBtn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        alert('Не удалось скопировать ссылку.');
      }
    });
  }

  // --- GLOBAL CLOSE LISTENERS ---
  // Click on backdrop or close buttons
  document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Check if clicked element asks to close a specific modal
    const closeId = target.dataset.closeModal || target.closest('[data-close-modal]')?.dataset.closeModal;
    if (closeId) {
      closeModal(closeId);
      return;
    }

    // Escape key listener
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.dock-modal-overlay.active');
      if(activeModal) closeModal(activeModal.id);
    }
  });
});
