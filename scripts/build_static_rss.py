#!/usr/bin/env python3
"""
Парсинг RSS/XML Blogger и генерация статических HTML-страниц
Источник: Манифест Миграции v5.4 п. 9
Протокол: MIG-2607-003
"""

import feedparser
import argparse
from pathlib import Path
from datetime import datetime
import re


def build_static_rss(feed_url: str, output_dir: Path, site_id: str):
    """Парсинг RSS и генерация HTML."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    feed = feedparser.parse(feed_url)
    
    for entry in feed.entries:
        title = entry.title
        content = entry.content[0].value if hasattr(entry, 'content') else entry.summary
        published = datetime(*entry.published_parsed[:6])
        
        slug = _generate_slug(title)
        html = _generate_html(title, content, published, slug, site_id)
        
        output_path = output_dir / f"{slug}.html"
        output_path.write_text(html, encoding='utf-8')
        
        print(f"✅ Создано: {output_path.name}")


def _generate_slug(title: str) -> str:
    """Генерация slug из заголовка."""
    slug = title.lower()
    slug = re.sub(r'[^a-zа-я0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug[:50]


def _generate_html(title: str, content: str, published: datetime, slug: str, site_id: str) -> str:
    """Генерация HTML-страницы."""
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta property="og:title" content="{title}">
  <meta property="og:type" content="article">
  <meta property="article:published_time" content="{published.isoformat()}">
  <meta name="robots" content="max-image-preview:large">
  <link rel="stylesheet" href="/shared-assets/css/variables.css">
  <link rel="stylesheet" href="/shared-assets/css/base.css">
  <link rel="stylesheet" href="/shared-assets/css/themes/{site_id}.css">
</head>
<body class="site-{site_id}">
  <article class="article">
    <h1>{title}</h1>
    <time datetime="{published.isoformat()}">{published.strftime('%d.%m.%Y')}</time>
    <div class="content">{content}</div>
  </article>
  <script src="/shared-assets/js/main.js" defer></script>
</body>
</html>"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--feed', required=True, help='URL RSS-фида')
    parser.add_argument('--output', required=True, help='Выходная директория')
    parser.add_argument('--site-id', required=True, help='ID сайта (для темы CSS)')
    args = parser.parse_args()
    
    build_static_rss(args.feed, Path(args.output), args.site_id)


if __name__ == '__main__':
    main()
