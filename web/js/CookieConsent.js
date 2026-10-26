(function () {
  'use strict';

  var STORAGE_KEY = 'blago_cookie_consent';

  function getState() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setState(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // localStorage может быть недоступен в приватном режиме.
    }
  }

  function init() {
    if (getState()) return;
    if (document.getElementById('cookie-consent-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Уведомление об использовании cookies');
    banner.setAttribute('aria-live', 'polite');

    banner.innerHTML =
      '<div class="cookie-consent-inner">' +
        '<p>Мы используем cookies для работы сайта и базовой аналитики. Вы можете принять или отклонить необязательные cookies.</p>' +
        '<div class="cookie-consent-actions">' +
          '<button type="button" id="cookie-reject">Отклонить</button>' +
          '<button type="button" id="cookie-accept">Принять</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    var accept = document.getElementById('cookie-accept');
    var reject = document.getElementById('cookie-reject');

    function close(value) {
      setState(value);
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }

    if (accept) accept.addEventListener('click', function () { close('accepted'); });
    if (reject) reject.addEventListener('click', function () { close('rejected'); });

    if (accept) accept.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
