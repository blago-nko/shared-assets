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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GrekpanteonPipeline:
    """ETL-конвейер для Грек-Пантеона."""
    
    def __init__(self, credentials_file: str, db_path: str):
        self.gc = g
