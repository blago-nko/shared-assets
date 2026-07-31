/**
 * Критический CSS для ускорения LCP (Largest Contentful Paint)
 * САМ v1.3, п. 1.6.1
 */
export const criticalCSS = `
  /* Базовые стили для Hero-секции и Sticky Bottom Bar */
  :root { --primary-color: #0056b3; --bg-color: #ffffff; }
  .hero-image { width: 100%; height: auto; aspect-ratio: 16/9; object-fit: cover; }
  .sticky-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: var(--bg-color); box-shadow: 0 -2px 10px rgba(0,0,0,0.1); }
`;
