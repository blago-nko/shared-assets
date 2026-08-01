/**
 * Service Worker регистрация (Progressive Web App)
 * Источник: САМ v1.3 п. 1.6.1, п. 1.6.4
 * Назначение: Офлайн-кэш, push-уведомления, установка на устройство
 */

(function() {
  'use strict';
  
  const PWAConfig = {
    enabled: true,
    swPath: '/shared-assets/sw.js',
    scope: '/',
    cacheVersion: 'v1.0.0',
    
    // Стратегия кэширования
    strategies: {
      // Статические ассеты — Cache First
      staticAssets: {
        match: /\.(css|js|svg|png|jpg|webp|woff2)$/,
        strategy: 'cache-first',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
      },
      // HTML — Network First (всегда свежий контент)
      html: {
        match: /\.html$|^\/$/,
        strategy: 'network-first',
        maxAge: 24 * 60 * 60 * 1000 // 1 день
      },
      // API — Network Only
      api: {
        match: /^\/api\//,
        strategy: 'network-only'
      }
    }
  };
  
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker не поддерживается');
      return;
    }
    
    // Регистрируем только если пользователь дал согласие на preferences
    if (window.CookieManager && !window.CookieManager.hasConsent('preferences')) {
      console.log('[PWA] Service Worker отложен до согласия на cookie');
      window.addEventListener('cookie-consent-given', registerServiceWorker, { once: true });
      return;
    }
    
    navigator.serviceWorker.register(PWAConfig.swPath, { scope: PWAConfig.scope })
      .then(registration => {
        console.log('[PWA] Service Worker зарегистрирован:', registration.scope);
        
        // Проверка обновлений раз в час
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
        
        // Обработка обновления
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.error('[PWA] Ошибка регистрации:', error);
      });
  }
  
  function showUpdateNotification() {
    // Создаём ненавязчивое уведомление об обновлении
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <div class="pwa-update-content">
        <span>Доступна новая версия сайта</span>
        <button class="pwa-update-btn" onclick="window.location.reload()">Обновить</button>
      </div>
    `;
    document.body.appendChild(notification);
  }
  
  // Push-уведомления (только для САН с согласия пользователя)
  window.PWAPush = {
    async requestPermission() {
      if (!('Notification' in window)) return false;
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    },
    
    async subscribe(pushEndpoint) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pushEndpoint.vapidPublicKey)
      });
      return subscription.toJSON();
    }
  };
  
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }
  
  // Установка на устройство (beforeinstallprompt)
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Показываем кнопку "Установить приложение"
    const installBtn = document.querySelector('.pwa-install-btn');
    if (installBtn) {
      installBtn.hidden = false;
      installBtn.addEventListener('click', async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Установка: ${outcome}`);
        deferredPrompt = null;
      });
    }
  });
  
  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
  } else {
    registerServiceWorker();
  }
  
  window.PWAConfig = PWAConfig;
})();
