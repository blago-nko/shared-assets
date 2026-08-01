#!/usr/bin/env python3
"""
Автоматический ping поисковых систем
Источник: СУМКа v1.5 п. 8.6
Протокол: SUMKA-22-В
"""

import requests
import argparse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PING_URLS = {
    "google": "https://www.google.com/ping?sitemap={}",
    "yandex": "https://yandex.com/ping?sitemap={}",
    "bing": "https://www.bing.com/ping?sitemap={}",
    "indexnow": "https://api.indexnow.org/indexnow?url={}&key={}"
}


def ping_all(sitemap_url: str, domain: str, indexnow_key: str = None):
    """Ping всех поисковых систем."""
    results = {}
    
    for engine, template in PING_URLS.items():
        if engine == 'indexnow' and not indexnow_key:
            continue
        
        try:
            if engine == 'indexnow':
                url = template.format(sitemap_url, indexnow_key)
            else:
                url = template.format(sitemap_url)
            
            response = requests.get(url, timeout=10)
            results[engine] = {
                'status': response.status_code,
                'success': response.status_code == 200
            }
            
            if response.status_code == 200:
                logger.info(f"✅ {engine}: OK")
            else:
                logger.warning(f"⚠️ {engine}: {response.status_code}")
        
        except Exception as e:
            logger.error(f"❌ {engine}: {e}")
            results[engine] = {'status': None, 'success': False, 'error': str(e)}
    
    return results


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sitemap', required=True, help='URL sitemap')
    parser.add_argument('--domain', required=True)
    parser.add_argument('--indexnow-key', help='Ключ IndexNow')
    args = parser.parse_args()
    
    results = ping_all(args.sitemap, args.domain, args.indexnow_key)
    
    success_count = sum(1 for r in results.values() if r.get('success'))
    print(f"\n📊 Итого: {success_count}/{len(results)} успешно")


if __name__ == '__main__':
    main()
