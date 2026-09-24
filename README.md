# shared-assets

Общие ассеты экосистемы [blago-nko](https://github.com/blago-nko).

## Структура

- `hugo/` — общая Hugo-тема для 13 сайтов (все мигрируют на Hugo)
- `astro/` — Astro-компоненты (post-wave переработка Пантеона после полной Hugo-миграции)
- `web/` — общий CSS/JS бандл, CookieConsent.js
- `rss/` — шаблоны и генераторы RSS-фидов

## Подключение к проекту (Hugo)

### Основной механизм: [module.mounts] (рекомендуется)

Как git submodule:

    git submodule add https://github.com/blago-nko/shared-assets.git themes/shared-assets
    git submodule update --init --recursive

В `config.toml`:

    [module]
      [[module.mounts]]
        source = "themes/shared-assets/hugo/layouts"
        target = "layouts"
      [[module.mounts]]
        source = "themes/shared-assets/web/css"
        target = "static/css"
      [[module.mounts]]
        source = "themes/shared-assets/web/js"
        target = "static/js"

### Альтернатива: theme = "shared-assets"

Для простых случаев без переопределения layouts:

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
- 13 Hugo-сайтов подключают этот репозиторий как submodule; Astro/Next — post-wave этапы для Пантеона и САН

## Контрибуция

PR приветствуются. См. CONTRIBUTING.md (появится вместе с INFRA-034).
