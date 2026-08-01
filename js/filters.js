/**
 * Фильтры для каталогов
 * САМ v1.3 п. 1.6.1
 */

(function() {
  'use strict';
  
  class CatalogFilters {
    constructor(container) {
      this.container = typeof container === 'string'
        ? document.querySelector(container)
        : container;
      this.filters = new Map();
      this.init();
    }
    
    init() {
      if (!this.container) return;
      
      this.container.querySelectorAll('[data-filter]').forEach(el => {
        const key = el.dataset.filter;
        const value = el.dataset.value;
        
        if (!this.filters.has(key)) {
          this.filters.set(key, new Set());
        }
        
        el.addEventListener('click', () => {
          const set = this.filters.get(key);
          if (set.has(value)) {
            set.delete(value);
            el.classList.remove('active');
          } else {
            set.add(value);
            el.classList.add('active');
          }
          this.applyFilters();
        });
      });
    }
    
    applyFilters() {
      const items = document.querySelectorAll('[data-item]');
      
      items.forEach(item => {
        let visible = true;
        
        this.filters.forEach((values, key) => {
          if (values.size === 0) return;
          const itemValue = item.dataset[key];
          if (!values.has(itemValue)) visible = false;
        });
        
        item.style.display = visible ? '' : 'none';
      });
      
      this.updateCounter();
    }
    
    updateCounter() {
      const counter = document.querySelector('.filter-counter');
      if (!counter) return;
      
      const visibleCount = document.querySelectorAll('[data-item]:not([style*="display: none"])').length;
      counter.textContent = `Показано: ${visibleCount}`;
    }
  }
  
  window.CatalogFilters = CatalogFilters;
})();
