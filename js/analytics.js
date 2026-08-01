/**
 * Яндекс.Метрика + GA4 (асинхронная загрузка после первого скролла)
 * САМ v1.3 п. 1.6.1, СУМКа v1.5 п. 6.3
 */

(function() {
  'use strict';
  
  let analyticsLoaded = false;
  
  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    
    // Яндекс.Метрика (замените XXXXXXXX на ваш счётчик)
    (function(m,e,t,r,i,k,a){m[e]=m[e]||function(){(m[e].a=m[e].a||[]).push(arguments)};
    m[e].l=1*new Date();
    })(window, document, "ym", "https://mc.yandex.ru/metrika/tag.js", "ym");
    
    // GA4 (замените G-XXXXXXXXXX на ваш ID)
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(gaScript);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  }
  
  function initAnalytics() {
    // Загружаем аналитику только после первого скролла (для PageSpeed 100/100)
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadAnalytics();
        observer.disconnect();
      }
    });
    
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.position = 'absolute';
    sentinel.style.top = '500px';
    document.body.appendChild(sentinel);
    observer.observe(sentinel);
    
    // Fallback: загрузка через 5 секунд
    setTimeout(loadAnalytics, 5000);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
})();
