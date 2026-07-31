# 📋 Оперативный план задач (TASKS.md)

> **Единый реестр задач** экосистемы 14 доменов
> Обновление: еженедельно, все изменения фиксируются в Git
> Статусы: ⬜ Не начата | 🔄 В работе | ✅ Завершена | ⛔ Заблокирована

**Последнее обновление**: 01.08.2026
**Ответственный за ведение**: А.В. Бобров (Администратор экосистемы)

---

## 🔥 Приоритет 1: Критические несоответствия манифестам

| ID | Задача | Подзадачи | Этап | Ответственный | Статус | План. дата | Факт. дата | Комментарий |
|----|--------|-----------|------|---------------|--------|------------|------------|-------------|
| T-001 | Создание STATUS.md | 1. Шаблон реестра<br>2. Workflow авто-обновления | 0 | А.В. Бобров | ✅ | 01.08.2026 | 01.08.2026 | САМ п. 1.5 |
| T-002 | Создание TASKS.md | 1. Структура таблицы<br>2. Заполнение начальных задач | 0 | А.В. Бобров | ✅ | 01.08.2026 | 01.08.2026 | Миграция п. 3 |
| T-003 | Workflow `backup_blogger_metadata.yml` | 1. Cron (еженедельно)<br>2. Сохранение в `blogger_image_metadata.json` | 0 | DevOps | ✅ | 01.08.2026 | 01.08.2026 | СУМКа п. 7.2 |
| T-004 | Workflow `update-status.yml` | 1. Триггер на merge в main<br>2. Обновление timestamp | 0 | DevOps | ✅ | 01.08.2026 | 01.08.2026 | СУМКа п. 7.2 |
| T-005 | `robots.txt` для 14 доменов | 1. Правила GPTBot, ClaudeBot, PerplexityBot<br>2. YandexAdditional, Google-Extended | 0 | SEO | ✅ | 01.08.2026 | 01.08.2026 | САМ п. 3.5 |
| T-006 | `ai-hints.txt` для 14 доменов | 1. Разрешение на цитирование<br>2. Условие обратной ссылки | 0 | SEO | ✅ | 01.08.2026 | 01.08.2026 | СУМКа п. 11.1 |
| T-007 | URL `/p/privacy-policy.html` на 14 сайтах | 1. GitHub Pages (Hugo)<br>2. Next.js (САН)<br>3. Blogger (gallery) | 0 | Frontend | ⬜ | 10.08.2026 | — | САМ Приложение Г п. Г1.3 |

---

## ⚡ Приоритет 2: Единый стандарт фронтенда (shared-assets)

| ID | Задача | Подзадачи | Этап | Ответственный | Статус | План. дата | Факт. дата | Комментарий |
|----|--------|-----------|------|---------------|--------|------------|------------|-------------|
| T-101 | 8 HTML-шаблонов в `templates/` | layout, head, header, footer, breadcrumbs, sidebar, article, 404 | 0 | Frontend | ⬜ | 15.08.2026 | — | САМ п. 1.6.1 |
| T-102 | 8 JS-компонентов в `components/` | StickyBottomBar, SocialLinks, feedback-simple, MultiVolumeNavigation, CookieConsent, ShareButtons, ThemeSwitcher, ScrollToTop | 0 | Frontend | ⬜ | 20.08.2026 | — | САМ п. 1.6.1 |
| T-103 | 8 JSON-LD генераторов в `jsonld/` | Article, ImageObject, BreadcrumbList, FAQPage, VideoObject, BookChapter, RealEstateListing, Organization | 0 | Frontend | ⬜ | 25.08.2026 | — | САМ п. 1.6.1 |
| T-104 | 11 CSS-тем в `css/themes/` | blagorussia, obrazslov, partnerstvo, obavlenia, interesnye-mesta, ot-gorozan, novosti, moisites, joga, ideologia, nasa-istoria | 0 | Frontend | ⬜ | 30.08.2026 | — | САМ п. 1.6.1 |
| T-105 | Директория `security/` | csp-header.js, cors-config.json, xss-protection.js | 0 | Security | ⬜ | 10.08.2026 | — | САМ п. 1.6.1 |
| T-106 | Директория `optimization/` | image-sizes.js, lazy-load-config.js, preconnect.js, critical-css.js | 0 | Frontend | ⬜ | 10.08.2026 | — | САМ п. 1.6.1 |

---

## 📚 Приоритет 3: Документация и скрипты

| ID | Задача | Подзадачи | Этап | Ответственный | Статус | План. дата | Факт. дата | Комментарий |
|----|--------|-----------|------|---------------|--------|------------|------------|-------------|
| T-201 | 12 руководств в `/docs/` | IMAGE_SANITIZATION_GUIDE, BLOGGER_IMAGE_STORAGE_GUIDE, SEARCH_CONSOLE_SETUP, SITEMAP_GENERATION_GUIDE, SOCIAL_DISTRIBUTION_GUIDE, SOCIAL_COMMUNITY_MANAGEMENT, DEVELOPMENT_TOOLS и др. | 0 | Tech Writer | ⬜ | 15.09.2026 | — | СУМКа п. 12.1 |
| T-202 | 11 Python/Node.js скриптов | image_sanitizer.py, image_source_extractor.py, generate_sitemaps.py, ping_search_engines.py, build_static_rss.py, extract_original_author.py, slug_optimizer.py, build_hugo_from_db.py, generate_causal_links.py, build_geojson_by_generation.py, grekpanteon_pipeline.py | 0 | Backend | ⬜ | 30.09.2026 | — | Все манифесты |
| T-203 | `verification.json` (14 доменов) | Заполнить все домены, DNS TXT-записи | 0 | SEO | ⬜ | 05.08.2026 | — | САМ п. 7.2.7 |
| T-204 | `social_links.json` (3 бренда) | НКО, САН, Partnership | 0 | SMM | ⬜ | 05.08.2026 | — | СУМКа п. 6.5 |
| T-205 | `image_storage_routing.json` | Маршрутизация Blogger/R2 | 0 | Backend | ⬜ | 10.08.2026 | — | САМ п. 2.4 |
| T-206 | `social_communities_seed.json` | Начальный список групп | 0 | SMM | ⬜ | 10.08.2026 | — | СУМКа п. 12.2 |
| T-207 | `video_alternatives_db.json` | Соответствия видео-платформ | 0 | Backend | ⬜ | 15.08.2026 | — | САН п. 7.2.4 |

---

## 📊 Сводная статистика

| Статус | Количество | Процент |
|--------|------------|---------|
| ✅ Завершено | 6 | 24% |
| 🔄 В работе | 0 | 0% |
| ⬜ Не начато | 19 | 76% |
| ⛔ Заблокировано | 0 | 0% |
| **ИТОГО** | **25** | **100%** |

---

## 📝 Правила ведения TASKS.md

1. **Обновление**: еженедельно по понедельникам до 10:00 UTC
2. **Новые задачи**: добавляются через PR с обязательной ссылкой на протокол
3. **Смена статуса**: только через commit с комментарием `chore: update TASKS.md (T-XXX)`
4. **Архивация**: завершённые задачи старше 90 дней переносятся в `/docs/archive/`
5. **Связь с протоколами**: каждая задача должна ссылаться на пункт манифеста

---

> 📌 **Примечание**: Данный файл является частью процедуры кросс-манифестной
> синхронизации (САМ п. 3.2.1). Любое изменение архитектуры требует создания
> новой задачи с указанием протокола (SAM-/MIG-/SAN-/SUMKA-/GP-).
