// INFRA-082: Sticky Bottom Bar с автоскрытием при скролле
(function() {
  const bar = document.querySelector('.sticky-bottom-bar');
  if (!bar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateBar() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    // Скрываем при скролле вниз (больше 50px), показываем при скролле вверх
    if (scrollDelta > 50 && currentScrollY > 200) {
      bar.classList.add('sticky-bottom-bar--hidden');
    } else if (scrollDelta < -50 || currentScrollY < 200) {
      bar.classList.remove('sticky-bottom-bar--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateBar);
      ticking = true;
    }
  });

  // Кнопка "Наверх"
  const topBtn = document.getElementById('sticky-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Кнопка "Меню" (пока просто скролл к шапке)
  const menuBtn = document.getElementById('sticky-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Кнопка "Поделиться" (Web Share API если доступен)
  const shareBtn = document.getElementById('sticky-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            url: window.location.href
          });
        } catch (err) {
          console.log('Share cancelled');
        }
      } else {
        // Fallback: копировать URL
        navigator.clipboard.writeText(window.location.href);
        alert('Ссылка скопирована в буфер обмена');
      }
    });
  }
})();
