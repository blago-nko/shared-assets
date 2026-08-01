/**
 * Главный скрипт экосистемы
 * САМ v1.3 п. 1.6.2 (Стандарты работы со ссылками)
 */

(function() {
  'use strict';
  
  // Экосистемные домены (открываются в том же окне)
  const ECOSYSTEM_DOMAINS = [
    'blagorussia.ru', 'obrazslov.ru', 'partnerstvo.blagorussia.ru',
    'grekpanteon.obrazslov.ru', 'can.blagorussia.ru', 'gallery.obrazslov.ru',
    'obavlenia.blagorussia.ru', 'interesnye-mesta.obrazslov.ru',
    'ot-gorozan.blagorussia.ru', 'novosti.blagorussia.ru',
    'moisites.blagorussia.ru', 'joga.blagorussia.ru',
    'ideologia.obrazslov.ru', 'nasa-istoria.blagorussia.ru'
  ];
  
  function isEcosystemLink(url) {
    try {
      const hostname = new URL(url, window.location.origin).hostname;
      return ECOSYSTEM_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    } catch (e) {
      return false;
    }
  }
  
  function initLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      
      if (isEcosystemLink(href)) {
        link.setAttribute('target', '_self');
      } else if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLinks);
  } else {
    initLinks();
  }
  
  window.EcosystemLinks = { isEcosystemLink, initLinks };
})();
