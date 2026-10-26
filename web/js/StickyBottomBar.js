(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    var lastFocusedElement = null;
    var modals = document.querySelectorAll('.dock-modal-overlay');

    function getFocusables(container) {
      return Array.prototype.slice.call(container.querySelectorAll(focusableSelector))
        .filter(function (el) {
          return !el.hasAttribute('disabled') && el.offsetParent !== null;
        });
    }

    function handleModalKeydown(event) {
      var modal = event.currentTarget;
      if (!modal.classList.contains('active')) return;

      if (event.key === 'Tab') {
        var focusables = getFocusables(modal);
        if (!focusables.length) return;

        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    function openModal(modalId) {
      var modal = document.getElementById(modalId);
      if (!modal) return;

      document.querySelectorAll('.dock-modal-overlay.active').forEach(function (other) {
        if (other.id !== modalId) closeModal(other.id);
      });

      lastFocusedElement = document.activeElement;

      modal.removeAttribute('hidden');
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (modalId === 'modal-menu') {
        var menuBtn = document.getElementById('sticky-menu-btn');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      }

      if (modalId === 'modal-share') {
        var shareBtn = document.getElementById('sticky-share-btn');
        if (shareBtn) shareBtn.setAttribute('aria-expanded', 'true');
      }

      window.setTimeout(function () {
        var focusables = getFocusables(modal);
        if (focusables.length) focusables[0].focus();
      }, 50);
    }

    function closeModal(modalId) {
      var modal = document.getElementById(modalId);
      if (!modal) return;

      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('hidden', '');

      if (modalId === 'modal-menu') {
        var menuBtn = document.getElementById('sticky-menu-btn');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      }

      if (modalId === 'modal-share') {
        var shareBtn = document.getElementById('sticky-share-btn');
        if (shareBtn) shareBtn.setAttribute('aria-expanded', 'false');
      }

      if (!document.querySelector('.dock-modal-overlay.active')) {
        document.body.style.overflow = '';
      }

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }

      lastFocusedElement = null;
    }

    modals.forEach(function (modal) {
      modal.addEventListener('keydown', handleModalKeydown);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;

      var activeModal = document.querySelector('.dock-modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    });

    document.addEventListener('click', function (event) {
      if (!(event.target instanceof Element)) return;

      var closer = event.target.closest('[data-close-modal]');
      if (closer) {
        var id = closer.getAttribute('data-close-modal');
        if (id) closeModal(id);
      }
    });

    var themeBtn = document.getElementById('dock-theme-btn');
    if (themeBtn) {
      var syncThemeButton = function () {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.setAttribute('aria-pressed', String(isDark));
      };

      syncThemeButton();

      themeBtn.addEventListener('click', function () {
        var html = document.documentElement;
        var isDark = html.getAttribute('data-theme') === 'dark';

        if (isDark) {
          html.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
        } else {
          html.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        }

        syncThemeButton();
      });
    }

    var topBtn = document.getElementById('sticky-top-btn');
    if (topBtn) {
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    var menuTrigger = document.getElementById('sticky-menu-btn');
    if (menuTrigger) {
      menuTrigger.addEventListener('click', function () {
        openModal('modal-menu');
      });
    }

    var shareTrigger = document.getElementById('sticky-share-btn');
    if (shareTrigger) {
      shareTrigger.addEventListener('click', function () {
        var url = encodeURIComponent(window.location.href);
        var title = encodeURIComponent(document.title);

        var links = {
          telegram: 'https://t.me/share/url?url=' + url + '&text=' + title,
          vkontakte: 'https://vk.com/share.php?url=' + url + '&title=' + title,
          whatsapp: 'https://wa.me/?text=' + title + '%20' + url,
          email: 'mailto:?subject=' + title + '&body=' + url
        };

        Object.keys(links).forEach(function (key) {
          var btn = document.querySelector('[data-social="' + key + '"]');
          if (btn && btn.tagName === 'A') {
            btn.href = links[key];
          }
        });

        openModal('modal-share');
      });
    }

    var copyBtn = document.querySelector('[data-social="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var originalHTML = copyBtn.innerHTML;

        navigator.clipboard.writeText(window.location.href).then(function () {
          copyBtn.innerHTML = '<span style="color:#16a34a;">✓ Скопировано!</span>';
          window.setTimeout(function () {
            copyBtn.innerHTML = originalHTML;
          }, 2000);
        }).catch(function () {
          copyBtn.innerHTML = '<span style="color:#dc2626;">Не удалось скопировать</span>';
          window.setTimeout(function () {
            copyBtn.innerHTML = originalHTML;
          }, 2000);
        });
      });
    }
  });
})();
