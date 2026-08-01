/**
 * ScrollToTop - Кнопка "Наверх" с плавной прокруткой
 * САМ v1.3 п. 1.6.1
 */

class ScrollToTop {
  constructor(options = {}) {
    this.options = {
      threshold: 300,
      smooth: true,
      ...options
    };
    this.button = null;
    this.init();
  }
  
  init() {
    this.createButton();
    this.attachEvents();
  }
  
  createButton() {
    this.button = document.createElement('button');
    this.button.className = 'scroll-to-top';
    this.button.setAttribute('aria-label', 'Наверх');
    this.button.setAttribute('title', 'Наверх');
    this.button.innerHTML = `
      <span class="scroll-to-top-icon">↑</span>
    `;
    this.button.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--primary-color, #0056b3);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
    `;
    document.body.appendChild(this.button);
  }
  
  attachEvents() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > this.options.threshold) {
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
      } else {
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
      }
    });
    
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: this.options.smooth ? 'smooth' : 'auto'
      });
    });
    
    this.button.addEventListener('mouseenter', () => {
      this.button.style.transform = 'scale(1.1)';
    });
    
    this.button.addEventListener('mouseleave', () => {
      this.button.style.transform = 'scale(1)';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ScrollToTop());
} else {
  new ScrollToTop();
}
