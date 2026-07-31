/**
 * ============================================================================
 * main.js — Главный скрипт экосистемы (14 доменов)
 * ============================================================================
 * Назначение:
 *   1. Инициализация сквозных UI-компонентов экосистемы
 *   2. Обработка правил открытия ссылок (САМ v1.3, п. 1.6.2)
 *   3. Подключение модулей из shared-assets/components/
 *
 * Стандарты:
 *   - САМ v1.3, п. 1.6.2 — открытие ссылок
 *   - Mobile-First (xs:320px)
 *   - Единый стандарт фронтенда (shared-assets)
 *
 * Автор: НП «Общественное благополучие Воронежа»
 * Версия: 1.3.0
 * ============================================================================
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. КОНСТАНТЫ И РЕЕСТР ДОМЕНОВ
    // =========================================================================

    /**
     * Полный реестр внутренних доменов экосистемы (14 доменов)
     * Ссылки на эти домены открываются в том же окне (target="_self")
     * Все остальные ссылки — в новом окне (target="_blank" rel="noopener noreferrer")
     * Источник: САМ v1.3, п. 1.6.2; Приложение Б (реестр 14 доменов)
     */
    const INTERNAL_DOMAINS = Object.freeze([
        // Основные порталы
        'blagorussia.ru',
        'obrazslov.ru',

        // Поддомены основной сети (11 RSS-сайтов)
        'partnerstvo.blagorussia.ru',
        'obavlenia.blagorussia.ru',
        'interesnye-mesta.obrazslov.ru',
        'ot-gorozan.blagorussia.ru',
        'novosti.blagorussia.ru',
        'moisites.blagorussia.ru',
        'joga.blagorussia.ru',
        'ideologia.obrazslov.ru',
        'nasa-istoria.blagorussia.ru',

        // Специализированные проекты
        'grekpanteon.obrazslov.ru',
        'can.blagorussia.ru',
        'gallery.obrazslov.ru',

        // Локальная разработка (для тестирования)
        'localhost',
        '127.0.0.1',
        '0.0.0.0'
    ]);

    /**
     * Протоколы, которые не должны обрабатываться как обычные ссылки
     */
    const IGNORED_PROTOCOLS = Object.freeze([
        'javascript:',
        'mailto:',
        'tel:',
        'sms:',
        'data:',
        'blob:'
    ]);

    // =========================================================================
    // 2. УТИЛИТЫ
    // =========================================================================

    /**
     * Проверка: является ли домен внутренним для экосистемы
     * @param {string} hostname — хост из URL (без протокола и пути)
     * @returns {boolean}
     */
    function isInternalDomain(hostname) {
        if (!hostname) return false;

        // Нормализация: убираем 'www.' и приводим к нижнему регистру
        const normalizedHost = hostname.replace(/^www\./i, '').toLowerCase();

        return INTERNAL_DOMAINS.some(domain => {
            // Точное совпадение (например, blagorussia.ru)
            if (normalizedHost === domain) return true;
            // Поддомен (например, sub.blagorussia.ru)
            if (normalizedHost.endsWith('.' + domain)) return true;
            return false;
        });
    }

    /**
     * Проверка: является ли ссылка служебной (якорь, mailto, tel и т.д.)
     * @param {string} href — значение атрибута href
     * @returns {boolean}
     */
    function isSpecialLink(href) {
        if (!href) return true;
        if (href.startsWith('#')) return true;
        if (href.startsWith('/') && !href.startsWith('//')) return true; // относительный путь
        return IGNORED_PROTOCOLS.some(protocol =>
            href.toLowerCase().startsWith(protocol)
        );
    }

    /**
     * Безопасное логирование (не ломает работу в production)
     * @param {string} message
     * @param {*} [data]
     */
    function safeLog(message, data) {
        if (typeof console !== 'undefined' && console.warn) {
            if (data !== undefined) {
                console.warn('[main.js]', message, data);
            } else {
                console.warn('[main.js]', message);
            }
        }
    }

    // =========================================================================
    // 3. ОБРАБОТКА ССЫЛОК (САМ v1.3, п. 1.6.2)
    // =========================================================================

    /**
     * Обработчик правил открытия ссылок
     * - Внутренние домены экосистемы → target="_self"
     * - Внешние ссылки → target="_blank" rel="noopener noreferrer"
     *
     * Запускается один раз при загрузке DOM и повторно после динамического
     * обновления контента (через событие 'content:updated').
     */
    function processLinks() {
        const links = document.querySelectorAll('a[href]');
        let processed = 0;
        let external = 0;

        links.forEach(link => {
            const href = link.getAttribute('href');

            // Пропускаем служебные ссылки (якоря, mailto, tel, относительные пути)
            if (isSpecialLink(href)) return;

            try {
                // Парсим URL относительно текущего origin (для относительных путей)
                const url = new URL(href, window.location.origin);
                const hostname = url.hostname;

                if (isInternalDomain(hostname)) {
                    // === ВНУТРЕННЯЯ ССЫЛКА ===
                    link.setAttribute('target', '_self');
                    // Очищаем rel, чтобы избежать конфликтов с предыдущими значениями
                    link.removeAttribute('rel');
                    processed++;
                } else {
                    // === ВНЕШНЯЯ ССЫЛКА ===
                    link.setAttribute('target', '_blank');
                    // noopener + noreferrer — защита от reverse tabnabbing и утечки referer
                    link.setAttribute('rel', 'noopener noreferrer');
                    external++;
                }
            } catch (error) {
                // Невалидный URL — оставляем поведение по умолчанию, логируем
                safeLog('Невалидный URL в ссылке:', { href: href, error: error.message });
            }
        });

        // Отладочная информация (только в режиме разработки)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.info(
                `[main.js] Обработано ссылок: ${links.length} (внутренних: ${processed}, внешних: ${external})`
            );
        }
    }

    // =========================================================================
    // 4. ИНИЦИАЛИЗАЦИЯ СКВОЗНЫХ КОМПОНЕНТОВ
    // =========================================================================

    /**
     * Инициализация компонентов из shared-assets/components/
     * Каждый компонент проверяется на наличие соответствующего DOM-элемента
     */
    function initComponents() {
        // 4.1. Sticky Bottom Bar (Mobile-First навигация)
        if (typeof window.initStickyBottomBar === 'function') {
            window.initStickyBottomBar();
        }

        // 4.2. Социальные ссылки (динамические кнопки из social_links.json)
        if (typeof window.initSocialLinks === 'function') {
            window.initSocialLinks();
        }

        // 4.3. Навигация по многостраничным материалам (Book/Chapter Pattern)
        if (typeof window.initMultiVolumeNavigation === 'function') {
            window.initMultiVolumeNavigation();
        }

        // 4.4. Виджет обратной связи (feedback-simple.js)
        if (typeof window.initFeedbackSimple === 'function') {
            window.initFeedbackSimple();
        }

        // 4.5. Переключатель тем (светлая/тёмная)
        if (typeof window.initThemeSwitcher === 'function') {
            window.initThemeSwitcher();
        }

        // 4.6. Cookie-согласие
        if (typeof window.initCookieConsent === 'function') {
            window.initCookieConsent();
        }

        // 4.7. Кнопка «Наверх»
        if (typeof window.initScrollToTop === 'function') {
            window.initScrollToTop();
        }

        // 4.8. Кнопки «Поделиться»
        if (typeof window.initShareButtons === 'function') {
            window.initShareButtons();
        }
    }

    /**
     * Инициализация аналитики (отложенная загрузка после первого скролла)
     * Обоснование: сохранение 100/100 PageSpeed Insights
     */
    function initAnalyticsLazy() {
        let analyticsLoaded = false;

        function loadAnalytics() {
            if (analyticsLoaded) return;
            analyticsLoaded = true;

            if (typeof window.initAnalytics === 'function') {
                window.initAnalytics();
            }
        }

        // Загрузка после первого скролла или через 3 секунды
        window.addEventListener('scroll', loadAnalytics, { once: true, passive: true });
        window.addEventListener('mousemove', loadAnalytics, { once: true, passive: true });
        window.addEventListener('touchstart', loadAnalytics, { once: true, passive: true });
        setTimeout(loadAnalytics, 3000);
    }

    // =========================================================================
    // 5. ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
    // =========================================================================

    function onDOMContentLoaded() {
        // 5.1. Обработка всех ссылок на странице
        processLinks();

        // 5.2. Инициализация UI-компонентов
        initComponents();

        // 5.3. Отложенная загрузка аналитики
        initAnalyticsLazy();
    }

    // =========================================================================
    // 6. СОБЫТИЯ ЗАПУСКА
    // =========================================================================

    // Основной запуск при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
    } else {
        // DOM уже загружен (скрипт подключён в конце <body> или defer)
        onDOMContentLoaded();
    }

    // =========================================================================
    // 7. ПУБЛИЧНЫЙ API (для динамического контента)
    // =========================================================================

    /**
     * Глобальный API для повторной обработки ссылок после динамического
     * обновления контента (например, после загрузки новых статей через AJAX,
     * после смены страницы в SPA-подобных сценариях Blogger/Hugo).
     *
     * Использование:
     *   window.Ecosystem.refreshLinks();
     *   window.Ecosystem.refreshAll();
     */
    window.Ecosystem = window.Ecosystem || {};
    window.Ecosystem.refreshLinks = processLinks;
    window.Ecosystem.refreshAll = function () {
        processLinks();
        initComponents();
    };

    // Слушатель кастомного события для динамического обновления контента
    document.addEventListener('content:updated', function () {
        processLinks();
    });

    // Слушатель события от Hugo/Blogger (если используется их система навигации)
    document.addEventListener('pageshow', function (event) {
        // При возврате на страницу через кэш браузера (bfcache)
        if (event.persisted) {
            processLinks();
        }
    });

})();
