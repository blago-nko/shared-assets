/**
 * ThemeSwitcher - Переключение светлой/тёмной темы
 * Сохраняет выбор в localStorage
 * САМ v1.3 п. 1.6.5
 */

class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.attachEvents();
  }
  
  getStoredTheme() {
    return localStorage.getItem('theme');
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.updateToggleIcons();
  }
  
  updateToggleIcons() {
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');
    
    if (lightIcon && darkIcon) {
      lightIcon.style.display = this.currentTheme === 'dark' ? 'inline' : 'none';
      darkIcon.style.display = this.currentTheme === 'light' ? 'inline' : 'none';
    }
  }
  
  attachEvents() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Слушаем изменение системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
}

// Инициализация
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ThemeSwitcher());
} else {
  new ThemeSwitcher();
}
