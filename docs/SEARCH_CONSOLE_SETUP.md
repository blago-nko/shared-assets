
---

### Файл A.2: `docs/SEARCH_CONSOLE_SETUP.md`

```markdown
# 🔍 Руководство по верификации в поисковых системах

> **Протоколы**: SAM-2607-003, SAN-2607-001, SUMKA-2607-003, MIG-2607-003
> **Версия**: 1.0 | **Дата**: 01.08.2026
> **Связанные артефакты**:
> - `config/verification.json`
> - `scripts/ping_search_engines.py`

---

## 1. Матрица обязательности регистрации

| Поисковая система | Обязательность | Домены |
|-------------------|----------------|--------|
| Яндекс Вебмастер | 🔴 ОБЯЗАТЕЛЬНО | Все 14 |
| Google Search Console | 🔴 ОБЯЗАТЕЛЬНО | Все 14 |
| Microsoft Bing | 🟡 ЖЕЛАТЕЛЬНО | Все 14 |
| Mail.ru Вебмастер | 🟡 ЖЕЛАТЕЛЬНО | 11 RSS + САН + gallery |
| Baidu | 🟢 ОПЦИОНАЛЬНО | Только САН |

---

## 2. Архитектура аккаунтов

⚠️ **КРИТИЧНО**: Google Workspace для .ru недоступен с марта 2022.

| Сервис | Email | Обоснование |
|--------|-------|-------------|
| Корпоративная почта | webmaster@blagorussia.ru | Яндекс 360 для НКО (бесплатно) |
| Яндекс Вебмастер | webmaster@blagorussia.ru | Корпоративная почта НКО |
| Google Search Console | Личный Gmail А.В. Боброва | Google Workspace недоступен |
| Bing Webmaster | Личный Microsoft-аккаунт | Единый для всех систем |
| Mail.ru Вебмастер | webmaster@blagorussia.ru | Корпоративная почта НКО |

---

## 3. Процесс регистрации

### Шаг 1: Регистрация Яндекс 360 для НКО
1. Перейти на https://360.yandex.ru
2. Выбрать тариф «Для НКО» (бесплатно)
3. Создать почту `webmaster@blagorussia.ru`

### Шаг 2: Регистрация Google Search Console
1. Перейти на https://search.google.com/search-console
2. Войти через личный Gmail А.В. Боброва
3. Добавить все 14 доменов через DNS TXT-записи

### Шаг 3: Добавление доменов
Для каждого из 14 доменов:
1. Скопировать DNS TXT-запись из `verification.json`
2. Добавить в Яндекс 360 (управление DNS)
3. Подтвердить в Google Search Console

### Шаг 4: Загрузка sitemap
Для каждого домена загрузить `sitemap-index.xml`.

### Шаг 5: Настройка региона
Установить регион: Россия, Воронежская область.

---

## 4. Дополнительные настройки

### Группа webmaster-team
Создать группу `webmaster-team@blagorussia.ru` с доступом:
- А.В. Бобров
- 2 члена Архитектурного Комитета

### Резервное копирование
Настроить автоматический бэкап настроек в:
`shared-assets/config/search_console_backups/`

### IndexNow API
Настроить для мгновенной индексации новых страниц.

---

## 5. Автоматический ping

```bash
python scripts/ping_search_engines.py \
  --sitemap https://blagorussia.ru/sitemap-index.xml \
  --domain blagorussia.ru

Связанные документы:
САМ v1.3 п. 7.2.7
СУМКа v1.5 п. 8.3
Манифест САН V21.4 п. 11.33

```bash
python scripts/ping_search_engines.py \
  --sitemap https://blagorussia.ru/sitemap-index.xml \
  --domain blagorussia.ru
