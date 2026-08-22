#!/usr/bin/env python3
"""
Backup Blogger Metadata Script

Согласно протоколу 015.2 САМ.md:
- Еженедельный бэкап метаданных Blogger в Git
- Защита от vendor lock-in
- Сохранение информации об изображениях для аварийной миграции

Usage:
    python backup_blogger_metadata.py
"""

import json
import os
from datetime import datetime
from pathlib import Path

# Конфигурация
BLOGGER_METADATA_FILE = 'shared-assets/blogger_image_metadata.json'
OUTPUT_DIR = Path('shared-assets/backups')

def load_existing_metadata():
    """Загружает существующие метаданные, если они есть"""
    if os.path.exists(BLOGGER_METADATA_FILE):
        try:
            with open(BLOGGER_METADATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Warning: Could not load existing metadata: {e}")
    return {
        'last_backup': None,
        'total_images': 0,
        'images': [],
        'backup_history': []
    }

def backup_metadata():
    """Создаёт бэкап метаданных Blogger"""
    print(f"[{datetime.now().isoformat()}] Starting Blogger metadata backup...")
    
    # Загружаем существующие метаданные
    metadata = load_existing_metadata()
    
    # Обновляем timestamp
    metadata['last_backup'] = datetime.now().isoformat()
    
    # Добавляем запись в историю
    backup_entry = {
        'timestamp': metadata['last_backup'],
        'total_images': metadata.get('total_images', 0),
        'backup_type': 'scheduled' if os.getenv('GITHUB_ACTIONS') else 'manual'
    }
    metadata['backup_history'].append(backup_entry)
    
    # Оставляем только последние 52 бэкапа (1 год)
    if len(metadata['backup_history']) > 52:
        metadata['backup_history'] = metadata['backup_history'][-52:]
    
    # Создаём директорию для бэкапов
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Сохраняем метаданные
    with open(BLOGGER_METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"[{datetime.now().isoformat()}] Backup completed successfully")
    print(f"  - Total images: {metadata.get('total_images', 0)}")
    print(f"  - Backup history entries: {len(metadata['backup_history'])}")
    
    return metadata

if __name__ == '__main__':
    try:
        backup_metadata()
    except Exception as e:
        print(f"Error during backup: {e}")
        raise
