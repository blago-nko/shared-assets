
---

### Файл A.3: `docs/SITEMAP_GENERATION_GUIDE.md`

```markdown
# 🗺️ Руководство по генерации sitemap

> **Протоколы**: SAM-26-А, SAN-2607-001, SUMKA-22-В, MIG-2607-003, GP-2607-003
> **Версия**: 1.0 | **Дата**: 01.08.2026
> **Скрипт**: `scripts/generate_sitemaps.py`

---

## 1. Принцип батчинга по ID

⚠️ **КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ**: Sitemap формируется по батчингу по ID (5000 URL на файл), а НЕ по коленам или алфавиту.

**Обоснование**:
1. Колено может меняться → 404 ошибки
2. Алфавит неравномерен (А — 2000, Я — 50)
3. Батчинг по ID обеспечивает стабильность URL

---

## 2. Официальные лимиты

| Параметр | Лимит |
|----------|-------|
| URL на файл | 50 000 |
| Размер файла | 50 МБ (несжатый) |
| Файлов в индексе | Без ограничений |

---

## 3. Структура sitemap_index.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://grekpanteon.obrazslov.ru/sitemap-mythological-characters.xml</loc>
    <lastmod>2026-08-01</lastmod>
  </sitemap>
  <sitemap>

4. Запуск скрипта

python scripts/generate_sitemaps.py \
  --db-path ./data/grekpanteon.db \
  --output-dir ./public/sitemaps/ \
  --batch-size 5000 \
  --base-url https://grekpanteon.obrazslov.ru

5. Автоматический ping

python scripts/ping_search_engines.py \
  --sitemap https://grekpanteon.obrazslov.ru/sitemap-index.xml \
  --domain grekpanteon.obrazslov.ru

Связанные документы:
САМ v1.3 п. 7.2.8
СУМКа v1.5 п. 8.5
Манифест САН V21.4 п. 11.34
Манифест Грек-Пантеон v1.4 п. 5.2
    <loc>https://grekpanteon.obrazslov.ru/sitemap-historical-characters-001.xml</loc>
    <lastmod>2026-08-01</lastmod>
  </sitemap>
</sitemapindex>
