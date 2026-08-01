/**
 * Управление cookie-согласием (152-ФЗ, GDPR-совместимость)
 * Источник: САМ v1.3 п. 1.6.1, Приложение Г п. Г6
 * Интеграция: CookieConsent.js (UI) + аналитика (analytics.js)
 */

(function() {
  'use strict';
  
  const CONSENT_KEY = 'cookie_consent_v1';
  const CONSENT_VERSION = '1.0';
  
  const CookieManager = {
    categories: {
      necessary: { required: true, label: 'Обязательные' },
      analytics: { required: false, label: 'Аналитика (Яндекс.Метрика, GA4)' },
      marketing: { required: false, label: 'Маркетинг' },
      preferences: { required: false, label: 'Настройки (тема, фильтры)' }
    },
    
    getConsent() {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) return null;
        const consent = JSON.parse(stored);
        if (consent.version !== CONSENT_VERSION) return null;
        return consent;
      } catch (e) {
        return null;
      }
    },
    
    saveConsent(consent) {
      const data = {
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        categories: {
          necessary: true,
          analytics: !!consent.analytics,
          marketing: !!consent.marketing,
          preferences: !!consent.preferences
        }
      };
      localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
      return data;
    },
    
    hasConsent(category) {
      const consent = this.getConsent();
      if (!consent) return false;
      if (category === 'necessary') return true;
      return !!consent.categories[category];
    },
    
    revokeConsent() {
      localStorage.removeItem(CONSENT_KEY);
      // Удаляем cookie аналитики
      this.deleteAnalyticsCookies();
      window.location.reload();
    },
    
    deleteAnalyticsCookies() {
      const analyticsPatterns = ['_ym_', '_ga', '_gid', '_gat'];
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (analyticsPatterns.some(p => name.startsWith(p))) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
    },
    
    setCookie(name, value, days = 365, category = 'necessary') {
      if (!this.hasConsent(category) && category !== 'necessary') return false;
      
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
      return true;
    },
    
    getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    }
  };
  
  // Экспорт в глобальную область
  window.CookieManager = CookieManager;
  
  // Событие для других модулей
  window.dispatchEvent(new CustomEvent('cookie-manager-ready'));
})();
