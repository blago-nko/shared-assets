# shared-assets

Общие ассеты экосистемы [blago-nko](https://github.com/blago-nko).

## Структура

- `hugo/` — общая Hugo-тема для 11 RSS-сайтов
- `astro/` — Astro-компоненты для 2 сайтов (Астро-витрины)
- `web/` — общий CSS/JS бандл, CookieConsent.js
- `rss/` — шаблоны и генераторы RSS-фидов

## Подключение к проекту (Hugo)

Как git submodule:

    git submodule add https://github.com/blago-nko/shared-assets.git themes/shared-assets
    git submodule update --init --recursive

В `config.toml`:

    theme = "shared-assets"

## Подключение к проекту (Astro)

Как git submodule + импорт:

    git submodule add https://github.com/blago-nko/shared-assets.git src/shared-assets

Импорт компонентов:

    import { Header } from './shared-assets/astro/src/components/Header.astro';

## Лицензии

- Код (скрипты, CSS, JS, шаблоны) — AGPLv3, см. LICENSE
- Контент (шаблоны RSS, тексты компонентов) — CC BY-NC 4.0, см. LICENSE-CONTENT

## Связанные репозитории

- [blago-nko/manifests](https://github.com/blago-nko/manifests) — реестр манифестов и задач
- 11 Hugo-сайтов + 2 Astro-сайта (подключают этот репозиторий как submodule)

## Контрибуция

PR приветствуются. См. CONTRIBUTING.md (появится вместе с INFRA-034).
