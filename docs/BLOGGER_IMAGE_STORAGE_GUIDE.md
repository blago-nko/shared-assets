# 🖼️ Руководство по Blogger Image Storage

> **Протоколы**: SAM-26-А, SAN-26-А, SUMKA-26-А, MIG-26-А, GP-26-А
> **Версия**: 1.0 | **Дата**: 01.08.2026
> **Связанные артефакты**:
> - `config/image_storage_routing.json`
> - `scripts/migrate_blogger_to_r2.py`
> - `.github/workflows/backup_blogger_metadata.yml`
> - `blogger_image_metadata.json`

---

## 1. Назначение

Сайт-витрина НКО `gallery.obrazslov.ru` — централизованное хранилище изображений всех проектов экосистемы (ФОТОАРХИВ НКО).

---

## 2. Эволюционная модель хранения (САМ п. 2.4)

| Этап | Blogger (основной) | R2 (резервный) |
|------|--------------------|-----------------|
| -1/0 | Основное хранилище (0 ₽, безлимит при ресайзе ≤2048px) | Только PDF и media_passport.json.gz |
| 1+   | Архив (вечное хранение) | LCP-ускорение для карточек САН |

**Условие безлимита**: Ресайз ≤1600px (гарантирует ≤2048px — лимит Google).

---

## 3. Расчёт объёмов

| Сайт | Объектов | Изображений | Страниц (50/стр) |
|------|----------|-------------|------------------|
| САН (с запасом 100 000) | 100 000 | 800 000 | 16 000 |
| Grekpanteon | 16 505 | 24 758 | 496 |
| 11 RSS-сайтов | 3 000 | 6 000 | 120 |
| **ИТОГО** | **830 758** | **~16 616 стр.** | **~166 ГБ** |

**Стоимость для Google**: 0 ₽ (все изображения ≤2048px).

---

## 4. Защита от vendor lock-in

### 4.1. Скрипт аварийной миграции
```bash
python scripts/migrate_blogger_to_r2.py \
  --blog-id $BLOGGER_BLOG_ID \
  --r2-bucket $R2_BUCKET \
  --dry-run

4.2. Еженедельный бэкап метаданных
Workflow: .github/workflows/backup_blogger_metadata.yml
Файл: shared-assets/blogger_image_metadata.json
Частота: Каждое воскресенье в 03:00 UTC
Метрика: blogger_backup_success_rate (цель ≥ 99%)
4.3. Альтернативный план
При закрытии Blogger → автоматический запуск скрипта → переключение DNS на R2-зеркало.
5. Технические требования к шаблону gallery.obrazslov.ru
5.1. Mobile-First адаптация
Брейкпоинты: xs:320px, sm:600px, md:900px, lg:1200px
Sticky Bottom Bar с навигацией
Адаптивная сетка галереи: 1→2→3→4 колонки
5.2. Семантическая разметка (JSON-LD)
Главная: ImageGallery с атрибуцией publisher, author, license
FAQ: FAQPage (минимум 3 вопроса)
Все страницы: BreadcrumbList
Каждое изображение: ImageObject с author, license, source
5.3. GEO и ИИ-поисковики
Мета-тег: <meta name="robots" content="max-image-preview:large">
Файл ai-hints.txt
Open Graph и Twitter Cards
5.4. Производительность
Lazy loading через IntersectionObserver
Кэширование через localStorage
Кнопка «Загрузить ещё» (лимит 100 страниц)
5.5. Юридический комплаенс
Блок «Раскрытие интересов» на всех страницах
Ссылка на FAQ в футере
Ссылка на ai-hints.html в футере
Ссылка на /p/privacy-policy.html в футере
6. Структура страниц

/{год}/{месяц}/{тема}.html

Навигация через labels (теги Blogger).
7. Метрики мониторинга
Метрика
Цель
gallery_export_success_rate
≥ 95%
blogger_backup_success_rate
≥ 99%
Связанные документы:
САМ v1.3 п. 2.4
СУМКа v1.5 п. 7.3
Манифест САН V21.4 п. 11.35
Манифест Миграции v5.4 п. 5.1.6
Манифест Грек-Пантеон v1.4 п. 7.5
