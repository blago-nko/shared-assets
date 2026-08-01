/**
 * SocialLinks - Динамические кнопки социальных сетей
 * Загружает конфигурацию из shared-assets/config/social_links.json
 * САМ v1.3 п. 1.6.1
 */

class SocialLinks {
  constructor(container, brand = 'npo') {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.brand = brand;
    this.config = null;
    this.init();
  }
  
  async init() {
    try {
      await this.loadConfig();
      this.render();
    } catch (error) {
      console.error('Ошибка загрузки социальных ссылок:', error);
    }
  }
  
  async loadConfig() {
    const response = await fetch('/shared-assets/config/social_links.json');
    const data = await response.json();
    this.config = data.brands[this.brand];
  }
  
  render() {
    if (!this.config || !this.container) return;
    
    const links = this.config.links;
    const html = Object.entries(links).map(([platform, url]) => {
      const icon = this.getIcon(platform);
      const label = this.getLabel(platform);
      return `
        <a href="${url}" 
           class="social-link social-link-${platform}"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="${label}">
          <span class="social-icon">${icon}</span>
          <span class="social-label">${label}</span>
        </a>
      `;
    }).join('');
    
    this.container.innerHTML = html;
  }
  
  getIcon(platform) {
    const icons = {
      vk: '🔵',
      telegram: '✈️',
      ok: '🟠',
      dzen: '📰',
      youtube: '▶️'
    };
    return icons[platform] || '🔗';
  }
  
  getLabel(platform) {
    const labels = {
      vk: 'ВКонтакте',
      telegram: 'Telegram',
      ok: 'Одноклассники',
      dzen: 'Дзен',
      youtube: 'YouTube'
    };
    return labels[platform] || platform;
  }
}

// Экспорт для использования в других модулях
window.SocialLinks = SocialLinks;
