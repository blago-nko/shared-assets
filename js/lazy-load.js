/**
 * Отложенная загрузка изображений через IntersectionObserver
 * САМ v1.3 п. 1.6.1
 */

(function() {
  'use strict';
  
  function initLazyLoad() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) img.src = img.dataset.src;
      });
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    document.querySelectorAll('img[loading="lazy"][data-src]').forEach(img => {
      observer.observe(img);
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoad);
  } else {
    initLazyLoad();
  }
})();
