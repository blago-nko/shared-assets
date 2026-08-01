#!/usr/bin/env python3
"""
Генерация sitemap батчингом по ID (5000 URL на файл)
Источник: САМ v1.3 п. 7.2.8, СУМКа v1.5 п. 8.5
Протокол: SAM-26-А, SAN-2607-001
"""

import sqlite3
import argparse
from pathlib import Path
from datetime import datetime
import xml.etree.ElementTree as ET


def generate_sitemaps(db_path: str, output_dir: Path, batch_size: int, base_url: str):
    """Генерация sitemap файлов батчингом по ID."""
    conn = sqlite3.connect(db_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    sitemap_files = []
    
    # Мифологические персонажи
    cursor = conn.execute(
        "SELECT slug FROM characters WHERE character_type = 'mythological'"
    )
    slugs = [row[0] for row in cursor.fetchall()]
    if slugs:
        filename = _write_sitemap(output_dir, 'mythological-characters', slugs, base_url)
        sitemap_files.append(filename)
    
    # Исторические персонажи (батчинг по ID)
    cursor = conn.execute(
        "SELECT slug FROM characters WHERE character_type = 'historical' ORDER BY id"
    )
    all_slugs = [row[0] for row in cursor.fetchall()]
    
    for i in range(0, len(all_slugs), batch_size):
        batch = all_slugs[i:i+batch_size]
        batch_num = i // batch_size + 1
        filename = _write_sitemap(
            output_dir,
            f'historical-characters-{batch_num:03d}',
            batch,
            base_url
        )
        sitemap_files.append(filename)
    
    # Генерация sitemap_index.xml
    _write_sitemap_index(output_dir, sitemap_files, base_url)
    
    conn.close()
    print(f"✅ Создано {len(sitemap_files)} sitemap-файлов")


def _write_sitemap(output_dir: Path, name: str, slugs: list, base_url: str) -> str:
    """Запись одного sitemap-файла."""
    filename = f"sitemap-{name}.xml"
    filepath = output_dir / filename
    
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for slug in slugs:
        url = ET.SubElement(urlset, 'url')
        loc = ET.SubElement(url, 'loc')
        loc.text = f"{base_url}/character/{slug}/"
        lastmod = ET.SubElement(url, 'lastmod')
        lastmod.text = datetime.now().strftime('%Y-%m-%d')
    
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space='  ')
    tree.write(filepath, encoding='utf-8', xml_declaration=True)
    
    return filename


def _write_sitemap_index(output_dir: Path, sitemap_files: list, base_url: str):
    """Запись sitemap_index.xml."""
    filepath = output_dir / 'sitemap-index.xml'
    
    sitemapindex = ET.Element('sitemapindex')
    sitemapindex.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for filename in sitemap_files:
        sitemap = ET.SubElement(sitemapindex, 'sitemap')
        loc = ET.SubElement(sitemap, 'loc')
        loc.text = f"{base_url}/{filename}"
        lastmod = ET.SubElement(sitemap, 'lastmod')
        lastmod.text = datetime.now().strftime('%Y-%m-%d')
    
    tree = ET.ElementTree(sitemapindex)
    ET.indent(tree, space='  ')
    tree.write(filepath, encoding='utf-8', xml_declaration=True)


def main():
    parser = argparse.ArgumentParser(description='Генерация sitemap батчингом по ID')
    parser.add_argument('--db', required=True, help='Путь к БД')
    parser.add_argument('--output', required=True, help='Выходная директория')
    parser.add_argument('--batch-size', type=int, default=5000)
    parser.add_argument('--base-url', required=True)
    args = parser.parse_args()
    
    generate_sitemaps(args.db, Path(args.output), args.batch_size, args.base_url)


if __name__ == '__main__':
    main()
