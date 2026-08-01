# 📷 Руководство по обработке изображений (Image Sanitization Pipeline)

> **Единый источник правды** для 5-этапного конвейера обработки изображений экосистемы  
> **Протоколы**: SAM-26-А, SUMKA-22-Б, MIG-2607-003, GP-2607-001, SAN-2607-002  
> **Версия**: 1.0 | **Дата**: 01.08.2026  
> **Скрипт**: `scripts/image_sanitizer.py`  
> **Интерфейс**: `IImageSanitizerService` (САН V21.4 п. 1.1.18)  
> **Связанные манифесты**: САМ v1.3 (п. 2.5), СУМКа v1.5 (п. 5.6), САН V21.4 (п. 11.31), Миграция v5.4 (п. 5.1.1.1), Грек-Пантеон v1.4 (п. 7.4)

---

## 📋 Оглавление

1. [Назначение](#1-назначение)
2. [Область применения](#2-область-применения)
3. [Архитектурные принципы](#3-архитектурные-принципы)
4. [5-этапный конвейер обработки](#4-5-этапный-конвейер-обработки)
5. [Особые требования по сайтам](#5-особые-требования-по-сайтам)
6. [Обязательные HTML-атрибуты](#6-обязательные-html-атрибуты)
7. [Техническая реализация скрипта](#7-техническая-реализация-скрипта)
8. [Интеграция с Blogger Image Storage](#8-интеграция-с-blogger-image-storage)
9. [JSON-LD разметка](#9-json-ld-разметка)
10. [Метрики мониторинга](#10-метрики-мониторинга)
11. [Примеры использования](#11-примеры-использования)
12. [Troubleshooting](#12-troubleshooting)
13. [Связанные документы](#13-связанные-документы)

---

## 1. Назначение

**Image Sanitization Pipeline** — единый 5-этапный конвейер обработки изображений, применяемый ко **всем** изображениям экосистемы из 14 доменов перед их публикацией.

**Цели**:
1. ✅ Соответствие **152-ФЗ** (удаление GPS, метаданных камеры)
2. ✅ Соответствие **Google Discover** (оптимизация Core Web Vitals, LCP < 2.5 сек)
3. ✅ Активация **безлимитного хранения Blogger** (ресайз ≤1600px → гарантировано ≤2048px)
4. ✅ Защита **авторских прав** (обязательная атрибуция author/license/source)
5. ✅ Оптимизация **GEO** (ИИ-поисковики цитируют только изображения с прозрачной атрибуцией)
6. ✅ Снижение размера на **30–50%** (WebP/AVIF)
7. ✅ Детекция **дубликатов** (pHash + Hamming distance)

---

## 2. Область применения

Конвейер применяется ко **всем изображениям** следующих проектов:

| № | Проект | Домен | Объём (оценка) |
|---|--------|-------|----------------|
| 1 | САН | can.blagorussia.ru | 800 000 изображений |
| 2 | Грек-Пантеон | grekpanteon.obrazslov.ru | 24 758 изображений |
| 3–13 | 11 RSS-сайтов | *.blagorussia.ru, *.obrazslov.ru | 6 000 изображений |
| 14 | Галерея НКО | gallery.obrazslov.ru | 830 758 изображений (архив) |
| **ИТОГО** | | | **~830 758 изображений** |

**Объём данных**: ~166 ГБ (WebP, ресайз ≤1600px)  
**Стоимость хранения**: 0 ₽ (все изображения ≤2048px → безлимит Blogger)

---

## 3. Архитектурные принципы

### 3.1. Единый источник правды (САМ п. 3.1)
Все изображения проходят через **один и тот же конвейер**, независимо от сайта-источника. Это гарантирует единообразие качества, атрибуции и оптимизации.

### 3.2. Адаптерная архитектура (САМ п. 2.1)
Конвейер реализован через интерфейс `IImageSanitizerService` (САН V21.4 п. 1.1.18), что позволяет:
- Заменить `sharp` на другой обработчик без изменения бизнес-логики
- Интегрировать с любым хранилищем (Blogger, R2, MinIO)
- Масштабировать горизонтально через Inngest-воркеры

### 3.3. DRY (САМ п. 2.8)
Один скрипт `image_sanitizer.py` обслуживает все 14 сайтов. Новый проект требует только:
1. RSS-фид (или источник изображений)
2. Тема CSS
3. DNS-запись

### 3.4. Mobile-First (САМ п. 4.11)
Все изображения генерируются в 4 размерах для адаптивной загрузки через `srcset`:
- **400px** — Thumbnail (мобильные карточки)
- **800px** — Card (планшеты)
- **1200px** — Article (десктоп, Google Discover)
- **1600px** — Hero (LCP, максимальное качество)

---

## 4. 5-этапный конвейер обработки

### Этап 1: EXIF-очистка 🔒

**Цель**: Удаление персональных данных (GPS-координаты, модель камеры, дата съёмки) для соответствия 152-ФЗ.

**Инструмент**: `exiftool`

```bash
exiftool -all= image.jpg -overwrite_original

Что удаляется:
✅ GPS-координаты (широта, долгота, высота)
✅ Модель камеры и объектива
✅ Дата и время съёмки
✅ Авторские метаданные (перезаписываются на Этапе 9)
✅ Комментарии и пользовательские теги
Проверка:

exiftool image.jpg
# Ожидается: "No EXIF data found"

Обоснование:
152-ФЗ: GPS-координаты являются персональными данными
GDPR: аналогичное требование для европейских пользователей
Авторское право: защита от претензий по DMCA
Этап 2: Конвертация в WebP/AVIF 🗜️
Цель: Сжатие на 30–50% без потери качества для ускорения LCP.
Инструменты:
sharp (Node.js) — основной
cwebp (Google) — fallback
avifenc — для AVIF (экспериментально)
Python-реализация:

from PIL import Image

def convert_to_webp(input_path: Path, output_path: Path, quality: int = 85):
    """Конвертация в WebP с сохранением качества."""
    img = Image.open(input_path)
    
    # Сохранение ICC-профиля (для точной цветопередачи)
    if img.info.get('icc_profile'):
        img.save(output_path, 'WEBP', quality=quality, icc_profile=img.info['icc_profile'])
    else:
        img.save(output_path, 'WEBP', quality=quality)
    
    # Проверка размера
    original_size = input_path.stat().st_size
    new_size = output_path.stat().st_size
    reduction = (1 - new_size / original_size) * 100
    
    print(f"✅ {input_path.name}: {original_size} → {new_size} байт ({reduction:.1f}% reduction)")
    return reduction

Параметры качества:
Размер
Качество
Назначение
400px
75
Thumbnail (быстрая загрузка)
800px
80
Card (баланс)
1200px
85
Article (Google Discover)
1600px
90
Hero (максимальное качество)
Fallback: Если WebP не поддерживается браузером — <picture> с <source type="image/webp"> и <img src="...jpg">.
Этап 3: Ресайз до 4 размеров 📐
Цель: Создание адаптивных изображений для разных брейкпоинтов.
Критическое требование: Максимальный размер — 1600px (гарантирует ≤2048px — лимит Google для безлимитного хранения на Blogger).
Python-реализация:

from PIL import Image

SIZES = {
    'thumbnail': 400,
    'card': 800,
    'article': 1200,
    'hero': 1600
}

def resize_image(input_path: Path, output_dir: Path, format: str = 'webp'):
    """Ресайз изображения до 4 размеров."""
    img = Image.open(input_path)
    results = []
    
    for size_name, max_dimension in SIZES.items():
        # Сохранение пропорций
        img_copy = img.copy()
        img_copy.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        
        output_path = output_dir / f"{input_path.stem}_{size_name}.{format}"
        img_copy.save(output_path, format.upper(), quality=85)
        
        results.append({
            'size': size_name,
            'width': img_copy.width,
            'height': img_copy.height,
            'path': str(output_path)
        })
    
    return results

Проверка лимита:

def verify_blogger_limit(image_path: Path) -> bool:
    """Проверка, что изображение ≤2048px (лимит Blogger)."""
    img = Image.open(image_path)
    return img.width <= 2048 and img.height <= 2048

⚠️ КРИТИЧНО: Если изображение >1600px после ресайза — отклонить и запросить исходник меньшего размера.
Этап 4: Детекция дубликатов 🔍
Цель: Исключение дубликатов для экономии места и защиты от спама.
Алгоритм: pHash (perceptual hash) + Hamming distance
Python-реализация:

import imagehash
from PIL import Image

class DuplicateDetector:
    def __init__(self, threshold: int = 10):
        self.threshold = threshold
        self.hashes = {}
    
    def add_image(self, image_path: Path) -> dict:
        """Добавление изображения в базу хешей."""
        img = Image.open(image_path)
        img_hash = imagehash.phash(img)
        
        # Проверка на дубликат
        for existing_path, existing_hash in self.hashes.items():
            distance = img_hash - existing_hash
            if distance < self.threshold:
                return {
                    'is_duplicate': True,
                    'duplicate_of': str(existing_path),
                    'hamming_distance': distance
                }
        
        # Добавление в базу
        self.hashes[str(image_path)] = img_hash
        return {
            'is_duplicate': False,
            'hash': str(img_hash)
        }
    
    def get_stats(self) -> dict:
        """Статистика по дубликатам."""
        return {
            'total_images': len(self.hashes),
            'unique_images': len(set(self.hashes.values()))
        }

Порог Hamming distance:
Расстояние
Интерпретация
0–5
Идентичные изображения
6–10
Очень похожие (разное сжатие)
11–15
Похожие (разный кроп)
16+
Разные изображения
Действие при дубликате:
Логирование в shared-assets/blogger_image_metadata.json
Удаление дубликата
Уведомление администратора (если >5 дубликатов за час)
Этап 5: Водяной знак (опционально) 💧
Цель: Защита авторских прав для эксклюзивного контента.
Триггер: Флаг is_watermark_enabled = true в Тематическом паспорте сайта.
Особые случаи:
✅ interesnye-mesta.obrazslov.ru: ОБЯЗАТЕЛЬНО фото Боброва А.В. с водяным знаком (СУМКа п. 5.6)
❌ grekpanteon.obrazslov.ru: ЗАПРЕЩЕНО (изображения из открытых источников)
❌ САН: ЗАПРЕЩЕНО (изображения объектов недвижимости)
Python-реализация:

from PIL import Image, ImageDraw, ImageFont

def apply_watermark(image_path: Path, text: str = "© Бобров А.В.") -> Path:
    """Наложение водяного знака в правом нижнем углу."""
    img = Image.open(image_path).convert('RGBA')
    
    # Создание прозрачного слоя
    txt = Image.new('RGBA', img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt)
    
    # Шрифт (адаптивный размер)
    font_size = max(20, img.width // 30)
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except IOError:
        font = ImageFont.load_default()
    
    # Позиция (правый нижний угол с отступом)
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = img.width - text_width - 20
    y = img.height - text_height - 20
    
    # Полупрозрачный текст
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 180))
    
    # Композиция
    watermarked = Image.alpha_composite(img, txt)
    output_path = image_path.with_name(f"{image_path.stem}_watermarked{image_path.suffix}")
    watermarked.convert('RGB').save(output_path)
    
    return output_path

5. Особые требования по сайтам
5.1. gallery.obrazslov.ru (Витрина НКО)
Требования (САМ п. 2.5, СУМКа п. 5.6, САН п. 6.8):
✅ Полная JSON-LD разметка ImageObject с полями:
author (автор изображения)
license (лицензия, обычно CC BY-SA 4.0)
source (URL источника)
✅ Блок «Раскрытие интересов» на каждой странице:

   <div class="disclosure" role="note">
     <strong>⚠️ Раскрытие интересов:</strong> Данный архив является некоммерческим проектом 
     НП «Общественное благополучие Воронежа». Все изображения распространяются под лицензией 
     CC BY-SA 4.0, если не указано иное.
   </div>

✅ Mobile-First адаптация:
Sticky Bottom Bar с навигацией
Адаптивная сетка: 1→2→3→4 колонки
Lazy loading через IntersectionObserver
✅ Ссылка на ai-hints.html в футере
✅ Ссылка на /p/privacy-policy.html в футере
5.2. grekpanteon.obrazslov.ru (Пантеон)
Требования (Грек-Пантеон v1.4 п. 7.1):
✅ ОБЯЗАТЕЛЬНАЯ атрибуция источника в alt и JSON-LD:

   <img 
     src="/images/zeus.webp" 
     alt="Статуя Зевса, античный скульптор (неизвестен), источник: Wikidata"
     title="Зевс — верховный бог древнегреческого пантеона"
     loading="lazy"
     decoding="async"
     width="800"
     height="600"
     itemprop="image"
     data-caption="Статуя Зевса. Источник: https://www.wikidata.org/wiki/Q3409"
   >

✅ Подписи к изображениям с указанием автора и источника
✅ JSON-LD ImageObject с полной атрибуцией:

   {
     "@type": "ImageObject",
     "contentUrl": "https://grekpanteon.obrazslov.ru/images/zeus.webp",
     "author": {
       "@type": "Person",
       "name": "Античный скульптор (неизвестен)"
     },
     "license": "https://creativecommons.org/publicdomain/mark/1.0/",
     "source": "https://www.wikidata.org/wiki/Q3409"
   }

5.3. interesnye-mesta.obrazslov.ru
Требование (СУМКа п. 5.6):
✅ ОБЯЗАТЕЛЬНО фото Боброва А.В. с водяным знаком для всех статей
✅ Водяной знак: © Бобров А.В. в правом нижнем углу
✅ Флаг is_watermark_enabled = true в Тематическом паспорте
5.4. can.blagorussia.ru (САН)
Требования (САН V21.4 п. 11.31):
✅ Главное изображение ≥1200px (для Google Discover)
✅ ОБЯЗАТЕЛЬНЫЙ ресайз ≤1600px (для безлимита Blogger)
✅ Атрибуция для парсерных объектов:

   {
     "@type": "ImageObject",
     "author": {
       "@type": "SoftwareAgent",
       "name": "САН Parser v2.1"
     },
     "source": "https://can.blagorussia.ru/properties/123",
     "license": "https://creativecommons.org/licenses/by-sa/4.0/"
   }

5.5. 11 RSS-сайтов
Базовые требования:
✅ Все 5 этапов конвейера
✅ Ресайз до 4 размеров
✅ WebP/AVIF конвертация
✅ Базовая атрибуция (если известен автор)
✅ OG-теги для социальных сетей
6. Обязательные HTML-атрибуты
Источник: САМ п. 2.5, СУМКа п. 5.6, САН п. 11.31
Атрибут
Назначение
Обязательность
alt
Текстовое описание для поисковиков и скринридеров
🔴 ОБЯЗАТЕЛЬНО
title
Всплывающая подсказка при наведении
🔴 ОБЯЗАТЕЛЬНО
loading="lazy"
Отложенная загрузка (кроме Hero)
🔴 ОБЯЗАТЕЛЬНО
fetchpriority="high"
Приоритетная загрузка Hero (LCP)
🔴 ОБЯЗАТЕЛЬНО для Hero
decoding="async"
Асинхронное декодирование
🔴 ОБЯЗАТЕЛЬНО
width / height
Предотвращение CLS (Cumulative Layout Shift)
🔴 ОБЯЗАТЕЛЬНО
srcset + sizes
Адаптивные изображения
🔴 ОБЯЗАТЕЛЬНО
itemprop="image"
Микроразметка Schema.org
🔴 ОБЯЗАТЕЛЬНО
data-caption
Подпись к изображению (отображается под изображением)
🔴 ОБЯЗАТЕЛЬНО
Пример полной разметки:

<figure itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
  <picture>
    <source 
      type="image/avif" 
      srcset="/images/zeus_400.avif 400w,
              /images/zeus_800.avif 800w,
              /images/zeus_1200.avif 1200w,
              /images/zeus_1600.avif 1600w"
      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 1200px">
    <source 
      type="image/webp" 
      srcset="/images/zeus_400.webp 400w,
              /images/zeus_800.webp 800w,
              /images/zeus_1200.webp 1200w,
              /images/zeus_1600.webp 1600w"
      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 1200px">
    <img 
      src="/images/zeus_1200.jpg" 
      alt="Статуя Зевса, античный скульптор (неизвестен)"
      title="Зевс — верховный бог древнегреческого пантеона"
      loading="lazy"
      fetchpriority="high"
      decoding="async"
      width="1200"
      height="800"
      itemprop="contentUrl"
      data-caption="Статуя Зевса. Источник: Wikidata">
  </picture>
  <figcaption itemprop="caption">
    Статуя Зевса. Источник: 
    <a href="https://www.wikidata.org/wiki/Q3409" itemprop="license">Wikidata</a>
  </figcaption>
  <meta itemprop="author" content="Античный скульптор (неизвестен)">
</figure>

7. Техническая реализация скрипта
7.1. Зависимости
Python (requirements.txt):

Pillow>=10.0.0
imagehash>=4.3.1
piexif>=1.1.3
tqdm>=4.65.0

Системные:

# Ubuntu/Debian
sudo apt-get install exiftool libimage-exiftool-perl

# macOS
brew install exiftool

# Windows
choco install exiftool

7.2. CLI-параметры

python scripts/image_sanitizer.py \
  --input ./raw_images/ \
  --output ./sanitized/ \
  --sizes 400,800,1200,1600 \
  --format webp \
  --quality 85 \
  --watermark false \
  --deduplicate true \
  --dedup-threshold 10 \
  --log-level INFO \
  --output-metadata ./metadata.json

Описание параметров:
Параметр
По умолчанию
Описание
--input
(обязательно)
Входная директория с исходниками
--output
(обязательно)
Выходная директория
--sizes
400,800,1200,1600
Размеры через запятую
--format
webp
Формат (webp или avif)
--quality
85
Качество сжатия (1–100)
--watermark
false
Применять водяной знак
--deduplicate
true
Детекция дубликатов
--dedup-threshold
10
Порог Hamming distance
--log-level
INFO
Уровень логирования
--output-metadata
metadata.json
Файл метаданных
7.3. Структура выходных данных

sanitized/
├── image1_thumbnail.webp
├── image1_card.webp
├── image1_article.webp
├── image1_hero.webp
├── image2_thumbnail.webp
├── ...
└── metadata.json

metadata.json:

{
  "processed_at": "2026-08-01T12:00:00Z",
  "total_images": 100,
  "unique_images": 95,
  "duplicates_removed": 5,
  "average_size_reduction": 42.5,
  "images": [
    {
      "original": "raw/image1.jpg",
      "sizes": {
        "thumbnail": { "path": "sanitized/image1_thumbnail.webp", "width": 400, "height": 300 },
        "card": { "path": "sanitized/image1_card.webp", "width": 800, "height": 600 },
        "article": { "path": "sanitized/image1_article.webp", "width": 1200, "height": 900 },
        "hero": { "path": "sanitized/image1_hero.webp", "width": 1600, "height": 1200 }
      },
      "phash": "a1b2c3d4e5f6",
      "is_duplicate": false
    }
  ]
}

8. Интеграция с Blogger Image Storage
8.1. Эволюционная модель хранения (САМ п. 2.4)
Этап
Blogger
R2
-1/0
Основное хранилище (0 ₽, безлимит)
Только PDF и медиа-паспорта
1+
Архив (вечное хранение)
LCP-ускорение для карточек САН
8.2. Критическое требование
Все изображения должны быть ≤1600px для активации безлимитного хранения на Blogger (лимит Google — 2048px).
Проверка:

def verify_blogger_compliance(image_path: Path) -> bool:
    """Проверка соответствия лимиту Blogger."""
    img = Image.open(image_path)
    return img.width <= 2048 and img.height <= 2048

8.3. Защита от vendor lock-in
✅ Скрипт аварийной миграции: scripts/migrate_blogger_to_r2.py
✅ Еженедельный бэкап метаданных: shared-assets/blogger_image_metadata.json
✅ GitHub Actions: .github/workflows/backup_blogger_metadata.yml
✅ Альтернативный план: При закрытии Blogger → автоматический запуск скрипта → переключение DNS на R2-зеркало
Подробное руководство: /docs/BLOGGER_IMAGE_STORAGE_GUIDE.md
9. JSON-LD разметка
9.1. Базовая разметка ImageObject

{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "contentUrl": "https://example.com/images/photo.webp",
  "width": 1200,
  "height": 800,
  "author": {
    "@type": "Person",
    "name": "Бобров Александр Валентинович"
  },
  "license": "https://creativecommons.org/licenses/by-sa/4.0/",
  "source": "https://example.com/original-source",
  "caption": "Описание изображения",
  "datePublished": "2026-08-01"
}

9.2. Генератор JSON-LD
Файл: shared-assets/jsonld/ImageObject.js

export function generateImageObjectJsonLd(image) {
  return {
    "@type": "ImageObject",
    "contentUrl": image.url,
    "width": image.width,
    "height": image.height,
    "author": {
      "@type": "Person",
      "name": image.author || "Неизвестен"
    },
    "license": image.license || "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": image.source || ""
  };
}

10. Метрики мониторинга
Источник: СУМКа v1.5 п. 10.1, САН V21.4 п. 10
Метрика
Порог срабатывания
Действие
image_sanitization_success_rate
< 95%
Уведомление администратору
image_size_reduction_percent
< 20%
Предупреждение (неоптимальное сжатие)
duplicate_detection_rate
< 90%
Проверка порога Hamming distance
blogger_limit_violations
> 0
Критический алерт (изображения >2048px)
watermark_application_rate
< 100% для interesnye-mesta
Предупреждение
Каналы уведомлений:
🔴 Критические: Telegram + SMS
🟡 Предупредительные: Telegram + email
🟢 Информационные: email
11. Примеры использования
11.1. Базовая обработка

# Обработка всех изображений в директории
python scripts/image_sanitizer.py \
  --input ./raw_images/ \
  --output ./sanitized/

11.2. Обработка с водяным знаком (interesnye-mesta)

python scripts/image_sanitizer.py \
  --input ./raw_images/interesnye-mesta/ \
  --output ./sanitized/interesnye-mesta/ \
  --watermark true \
  --watermark-text "© Бобров А.В."

11.3. Пакетная обработка для САН

python scripts/image_sanitizer.py \
  --input ./raw_images/san/ \
  --output ./sanitized/san/ \
  --sizes 400,800,1200,1600 \
  --format webp \
  --quality 85 \
  --deduplicate true \
  --output-metadata ./san/san_metadata.json

11.4. Интеграция с IGalleryExporter (САН V21.4)

// Автоматический экспорт изображений в gallery.obrazslov.ru
const exporter = new GalleryExporter();

async function exportPropertyImages(propertyId) {
  const images = await getPropertyImages(propertyId);
  
  for (const image of images) {
    // 1. Обработка через Image Sanitization Pipeline
    const sanitized = await imageSanitizer.sanitize(image.buffer);
    
    // 2. Загрузка в Blogger
    const bloggerUrl = await bloggerStorage.upload(sanitized);
    
    // 3. Создание тематической страницы
    await exporter.createThematicPage('недвижимость', [bloggerUrl]);
    
    // 4. Синхронизация метаданных
    await exporter.syncMetadata();
  }
}

12. Troubleshooting
12.1. Ошибка: "Image exceeds Blogger limit (2048px)"
Причина: Исходное изображение >1600px, и ресайз не сработал корректно.
Решение:

# Принудительный ресайз
img = Image.open(image_path)
img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
img.save(output_path, 'WEBP', quality=85)

12.2. Ошибка: "Duplicate detected"
Причина: Изображение уже существует в базе с Hamming distance < 10.
Решение:
Проверить metadata.json на наличие дубликата
Если дубликат легитимен — увеличить --dedup-threshold до 5
Если дубликат ошибочен — удалить исходник
12.3. Ошибка: "EXIF data not removed"
Причина: exiftool не установлен или не в PATH.
Решение:

# Ubuntu/Debian
sudo apt-get install libimage-exiftool-perl

# macOS
brew install exiftool

# Проверка
exiftool -ver

12.4. Ошибка: "WebP conversion failed"
Причина: Pillow не скомпилирован с поддержкой WebP.
Решение:

pip install --upgrade Pillow
# Или установить системные зависимости
sudo apt-get install libwebp-dev

3. Связанные документы
Документ
Описание
САМ v1.3 п. 2.5
Image Sanitization Pipeline (единый конвейер)
СУМКа v1.5 п. 5.6
Регламент обработки изображений
САН V21.4 п. 11.31
Руководство по обработке изображений
Миграция v5.4 п. 5.1.1.1
Подготовка данных для RSS-сайтов
Грек-Пантеон v1.4 п. 7.4
Обработка изображений Пантеона
/docs/BLOGGER_IMAGE_STORAGE_GUIDE.md
Эволюционная модель хранения
/docs/SOCIAL_DISTRIBUTION_GUIDE.md
Дистрибуция в социальные сети
shared-assets/jsonld/ImageObject.js
Генератор JSON-LD
scripts/image_sanitizer.py
Основной скрипт конвейера
scripts/image_source_extractor.py
Извлечение атрибуции для Пантеона
✅ Чек-лист перед публикацией изображения
EXIF-данные удалены (exiftool -all=)
Конвертировано в WebP/AVIF
Создано 4 размера (400, 800, 1200, 1600px)
Максимальный размер ≤1600px (лимит Blogger)
Проверено на дубликаты (pHash)
Добавлены все 9 HTML-атрибутов
JSON-LD ImageObject с author/license/source
OG-теги для социальных сетей
Мета-тег max-image-preview:large
Подпись (caption) с указанием источника
Водяной знак (если требуется)
Блок «Раскрытие интересов» (для gallery.obrazslov.ru)
Версия документа: 1.0
Дата создания: 01.08.2026
Следующее обновление: По протоколу Архитектурного Комитета
Ответственный: А.В. Бобров (Администратор экосистемы)
