#!/usr/bin/env python3
"""
Извлечение оригинального авторства из RSS-записей
Источник: Манифест Миграции v5.4 п. 5.1.1.3
Протокол: MIG-2607-003
"""

import feedparser
import json
import argparse
import re
from pathlib import Path


def extract_author(entry) -> dict:
    """Извлечение автора из RSS-записи."""
    # Приоритет 1: author из RSS
    if hasattr(entry, 'author'):
        return {'name': entry.author, 'source': 'rss_author'}
    
    # Приоритет 2: dc:creator
    if hasattr(entry, 'dc_creator'):
        return {'name': entry.dc_creator, 'source': 'dc_creator'}
    
    # Приоритет 3: Извлечение из content
    if hasattr(entry, 'content'):
        content = entry.content[0].value
        match = re.search(r'Автор[:\s]+([^\n<]+)', content)
        if match:
            return {'name': match.group(1).strip(), 'source': 'content_extraction'}
    
    # Приоритет 4: Матрица v4.7 (по умолчанию)
    return {'name': 'Бобров А.В.', 'source': 'default_matrix'}


def process_feed(feed_url: str, output_file: Path):
    """Обработка RSS-фида."""
    feed = feedparser.parse(feed_url)
    
    authors = []
    for entry in feed.entries:
        author = extract_author(entry)
        authors.append({
            'title': entry.title,
            'link': entry.link,
            'author': author
        })
    
    output_file.write_text(
        json.dumps(authors, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )
    
    print(f"✅ Извлечено авторов: {len(authors)}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--feed', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    
    process_feed(args.feed, Path(args.output))


if __name__ == '__main__':
    main()
