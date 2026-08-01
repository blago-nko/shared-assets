/**
 * Поиск по сайту (базовая реализация)
 * САМ v1.3 п. 1.6.1
 */

(function() {
  'use strict';
  
  function initSearch() {
    const toggle = document.querySelector('.search-toggle');
    const panel = document.querySelector('.search-panel');
    
    if (!toggle || !panel) return;
    
    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        panel.querySelector('input[type="search"]')?.focus();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        toggle.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        panel.hidden = false;
        panel.querySelector('input[type="search"]')?.focus();
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
