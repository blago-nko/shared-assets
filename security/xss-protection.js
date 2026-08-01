/**
 * XSS Protection Utilities
 * Утилиты для защиты от XSS-атак
 * САМ v1.3 п. 1.6.1
 */

export function sanitizeHTML(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

export function sanitizeURL(url) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return '#';
    }
    return url;
  } catch {
    return '#';
  }
}

export function escapeAttribute(str) {
  return sanitizeHTML(str).replace(/[\n\r]/g, ' ');
}
