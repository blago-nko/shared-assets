/**
 * Lazy Loading Configuration
 * Настройки отложенной загрузки изображений
 * САМ v1.3 п. 1.6.1
 */

export const lazyLoadConfig = {
  rootMargin: '50px 0px',
  threshold: 0.01,
  
  placeholder: {
    type: 'blur',
    quality: 20,
    width: 20
  },
  
  observer: {
    enabled: true,
    fallback: 'scroll'
  }
};

export function shouldLazyLoad(element) {
  // Hero-изображения загружаются сразу
  if (element.classList.contains('hero-image')) return false;
  
  // Изображения выше fold загружаются сразу
  const rect = element.getBoundingClientRect();
  if (rect.top < window.innerHeight) return false;
  
  return true;
}
