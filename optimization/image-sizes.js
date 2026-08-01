/**
 * Responsive Image Sizes Configuration
 * Настройки адаптивных изображений для разных брейкпоинтов
 * САМ v1.3 п. 1.6.1
 */

export const imageSizes = {
  breakpoints: {
    xs: 320,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1600
  },
  
  sizes: {
    thumbnail: {
      widths: [200, 400],
      quality: 75
    },
    card: {
      widths: [400, 800],
      quality: 80
    },
    article: {
      widths: [800, 1200, 1600],
      quality: 85
    },
    hero: {
      widths: [1200, 1600],
      quality: 90
    }
  },
  
  formats: {
    modern: ['avif', 'webp'],
    fallback: 'jpg'
  }
};

export function generateSrcSet(image, size) {
  const config = imageSizes.sizes[size];
  if (!config) return '';
  
  return config.widths
    .map(width => `${image.basePath}-${width}w.${image.format} ${width}w`)
    .join(', ');
}

export function generateSizesAttr(layout) {
  const layouts = {
    full: '(max-width: 1600px) 100vw, 1600px',
    article: '(max-width: 1200px) 100vw, 1200px',
    card: '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw',
    thumbnail: '200px'
  };
  return layouts[layout] || layouts.article;
}
