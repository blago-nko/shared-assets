#!/usr/bin/env python3
"""
ИИ-оптимизация slug (сжатие до 5-6 ключевых слов)
Источник: Манифест Миграции v5.4 п. 2
Протокол: MIG-2607-003
"""

import json
import argparse
from pathlib import Path


def optimize_slug(title: str, max_words: int = 6) -> str:
    """Оптимизация slug через ИИ (заглушка)."""
    # В production здесь должен быть вызов Gemini API
    # с промптом: "Сожми заголовок до 5-6 ключевых слов для URL"
    
    # Временная реализация: удаление стоп-слов
    stop_words = {'о', 'в', 'на', 'для', 'и', 'а', 'с', 'по', 'к', 'из'}
    words = title.lower().split()
    optimized = [w for w in words if w not in stop_words][:max_words]
    return '-'.join(optimized)


def process_queue(queue_file: Path, output_file: Path):
    """Обработка очереди slug."""
    queue = json.loads(queue_file.read_text(encoding='utf-8'))
    
    for item in queue['queue']:
        if item['status'] == 'pending':
            optimized = optimize_slug(item['original_slug'].replace('-', ' '))
            item['optimized_slug'] = optimized
            item['status'] = 'optimized'
    
    output_file.write_text(
        json.dumps(queue, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )
    
    print(f"✅ Оптимизировано: {len(queue['queue'])}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--queue', required=True, help='Файл очереди')
    parser.add_argument('--output', required=True, help='Выходной файл')
    args = parser.parse_args()
    
    process_queue(Path(args.queue), Path(args.output))


if __name__ == '__main__':
    main()
