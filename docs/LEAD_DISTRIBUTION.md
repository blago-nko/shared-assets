# 🎯 Руководство по распределению лидов

> **Протокол**: SAN-2607-001
> **Версия**: 1.0 | **Дата**: 01.08.2026

---

## 1. Назначение

Автоматическое распределение клиентских запросов на парсерные объекты с учётом географии, рейтинга и нагрузки.

---

## 2. Таблица нераспределённых лидов

```sql
CREATE TABLE pending_leads (
  id uuid PRIMARY KEY,
  property_id uuid REFERENCES properties(id),
  status smallint DEFAULT 1,  -- 1=Pending, 2=Offering, 3=Accepted
  offered_to_agent_ids uuid[],
  current_batch integer DEFAULT 1,
  accepted_by_agent_id uuid
);

3. Скоринг агентов
Гео-фильтр (PostGIS)

SELECT id FROM agents
WHERE ST_DWithin(
  location,
  (SELECT geometry FROM properties WHERE id = $1),
  $max_distance_km * 1000
);

Формула скора

Итоговый скор = Базовое значение (расстояние) ×
  Коэф_рейтинга × Коэф_нагрузки × Коэф_специализации × Коэф_бонуса

Коэффициенты
Фактор
Диапазон
Рейтинг
0.8–1.2
Нагрузка
1.0–1.2
Специализация
0.9–1.1
Партнёр
0.95
4. Волновое оповещение
Сортировка агентов по возрастанию скора
Выбор первых N агентов (N = lead_batch_size, по умолчанию 5)
Таймер на ответ: 2 часа
Если никто не принял → размер волны удваивается
5. Настройки (app_config)
Параметр
Значение
lead_batch_size
5
lead_response_timeout_hours
2
lead_max_distance_km
50
lead_selection_mode
'auto'
6. Учёт статуса активности
Агенты с is_active = false исключаются из всех волн.
Связанные документы:
Манифест САН V21.4 п. 8.7, 11.12


---

## 📦 ЧАСТЬ B: Python-скрипты (11 файлов)

### Файл B.1: `scripts/image_sanitizer.py`

**Источник требования**: САМ v1.3 п. 2.5, СУМКа v1.5 п. 5.6

```python
#!/usr/bin/env python3
"""
Image Sanitization Pipeline — 5-этапная обработка изображений
Источник: САМ v1.3 п. 2.5, СУМКа v1.5 п. 5.6
Протокол: SAM-26-А, SUMKA-22-Б
"""

import os
import argparse
import logging
from pathlib import Path
from PIL import Image
import imagehash
import subprocess

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ImageSanitizer:
    """5-этапный конвейер обработки изображений."""
    
    def __init__(self, sizes=(400, 800, 1200, 1600), format='webp', quality=85):
        self.sizes = sizes
        self.format = format
        self.quality = quality
        self.hashes = {}
    
    def sanitize(self, input_path: Path, output_dir: Path, watermark=False):
        """Полный 5-этапный конвейер."""
        logger.info(f"Обработка: {input_path}")
        
        # Этап 1: EXIF-очистка
        self._clean_exif(input_path)
        
        # Этап 2-3: Конвертация и ресайз
        img = Image.open(input_path)
        
        for size in self.sizes:
            resized = img.copy()
            resized.thumbnail((size, size), Image.Resampling.LANCZOS)
            
            output_path = output_dir / f"{input_path.stem}_{size}.{self.format}"
            
            if self.format == 'webp':
                resized.save(output_path, 'WEBP', quality=self.quality)
            else:
                resized.save(output_path, 'AVIF', quality=self.quality)
            
            # Этап 4: Детекция дубликатов
            img_hash = imagehash.phash(resized)
            if self._is_duplicate(img_hash):
                logger.warning(f"Дубликат обнаружен: {output_path}")
                output_path.unlink()
                continue
            
            self.hashes[str(output_path)] = img_hash
            
            # Этап 5: Водяной знак (опционально)
            if watermark:
                self._apply_watermark(output_path)
        
        logger.info(f"✅ Завершено: {input_path.name}")
    
    def _clean_exif(self, path: Path):
        """Этап 1: Удаление EXIF-данных."""
        try:
            subprocess.run(
                ['exiftool', '-all=', str(path), '-overwrite_original'],
                check=True, capture_output=True
            )
        except subprocess.CalledProcessError as e:
            logger.error(f"Ошибка EXIF-очистки: {e}")
    
    def _is_duplicate(self, new_hash, threshold=10):
        """Этап 4: Проверка на дубликат по Hamming distance."""
        for existing_hash in self.hashes.values():
            if new_hash - existing_hash < threshold:
                return True
        return False
    
    def _apply_watermark(self, path: Path):
        """Этап 5: Наложение водяного знака."""
        # Реализация зависит от требований проекта
        logger.info(f"Водяной знак: {path}")


def main():
    parser = argparse.ArgumentParser(description='Image Sanitization Pipeline')
    parser.add_argument('--input', required=True, help='Входная директория')
    parser.add_argument('--output', required=True, help='Выходная директория')
    parser.add_argument('--sizes', default='400,800,1200,1600', help='Размеры через запятую')
    parser.add_argument('--format', default='webp', choices=['webp', 'avif'])
    parser.add_argument('--quality', type=int, default=85)
    parser.add_argument('--watermark', action='store_true')
    
    args = parser.parse_args()
    
    sizes = tuple(map(int, args.sizes.split(',')))
    sanitizer = ImageSanitizer(sizes=sizes, format=args.format, quality=args.quality)
    
    input_dir = Path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for image_path in input_dir.glob('*.*'):
        if image_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
            sanitizer.sanitize(image_path, output_dir, watermark=args.watermark)


if __name__ == '__main__':
    main()


