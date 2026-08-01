/**
 * Critical CSS Extraction
 * Критический CSS для ускорения LCP (Largest Contentful Paint)
 * САМ v1.3 п. 1.6.1
 */

export const criticalCSS = `
  /* Базовые стили для Hero-секции */
  .hero-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    object-fit: cover;
  }
  
  /* Sticky Bottom Bar */
  .sticky-bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--bg-color);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
  }
  
  .sticky-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  /* Header */
  .site-header {
    background: var(--primary-color);
    color: var(--text-light);
    padding: 1rem;
  }
  
  /* Skip link для доступности */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var
