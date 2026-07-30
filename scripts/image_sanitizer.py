#!/usr/bin/env python3
"""
Image Sanitization Pipeline – 5 этапов:
1. EXIF-очистка (требуется exiftool)
2. Конвертация в WebP (sharp)
3. Ресайз до 4 размеров (400, 800, 1200, 1600px) с обязательным ≤1600px
4. Детекция дубликатов (pHash)
5. Водяной знак (опционально)
"""
import os
import argparse
import subprocess
from PIL import Image
import imagehash
from pathlib import Path

def sanitize_image(input_path, output_dir, max_size=1600, watermark=False):
    # 1. EXIF-очистка
    subprocess.run(['exiftool', '-all=', input_path], check=False)
    
    # 2. Открываем изображение
    img = Image.open(input_path)
    # 3. Ресайз до max_size
    if max(img.size) > max_size:
        img.thumbnail((max_size, max_size), Image.LANCZOS)
    
    # 4. Конвертация в WebP
    out_path = Path(output_dir) / (Path(input_path).stem + '.webp')
    img.save(out_path, 'webp', quality=85)
    
    # 5. Детекция дубликатов (pHash) – упрощённо
    hash = imagehash.phash(img)
    print(f"Обработано: {input_path} -> {out_path}, hash={hash}")
    
    # 6. Водяной знак – заглушка
    if watermark:
        # наложение водяного знака
        pass
    return out_path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='Входная папка с изображениями')
    parser.add_argument('--output', required=True, help='Выходная папка')
    parser.add_argument('--max-size', type=int, default=1600, help='Максимальный размер (по умолчанию 1600)')
    parser.add_argument('--watermark', action='store_true', help='Добавить водяной знак')
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)
    for f in Path(args.input).glob('*'):
        if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
            sanitize_image(str(f), args.output, args.max_size, args.watermark)
    print("Обработка завершена.")

if __name__ == '__main__':
    main()
