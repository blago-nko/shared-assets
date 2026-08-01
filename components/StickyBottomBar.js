/**
 * StickyBottomBar - Фиксированная нижняя панель с кнопками действий
 * Mobile-First компонент для xs:320px
 * САМ v1.3 п. 1.6.1
 */

class StickyBottomBar {
  constructor() {
    this.bar = null;
    this.buttons = {
      write: { icon: '✉️', label: 'Написать', action: 'contact' },
      share: { icon: '📤', label: 'Поделиться', action: 'share' },
      menu: { icon: '☰', label: 'Меню', action: 'menu' }
    };
    this.init();
  }
  
  init() {
    if (window.innerWidth > 768) return; // Только для мобильных
    
    this.createBar();
    this.attachEvents();
  }
  
  createBar() {
    this.bar = document.createElement('div');
    this.bar.className = 'sticky-bottom-bar';
    this.bar.setAttribute('role', 'navigation');
    this.bar.setAttribute('aria-label', 'Быстрые действия');
    
    Object.entries(this.buttons).forEach(([key, btn]) => {
      const button = document.createElement('button');
      button.className = `sticky-btn sticky-btn-${key}`;
      button.innerHTML = `
        <span class="sticky-btn-icon">${btn.icon}</span>
        <span class="sticky-btn-label">${btn.label}</span>
      `;
      button.setAttribute('aria-label', btn.label);
      button.dataset.action = btn.action;
      this.bar.appendChild(button);
    });
    
    document.body.appendChild(this.bar);
  }
  
  attachEvents() {
    this.bar.addEventListener('click', (e) => {
      const button = e.target.closest('.sticky-btn');
      if (!button) return;
      
      const action = button.dataset.action;
      this.handleAction(action);
    });
  }
  
  handleAction(action) {
    switch (action) {
      case 'contact':
        this.openContactForm();
        break;
      case 'share':
        this.openShareModal();
        break;
      case 'menu':
        this.toggleMenu();
        break;
    }
  }
  
  openContactForm() {
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
      contactModal.hidden = false;
    } else {
      window.location.href = '/contacts';
    }
  }
  
  openShareModal() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      }).catch(console.error);
    } else {
      const shareModal = document.getElementById('share-modal');
      if (shareModal) shareModal.hidden = false;
    }
  }
  
  toggleMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) navToggle.click();
  }
}

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StickyBottomBar());
} else {
  new StickyBottomBar();
}
