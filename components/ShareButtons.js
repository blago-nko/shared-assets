/**
 * ShareButtons - Кнопки "Поделиться" для социальных сетей
 * САМ v1.3 п. 1.6.1
 */

class ShareButtons {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      platforms: ['vk', 'telegram', 'ok', 'whatsapp', 'copy'],
      url: window.location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      ...options
    };
    this.init();
  }
  
  init() {
    if (!this.container) return;
    this.render();
    this.attachEvents();
  }
  
  render() {
    const buttons = this.options.platforms.map(platform => {
      const config = this.getPlatformConfig(platform);
      return `
        <button class="share-btn share-btn-${platform}" 
                data-platform="${platform}"
                aria-label="Поделиться в ${config.label}"
                title="${config.label}">
          <span class="share-icon">${config.icon}</span>
          <span class="share-label">${config.label}</span>
        </button>
      `;
    }).join('');
    
    this.container.innerHTML = `
      <div class="share-buttons" role="group" aria-label="Поделиться">
        ${buttons}
      </div>
    `;
  }
  
  getPlatformConfig(platform) {
    const configs = {
      vk: { icon: '🔵', label: 'ВКонтакте', url: (u, t) => `https://vk.com/share.php?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}` },
      telegram: { icon: '✈️', label: 'Telegram', url: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
      ok: { icon: '🟠', label: 'Одноклассники', url: (u, t) => `https://connect.ok.ru/offer?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}` },
      whatsapp: { icon: '💬', label: 'WhatsApp', url: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}` },
      copy: { icon: '📋', label: 'Копировать ссылку', url: () => null }
    };
    return configs[platform] || configs.copy;
  }
  
  attachEvents() {
    this.container.addEventListener('click', (e) => {
      const button = e.target.closest('.share-btn');
      if (!button) return;
      
      const platform = button.dataset.platform;
      const config = this.getPlatformConfig(platform);
      
      if (platform === 'copy') {
        this.copyToClipboard(this.options.url);
      } else if (navigator.share && ['telegram', 'whatsapp'].includes(platform)) {
        navigator.share({
          title: this.options.title,
          url: this.options.url
        }).catch(console.error);
      } else {
        const shareUrl = config.url(this.options.url, this.options.title);
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  }
  
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification('Ссылка скопирована');
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  }
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      z-index: 10000;
      animation: fadeIn 0.3s;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }
}

window.ShareButtons = ShareButtons;
