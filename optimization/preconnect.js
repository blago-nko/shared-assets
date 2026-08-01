/**
 * Preconnect Configuration
 * Настройки предварительного подключения к внешним ресурсам
 * САМ v1.3 п. 1.6.1
 */

export const preconnectResources = [
  {
    href: 'https://mc.yandex.ru',
    rel: 'preconnect'
  },
  {
    href: 'https://www.googletagmanager.com',
    rel: 'preconnect'
  },
  {
    href: 'https://fonts.googleapis.com',
    rel: 'preconnect'
  },
  {
    href: 'https://fonts.gstatic.com',
    rel: 'preconnect',
    crossorigin: 'anonymous'
  }
];

export function injectPreconnect() {
  preconnectResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = resource.rel;
    link.href = resource.href;
    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin;
    }
    document.head.appendChild(link);
  });
}
