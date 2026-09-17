// CookieConsent.js — минимальный менеджер согласий
(function () {
  const STORAGE_KEY = 'blago_cookie_consent';
  const state = localStorage.getItem(STORAGE_KEY);
  if (!state) {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML =
      'Мы используем cookies. <button id="cookie-accept">Принять</button>';
    document.body.appendChild(banner);
    document.getElementById('cookie-accept').addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      banner.remove();
    });
  }
})();
