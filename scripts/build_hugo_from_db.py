#!/usr/bin/env python3
"""
Сборка Hugo-страниц из БД (с поддержкой этапов и лимитов)
Источник: Грек-Пантеон v1.4 п. 8.1
Протокол: GP-2607-001
"""

import sqlite3
import argparse
from pathlib import Path
from datetime import datetime


def build_hugo(db_path: str, output_dir: Path, daily_limit: int = 200):
    """Генерация Hugo-страниц из БД."""
    conn = sqlite3.connect(db_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Получение unpublished персонажей
    cursor = conn.execute("""
        SELECT id, slug, name, description, character_type
        FROM characters
        WHERE is_published = 0
        AND meets_publication_criteria = 1
        ORDER BY id
        LIMIT ?
    """, (daily_limit,))
    
    characters = cursor.fetchall()
    
    for char_id, slug, name, description, char_type in characters:
        # Генерация Markdown-файла
        content = f"""---
title: "{name}"
slug: "{slug}"
date: {datetime.now().strftime('%Y-%m-%d')}
character_type: "{char_type}"
---

{description}
"""
        
        output_path = output_dir / f"{slug}.md"
        output_path.write_text(content, encoding='utf-8')
        
        # Обновление статуса в БД
        conn.execute("""
            UPDATE characters
            SET is_published = 1,
                publication_stage = 1,
                published_date = ?
            WHERE id = ?
        """, (datetime.now().isoformat(), char_id))
        
        print(f"✅ Создано: {output_path.name}")
    
    conn.commit()
    conn.close()
    
    print(f"\n📊 Опубликовано: {len(characters)} персонажей")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--daily-limit', type=int, default=200)
    args = parser.parse_args()
    
    build_hugo(args.db, Path(args.output), args.daily_limit)


if __name__ == '__main__':
    main()
