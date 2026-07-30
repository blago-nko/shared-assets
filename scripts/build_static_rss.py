#!/usr/bin/env python3
"""
Парсинг RSS/XML-фидов Blogger и генерация статических HTML-страниц.
Использование: python build_static_rss.py --feed path/to/feed.xml --output ./public
"""
import argparse
import xml.etree.ElementTree as ET
import os
import json
from datetime import datetime
from pathlib import Path

def parse_rss(feed_path):
    tree = ET.parse(feed_path)
    root = tree.getroot()
    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    items = []
    for item in root.findall('.//item'):
        title = item.find('title').text
        link = item.find('link').text
        pub_date = item.find('pubDate').text
        description = item.find('description').text
        # Извлечение контента (может быть в content:encoded)
        content = item.find('{http://purl.org/rss/1.0/modules/content/}encoded')
        if content is not None:
            content = content.text
        else:
            content = description
        items.append({
            'title': title,
            'link': link,
            'pub_date': pub_date,
            'description': description,
            'content': content,
            'slug': link.split('/')[-1].replace('.html', '')  # упрощённо
        })
    return items

def generate_html(item, output_dir, site_theme):
    # Здесь нужно использовать шаблон из shared-assets/templates/layout.html
    # Для простоты – заглушка
    html = f"""<!DOCTYPE html>
<html>
<head><title>{item['title']}</title></head>
<body>
<h1>{item['title']}</h1>
<p>Дата: {item['pub_date']}</p>
<div>{item['content']}</div>
</body>
</html>"""
    slug = item['slug']
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, f"{slug}.html"), 'w', encoding='utf-8') as f:
        f.write(html)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--feed', required=True, help='Путь к RSS/XML фиду')
    parser.add_argument('--output', default='./public', help='Выходная папка')
    parser.add_argument('--theme', default='default', help='Тема оформления')
    args = parser.parse_args()

    items = parse_rss(args.feed)
    print(f"Найдено записей: {len(items)}")
    for item in items:
        generate_html(item, args.output, args.theme)
    print(f"Генерация завершена. Файлы сохранены в {args.output}")

if __name__ == '__main__':
    main()
