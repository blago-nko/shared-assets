// INFRA-082 HOTFIX v2: Adaptive sticky dock + Custom Desktop Share
(function () {
  // 1. Кнопка "Наверх"
  var topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Кнопка "Поделиться" (Web Share API + Desktop Fallback)
  var shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async function () {
      const url = window.location.href;
      const title = document.title;

      // Проверяем, мобильное ли это устройство
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                       (window.innerWidth < 768 && 'ontouchstart' in window);

      if (isMobile && navigator.share) {
        try {
          await navigator.share({ title: title, url: url });
        } catch (err) {
          console.log('Share canceled or failed', err);
        }
      } else {
        // Десктопный фоллбек: показываем кастомное меню соцсетей
        showCustomShareMenu(url, title);
      }
    });
  }

  // Функция рендера кастомного меню шаринга
  function showCustomShareMenu(url, title) {
    // Удаляем старое меню, если оно открыто
    const oldMenu = document.getElementById('custom-share-menu');
    if (oldMenu) oldMenu.remove();

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const networks = [
      { name: 'Telegram', icon: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
      { name: 'VK', icon: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M7 10h10v4H7z"/>', href: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}` },
      { name: 'WhatsApp', icon: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
      { name: 'X (Twitter)', icon: '<path d="M4 4l16 16M20 4L4 20"/>', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
      { name: 'Facebook', icon: '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` }
    ];

    // Используем те же токены для стиля меню, чтобы оно тоже менялось с темой
    let html = `<div id="custom-share-menu" style="position: fixed; bottom: calc(var(--space-4, 1.5rem) + 60px); right: var(--space-4, 1.5rem); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 8px; padding: 12px; z-index: 1001; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 8px;">`;
    
    networks.forEach(net => {
      html += `<a href="${net.href}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--color-text); font-size: 14px; padding: 6px; border-radius: 4px;" onmouseover="this.style.backgroundColor='var(--color-bg-secondary)'" onmouseout="this.style.backgroundColor='transparent'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${net.icon}</svg>
        ${net.name}
      </a>`;
    });

    html += `<button onclick="navigator.clipboard.writeText('${url}').then(()=>alert('Ссылка скопирована'));document.getElementById('custom-share-menu').remove();" style="margin-top: 4px; padding: 8px; border: 1px dashed var(--color-border); background: transparent; cursor: pointer; border-radius: 4px; font-size: 13px; color: var(--color-text);">📋 Скопировать ссылку</button>`;
    html += `</div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    // Закрываем меню при клике вне его
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        const menu = document.getElementById('custom-share-menu');
        if (menu && !menu.contains(e.target) && e.target !== shareBtn && !shareBtn.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 0);
  }

  // 3. Кнопка "Меню": открытие/закрытие drawer-панели
  var menu = document.getElementById('mobile-menu');
  var menuBtn = document.getElementById('sticky-menu-btn');

  if (menu && menuBtn) {
    var lastFocused = null;

    var open = function () {
      lastFocused = document.activeElement;
      menu.hidden = false;
      menu.setAttribute('aria-hidden', 'false');
      
      requestAnimationFrame(function () {
        menu.classList.add('mobile-menu--open');
      });
      
      document.body.classList.add('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'true');
      
      var focusable = menu.querySelector('button, a[href]');
      if (focusable) focusable.focus();
    };

    var close = function () {
      menu.classList.remove('mobile-menu--open');
      document.body.classList.remove('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      
      setTimeout(function () {
        menu.hidden = true;
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        else menuBtn.focus();
      }, 250);
    };

    menuBtn.addEventListener('click', function () {
      if (menu.hidden) open(); else close();
    });

    menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) close();
    });
  }
})();
