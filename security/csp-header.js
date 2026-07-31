/**
 * Content-Security-Policy для защиты от XSS и несанкционированных запросов
 * САМ v1.3, п. 1.6.1
 */
export const cspHeader = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' https://*.blogger.com https://*.googleusercontent.com data:; script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.can.blagorussia.ru;"
};
