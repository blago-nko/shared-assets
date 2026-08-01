/**
 * MultiVolumeNavigation - Навигация Book/Chapter для многостраничных материалов
 * САМ v1.3 п. 1.6.1, Манифест Миграции v5.4 п. 2
 */

class MultiVolumeNavigation {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.options = {
      showProgress: true,
      sticky: true,
      ...options
    };
    this.init();
  }
  
  init() {
    if (!this.container) return;
    this.render();
    if (this.options.sticky) this.makeSticky();
  }
  
  render() {
    const currentChapter = parseInt(this.container.dataset.currentChapter || '1');
    const totalChapters = parseInt(this.container.dataset.totalChapters || '1');
    const prevUrl = this.container.dataset.prevUrl || '#';
    const nextUrl = this.container.dataset.nextUrl || '#';
    const tocUrl = this.container.dataset.tocUrl || '#';
    
    const progress = (currentChapter / totalChapters) * 100;
    
    this.container.innerHTML = `
      <nav class="multi-volume-nav" aria-label="Навигация по частям">
        ${this.options.showProgress ? `
          <div class="mv-progress">
            <div class="mv-progress-bar" style="width: ${progress}%"></div>
            <span class="mv-progress-text">Часть ${currentChapter} из ${totalChapters}</span>
          </div>
        ` : ''}
        <div class="mv-controls">
          <a href="${prevUrl}" class="mv-btn mv-prev" 
             ${currentChapter === 1 ? 'aria-disabled="true"' : ''}
             aria-label="Предыдущая часть">
            ← Назад
          </a>
          <a href="${tocUrl}" class="mv-btn mv-toc" aria-label="Содержание">
            📖 Содержание
          </a>
          <a href="${nextUrl}" class="mv-btn mv-next"
             ${currentChapter === totalChapters ? 'aria-disabled="true"' : ''}
             aria-label="Следующая часть">
            Далее →
          </a>
        </div>
      </nav>
    `;
  }
  
  makeSticky() {
    this.container.style.position = 'sticky';
    this.container.style.bottom = '60px'; // Выше StickyBottomBar
    this.container.style.zIndex = '999';
  }
}

window.MultiVolumeNavigation = MultiVolumeNavigation;
