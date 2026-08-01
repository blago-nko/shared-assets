#!/usr/bin/env python3
"""
Извлечение атрибуции изображений для grekpanteon.obrazslov.ru
Источник: Грек-Пантеон v1.4 п. 4.3, п. 7.1
Протокол: GP-2607-003
"""

import sqlite3
import json
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ImageSourceExtractor:
    """Извлечение источника изображения из БД + Wikidata API."""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
    
    def extract(self, character_id: int) -> dict:
        """Извлечение атрибуции для персонажа."""
        # Уровень 1: Google Таблица (основной)
        source = self._get_from_db(character_id)
        
        # Уровень 2: Wikidata API (обогащение)
        if source.get('wikidata_id'):
            wikidata_data = self._get_from_wikidata(source['wikidata_id'])
            source.update(wikidata_data)
        
        # Уровень 3: Ручная атрибуция (для фото Боброва А.В.)
        if source.get('photographer') == 'Бобров А.В.':
            source['author'] = 'Бобров Александр Валентинович'
            source['license'] = 'https://creativecommons.org/licenses/by-sa/4.0/'
        
        return self._generate_json_ld(source)
    
    def _get_from_db(self, character_id: int) -> dict:
        """Уровень 1: Извлечение из БД."""
        cursor = self.conn.execute(
            "SELECT source_id, wikidata_id FROM characters WHERE id = ?",
            (character_id,)
        )
        row = cursor.fetchone()
        if not row:
            return {}
        
        source_id, wikidata_id = row
        
        cursor = self.conn.execute(
            "SELECT external_url, author_name, license_url FROM sources WHERE id = ?",
            (source_id,)
        )
        source_row = cursor.fetchone()
        
        return {
            'contentUrl': f"https://grekpanteon.obrazslov.ru/images/{character_id}.webp",
            'source': source_row[0] if source_row else None,
            'author': source_row[1] if source_row else 'Неизвестен',
            'license': source_row[2] if source_row else 'https://creativecommons.org/licenses/by-sa/4.0/',
            'wikidata_id': wikidata_id
        }
    
    def _get_from_wikidata(self, wikidata_id: str) -> dict:
        """Уровень 2: Обогащение через Wikidata API."""
        try:
            url = f"https://www.wikidata.org/wiki/Special:EntityData/{wikidata_id}.json"
            response = requests.get(url, timeout=10)
            data = response.json()
            
            entity = data['entities'][wikidata_id]
            claims = entity.get('claims', {})
            
            result = {}
            
            # wdt:P18 — изображение
            if 'P18' in claims:
                image_claim = claims['P18'][0]
                image_filename = image_claim['mainsnak']['datavalue']['value']
                result['wikimedia_url'] = f"https://commons.wikimedia.org/wiki/File:{image_filename}"
            
            # wdt:P551 — место жительства (координаты)
            if 'P551' in claims:
                residence_claim = claims['P551'][0]
                result['residence_id'] = residence_claim['mainsnak']['datavalue']['value']['id']
            
            return result
        except Exception as e:
            logger.error(f"Ошибка Wikidata API: {e}")
            return {}
    
    def _generate_json_ld(self, source: dict) -> dict:
        """Генерация JSON-LD ImageObject."""
        return {
            "@type": "ImageObject",
            "contentUrl": source.get('contentUrl'),
            "author": {
                "@type": "Person",
                "name": source.get('author', 'Неизвестен')
            },
            "license": source.get('license', 'https://creativecommons.org/licenses/by-sa/4.0/'),
            "source": source.get('source')
        }


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--db', required=True, help='Путь к БД')
    parser.add_argument('--character-id', type=int, required=True)
    args = parser.parse_args()
    
    extractor = ImageSourceExtractor(args.db)
    result = extractor.extract(args.character_id)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
