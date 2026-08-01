/**
 * CookieConsent - Баннер согласия на использование cookie
 * Соответствие 152-ФЗ и GDPR
 * САМ v1.3 п. 1.6.1
 */

class CookieConsent {
  constructor() {
    this.consentKey = 'cookie_consent';
    this.consent = this.getConsent();
    this.init();
  }
  
  init() {
    if (!this.consent) {
      this.showBanner();
    } else {
      this.loadAnalytics();
    }
  }
  
  getConsent() {
    const stored = localStorage.getItem(this.consentKey);
    return stored ? JSON.parse(stored) : null;
  }
  
  showBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Согласие на использование cookie');
    
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <p class="cookie-consent-text">
          Мы используем cookie для улучшения работы сайта и аналитики. 
          <a href="/p/privacy-policy.html" target="_blank">Подробнее</a>
        </p>
        <div class="cookie-consent-actions">
          <button class="cookie-btn cookie-btn-accept">Принять все</button>
          <button class="cookie-btn cookie-btn-settings">Настроить</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    this.attachEvents(banner);
  }
  
  attachEvents(banner) {
    const acceptBtn = banner.querySelector('.cookie-btn-accept');
    const settingsBtn = banner.querySelector('.cookie-btn-settings');
    
    acceptBtn.addEventListener('click', () => {
      this.saveConsent({ analytics: true, marketing: true });
      this.hideBanner(banner);
      this.loadAnalytics();
    });
    
    settingsBtn.addEventListener('click', () => {
      this.showSettings(banner);
    });
  }
  
  showSettings(banner) {
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <h3>Настройки cookie</h3>
        <div class="cookie-settings">
          <label class="cookie-setting">
            <input type="checkbox" checked disabled>
            <span>Обязательные (всегда включены)</span>
          </label>
          <label class="cookie-setting">
            <input type="checkbox" id="cookie-analytics">
            <span>Аналитика (Яндекс.Метрика, GA4)</span>
          </label>
          <label class="cookie-setting">
            <input type="checkbox" id="cookie-marketing">
            <span>Маркетинг (рекламные cookie)</span>
          </label>
        </div>
        <div class="cookie-consent-actions">
          <button class="cookie-btn cookie-btn-save">Сохранить</button>
        </div>
      </div>
    `;
    
    const saveBtn = banner.querySelector('.cookie-btn-save');
    saveBtn.addEventListener('click', () => {
      const analytics = banner.querySelector('#cookie-analytics').checked;
      const marketing = banner.querySelector('#cookie-marketing').checked;
      this.saveConsent({ analytics, marketing });
      this.hideBanner(banner);
      if (analytics) this.loadAnalytics();
    });
  }
  
  saveConsent(consent) {
    localStorage.setItem(this.consentKey, JSON.stringify(consent));
    this.consent = consent;
  }
  
  hideBanner(banner) {
    banner.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => banner.remove(), 300);
  }
  
  loadAnalytics() {
    if (this.consent?.analytics) {
      // Загрузка Яндекс.Метрики
      this.loadYandexMetrika();
      // Загрузка Google Analytics
      this.loadGoogleAnalytics();
    }
  }
  
  loadYandexMetrika() {
    // Код Яндекс.Метрики
    console.log('Загрузка Яндекс.Метрики...');
  }
  
  loadGoogleAnalytics() {
    // Код Google Analytics
    console.log('Загрузка Google Analytics...');
  }
}

// Инициализация
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CookieConsent());
} else {
  new CookieConsent();
}
