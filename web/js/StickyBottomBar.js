document.addEventListener('DOMContentLoaded', () => {
  console.log('[DOCK] Initializing Custom Handlers...');

  const getElement = (id) => document.getElementById(id);

  // --- 1. THEME TOGGLE ---
  const themeBtn = getElement('dock-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeBtn.title = "Переключить на темную";
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeBtn.title = "Переключить на светлую";
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

  // --- 3. CUSTOM SHARE MODAL LOGIC ---
  const shareBtn = getElement('sticky-share-btn');
  let shareModal = null;

  function createShareModal() {
    if (shareModal) return shareModal;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    // Генерируем ссылки для популярных сетей
    const links = [
      { name: 'Telegram', url: `https://t.me/share/url?url=${url}&text=${title}`, icon: '✈️' },
      { name: 'VKontakte', url: `https://vk.com/share.php?url=${url}&title=${title}`, icon: '🔵' },
      { name: 'WhatsApp', url: `https://wa.me/?text=${title}%20${url}`, icon: '💬' },
      { name: 'Email', url: `mailto:?subject=${title}&body=${url}`, icon: '📧' },
      { name: 'Copy Link', action: 'copy', icon: '🔗' }
    ];

    const modalHtml = `
      <div id="custom-share-modal" class="search-overlay active" style="display:flex;">
        <div class="search-container" style="max-width: 350px; padding: 1.5rem;">
          <h3 style="margin-top:0; text-align:center;">Поделиться</h3>
          <button class="close-search-btn" onclick="this.closest('.search-overlay').remove()" aria-label="Закрыть">&times;</button>
          <ul style="list-style:none; padding:0; margin:1rem 0;">
            ${links.map(link => `
              <li style="margin-bottom: 0.75rem;">
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                   style="display:flex; align-items:center; gap:10px; padding:10px; background:#f1f5f9; border-radius:8px; text-decoration:none; color:#1e293b; font-weight:500;"
                   ${link.action === 'copy' ? `onclick="event.preventDefault(); navigator.clipboard.writeText('${decodeURIComponent(url)}'); alert('Ссылка скопирована!'); this.closest('.search-overlay').remove();"` : ''}>
                  <span>${link.icon}</span> ${link.name}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHtml;
    shareModal = tempDiv.firstElementChild;
    document.body.appendChild(shareModal);
    return shareModal;
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Закрываем существующее модалку поиска, если открыта
      const searchOverlay = getElement('search-overlay');
      if(searchOverlay && searchOverlay.classList.contains('active')) {
         searchOverlay.classList.remove('active');
         setTimeout(() => searchOverlay.style.display = 'none', 300);
      }
      
      createShareModal();
    });
  }

  // --- 4. MOBILE MENU TOGGLE (Robust Version) ---
  const menuBtn = getElement('sticky-menu-btn') || getElement('mobile-menu-btn');
  const mobileMenu = getElement('mobile-menu');

  if (menuBtn && mobileMenu) {
    const toggleMenu = () => {
      const isOpen = !mobileMenu.hasAttribute('hidden');
      
      if (isOpen) {
        mobileMenu.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Возвращаем скролл
      } else {
        mobileMenu.removeAttribute('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Блокируем скролл фона
        
        // Фокус на первой ссылке для доступности
        setTimeout(() => {
          const firstLink = mobileMenu.querySelector('a');
          if(firstLink) firstLink.focus();
        }, 100);
      }
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Закрытие по клику на бэкдроп или кнопку X
    const closeElements = mobileMenu.querySelectorAll('[data-menu-close], .mobile-menu__close, .mobile-menu__backdrop');
    closeElements.forEach(el => el.addEventListener('click', toggleMenu));
    
    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
        toggleMenu();
      }
    });
  }
});
