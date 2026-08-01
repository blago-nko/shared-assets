#!/usr/bin/env python3
"""
Генерация GeoJSON по поколениям для геослоя
Источник: Грек-Пантеон v1.4 п. 3.2
Протокол: GP-2607-001
"""

import sqlite3
import json
import argparse
from pathlib import Path


def build_geojson(db_path: str, output_dir: Path, generation: int = None):
    """Генерация GeoJSON для геослоя."""
    conn = sqlite3.connect(db_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Получение локаций с персонажами
    if generation:
        cursor = conn.execute("""
            SELECT DISTINCT l.id, l.name, l.latitude, l.longitude, l.type
            FROM locations l
            JOIN character_locations cl ON l.id = cl.location_id
            JOIN characters c ON cl.character_id = c.id
            WHERE c.generation = ?
        """, (generation,))
    else:
        cursor = conn.execute("""
            SELECT id, name, latitude, longitude, type FROM locations
        """)
    
    locations = cursor.fetchall()
    
    # Генерация GeoJSON
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }
    
    for loc_id, name, lat, lon, loc_type in locations:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "id": loc_id,
                "name": name,
                "type": loc_type
            }
        }
        geojson["features"].append(feature)
    
    # Запись файла
    filename = f"geojson_generation_{generation}.json" if generation else "geojson_all.json"
    output_path = output_dir / filename
    output_path.write_text(
        json.dumps(geojson, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )
    
    conn.close()
    
    print(f"✅ Создано GeoJSON: {output_path.name} ({len(geojson['features'])} точек)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--generation', type=int, help='Поколение (опционально)')
    args = parser.parse_args()
    
    build_geojson(args.db, Path(args.output), args.generation)


if __name__ == '__main__':
    main()
