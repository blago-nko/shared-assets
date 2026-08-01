/**
 * Content-Security-Policy Header Configuration
 * Защита от XSS и несанкционированных запросов
 * САМ v1.3 п. 1.6.1
 */

export const cspHeader = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "img-src 'self' https://*.blogger.com https://*.googleusercontent.com data: https:",
    "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https://api.can.blagorussia.ru https://mc.yandex.ru",
    "frame-src 'self' https://www.youtube.com https://rutube.ru https://vk.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

export function applyCSP(res) {
  res.setHeader('Content-Security-Policy', cspHeader['Content-Security-Policy']);
}
