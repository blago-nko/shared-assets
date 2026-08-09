# 📊 Реестр состояния экосистемы (STATUS.md)

> **Единый источник правды** для Архитектурного Комитета Партнёрства
> Двусторонняя синхронизация: Google Таблица `ecosystem_status` ↔ Git
> Метрика мониторинга: `status_md_autoupdate_success_rate` (цель ≥ 99%)

**Последнее обновление**: 09.08.2026 12:34 UTC
**Авто-обновление**: ✅ (GitHub Actions: `.github/workflows/update-status.yml`)
**Версии манифестов**: САМ v1.3 | Миграция v5.4 | САН V21.4 | СУМКа v1.5 | Грек-Пантеон v1.4

---

## 1. Состояние 14 доменов экосистемы

| № | Домен | Платформа | Репозиторий | Статус | Последняя сборка | Примечание |
|---|-------|-----------|-------------|--------|------------------|------------|
| 1 | blagorussia.ru | GitHub Pages | blago-nko/blagorussia.ru | 🟢 OK | 01.08.2026 | RSS-хаб НКО |
| 2 | obrazslov.ru | GitHub Pages | blago-nko/obrazslov.ru | 🟢 OK | 01.08.2026 | Историко-биографический |
| 3 | partnerstvo.blagorussia.ru | GitHub Pages | blago-nko/partnerstvo | 🟢 OK | 01.08.2026 | Центральный хаб |
| 4 | grekpanteon.obrazslov.ru | Hugo → GitHub Pages | blago-nko/grekpanteon | 🟡 Этап 1 | 01.08.2026 | Статический дамп (16 505+ стр.) |
| 5 | obavlenia.blagorussia.ru | GitHub Pages | blago-nko/obavlenia | 🟢 OK | 01.08.2026 | RSS-агрегатор |
| 6 | interesnye-mesta.obrazslov.ru | GitHub Pages | blago-nko/interesnye-mesta | 🟢 OK | 01.08.2026 | RSS-агрегатор |
| 7 | ot-gorozan.blagorussia.ru | GitHub Pages | blago-nko/ot-gorozan | 🟢 OK | 01.08.2026 | RSS-агрегатор |
| 8 | novosti.blagorussia.ru | GitHub Pages | blago-nko/novosti | 🟢 OK | 01.08.2026 | RSS-агрегатор |
| 9 | moisites.blagorussia.ru | GitHub Pages | blago-nko/moisites | 🟢 OK | 01.08.2026 | RSS-агрегатор |
| 10 | joga.blagorussia.ru | GitHub Pages | blago-nko/joga | 🟢 OK | 01.08.2026 | Образовательный |
| 11 | ideologia.obrazslov.ru | GitHub Pages | blago-nko/ideologia | 🟢 OK | 01.08.2026 | Образовательный |
| 12 | nasa-istoria.blagorussia.ru | GitHub Pages | blago-nko/nasa-istoria | 🟢 OK | 01.08.2026 | Историко-биографический |
| 13 | can.blagorussia.ru | Vercel (PaaS) | can-secure-dev/can-app | 🟡 Этап 1 | 01.08.2026 | Статический дамп → Next.js |
| 14 | gallery.obrazslov.ru | Blogger | blago-nko/gallery-npo | 🟢 OK | 01.08.2026 | Фотоархив НКО |

### Легенда статусов
- 🟢 **OK** — работает штатно, все метрики в норме
- 🟡 **В работе** — идёт миграция / доработка
- 🔴 **Проблема** — требует вмешательства
- ⚫ **Остановлен** — плановое отключение

---

## 2. Состояние манифестов

| Манифест | Версия | Дата утверждения | Протоколы | Статус |
|----------|--------|------------------|-----------|--------|
| САМ | v1.3 | 26.07.2026 | SAM-2607-001/002/003 | ✅ Утверждён |
| Миграция | v5.4 | 26.07.2026 | MIG-2607-001/002/003/004 | ✅ Утверждён |
| САН | V21.4 | 26.07.2026 | SAN-4–10-В, SAN-26-А/В, SAN-2607-001/002 | ✅ Утверждён |
| СУМКа | v1.5 | 26.07.2026 | SUMKA-2607-001/002/003/004 | ✅ Утверждён |
| Грек-Пантеон | v1.4 | 26.07.2026 | GP-2607-001/002/003/004 | ✅ Утверждён |

---

## 3. Ключевые метрики мониторинга

| Метрика | Целевое значение | Факт. значение | Статус |
|---------|------------------|----------------|--------|
| `blogger_backup_success_rate` | ≥ 99% | 99.5% | 🟢 |
| `status_md_autoupdate_success_rate` | ≥ 99% | 100% | 🟢 |
| `gallery_export_success_rate` | ≥ 95% | 97.2% | 🟢 |
| `image_sanitization_success_rate` | ≥ 95% | 98.1% | 🟢 |
| `social_distribution_success_rate` | ≥ 90% | 93.4% | 🟢 |
| `discover_ctr` | ≥ 2% | 2.8% | 🟢 |
| `ai_bots_crawl_rate` | < 10 000/сутки | 4 200/сутки | 🟢 |

---

## 4. Активные риски и блокировки

| ID | Риск | Влияние | Митигация | Ответственный |
|----|------|---------|-----------|---------------|
| R-01 | _Нет активных блокировок_ | — | — | — |

---

## 5. Ближайшие протокольные изменения

| Протокол | Ожидается | Описание |
|----------|-----------|----------|
| SAM-2608-001 | 05.08.2026 | Закрытие "манифест-долга" shared-assets |
| MIG-2608-001 | 10.08.2026 | Завершение Этапа 1 миграции RSS-сайтов |
| SAN-2608-001 | 15.08.2026 | Переход can.blagorussia.ru на Next.js |

---

## 6. Журнал изменений STATUS.md

| Дата | Изменение | Автор |
|------|-----------|-------|
| 01.08.2026 | Инициализация реестра | А.В. Бобров |
| 01.08.2026 | Авто-обновление timestamp | github-actions[bot] |

---

> 📌 **Примечание**: Данный файл обновляется автоматически через GitHub Actions
> после каждого merge в ветку `main`. Ручное редактирование допускается только
> в разделах 4 (риски) и 5 (планируемые протоколы) по решению Архитектурного Комитета.

| 01.08.2026 07:53 UTC | Авто-обновление timestamp | github-actions[bot] |

| 01.08.2026 15:42 UTC | Авто-обновление timestamp | github-actions[bot] |

| 01.08.2026 20:39 UTC | Авто-обновление timestamp | github-actions[bot] |

| 02.08.2026 07:55 UTC | Авто-обновление timestamp | github-actions[bot] |

| 02.08.2026 15:47 UTC | Авто-обновление timestamp | github-actions[bot] |

| 02.08.2026 20:38 UTC | Авто-обновление timestamp | github-actions[bot] |

| 03.08.2026 12:39 UTC | Авто-обновление timestamp | github-actions[bot] |

| 03.08.2026 21:49 UTC | Авто-обновление timestamp | github-actions[bot] |

| 04.08.2026 01:51 UTC | Авто-обновление timestamp | github-actions[bot] |

| 04.08.2026 08:25 UTC | Авто-обновление timestamp | github-actions[bot] |

| 04.08.2026 13:53 UTC | Авто-обновление timestamp | github-actions[bot] |

| 04.08.2026 19:21 UTC | Авто-обновление timestamp | github-actions[bot] |

| 05.08.2026 01:52 UTC | Авто-обновление timestamp | github-actions[bot] |

| 05.08.2026 08:23 UTC | Авто-обновление timestamp | github-actions[bot] |

| 05.08.2026 13:49 UTC | Авто-обновление timestamp | github-actions[bot] |

| 05.08.2026 19:19 UTC | Авто-обновление timestamp | github-actions[bot] |

| 06.08.2026 01:54 UTC | Авто-обновление timestamp | github-actions[bot] |

| 06.08.2026 08:21 UTC | Авто-обновление timestamp | github-actions[bot] |

| 06.08.2026 13:47 UTC | Авто-обновление timestamp | github-actions[bot] |

| 06.08.2026 23:52 UTC | Авто-обновление timestamp | github-actions[bot] |

| 07.08.2026 02:15 UTC | Авто-обновление timestamp | github-actions[bot] |

| 07.08.2026 07:03 UTC | Авто-обновление timestamp | github-actions[bot] |

| 07.08.2026 12:45 UTC | Авто-обновление timestamp | github-actions[bot] |

| 07.08.2026 18:43 UTC | Авто-обновление timestamp | github-actions[bot] |

| 08.08.2026 01:04 UTC | Авто-обновление timestamp | github-actions[bot] |

| 08.08.2026 06:38 UTC | Авто-обновление timestamp | github-actions[bot] |

| 08.08.2026 12:32 UTC | Авто-обновление timestamp | github-actions[bot] |

| 08.08.2026 18:25 UTC | Авто-обновление timestamp | github-actions[bot] |

| 09.08.2026 01:08 UTC | Авто-обновление timestamp | github-actions[bot] |

| 09.08.2026 06:41 UTC | Авто-обновление timestamp | github-actions[bot] |

| 09.08.2026 12:34 UTC | Авто-обновление timestamp | github-actions[bot] |
