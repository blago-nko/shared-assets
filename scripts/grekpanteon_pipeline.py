#!/usr/bin/env python3
"""
Основной ETL-конвейер (Google Таблица → БД → обогащение)
Источник: Грек-Пантеон v1.4 п. 1.1
Протокол: GP-2607-001
"""

import gspread
import sqlite3
import argparse
import logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GrekpanteonPipeline:
    """ETL-конвейер для Грек-Пантеона."""
    
    def __init__(self, credentials_file: str, db_path: str):
        self.gc = gspread.service_account(filename=credentials_file)
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
    
    def extract(self, spreadsheet_id: str, sheet_name: str = 'characters'):
        """Извлечение данных из Google Таблицы."""
        logger.info(f"Извлечение данных из {spreadsheet_id}/{sheet_name}")
        
        spreadsheet = self.gc.open_by_key(spreadsheet_id)
        worksheet = spreadsheet.worksheet(sheet_name)
        records = worksheet.get_all_records()
        
        logger.info(f"✅ Извлечено {len(records)} записей")
        return records
    
    def transform(self, records: list) -> list:
        """Трансформация данных."""
        transformed = []
        
        for record in records:
            # Нормализация данных
            transformed_record = {
                'slug': record.get('slug', '').lower().strip(),
                'name': record.get('name', '').strip(),
                'character_type': record.get('character_type', 'mythological'),
                'description': record.get('description', ''),
                'generation': record.get('generation'),
                'birth_year': record.get('birth_year'),
                'death_year': record.get('death_year'),
                'wikidata_id': record.get('wikidata_id'),
                'source_id': record.get('source_id'),
                'meets_publication_criteria': 1 if len(record.get('description', '')) >= 500 else 0
            }
            transformed.append(transformed_record)
        
        logger.info(f"✅ Трансформировано {len(transformed)} записей")
        return transformed
    
    def load(self, records: list):
        """Загрузка в БД."""
        for record in records:
            self.conn.execute("""
                INSERT OR REPLACE INTO characters
                (slug, name, character_type, description, generation, 
                 birth_year, death_year, wikidata_id, source_id, 
                 meets_publication_criteria, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                record['slug'],
                record['name'],
                record['character_type'],
                record['description'],
                record['generation'],
                record['birth_year'],
                record['death_year'],
                record['wikidata_id'],
                record['source_id'],
                record['meets_publication_criteria'],
                datetime.now().isoformat()
            ))
        
        self.conn.commit()
        logger.info(f"✅ Загружено {len(records)} записей в БД")
    
    def close(self):
        self.conn.close()


def main():
    parser = argparse.ArgumentParser(description='ETL-конвейер Грек-Пантеона')
    parser.add_argument('--credentials', required=True, help='Путь к credentials JSON')
    parser.add_argument('--spreadsheet-id', required=True, help='ID Google Таблицы')
    parser.add_argument('--db', required=True, help='Путь к БД')
    parser.add_argument('--sheet-name', default='characters')
    args = parser.parse_args()
    
    pipeline = GrekpanteonPipeline(args.credentials, args.db)
    
    # ETL
    records = pipeline.extract(args.spreadsheet_id, args.sheet_name)
    transformed = pipeline.transform(records)
    pipeline.load(transformed)
    
    pipeline.close()
    
    logger.info("✅ ETL-конвейер завершён успешно")


if __name__ == '__main__':
    main()
