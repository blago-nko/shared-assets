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

## ⚠️ Важные архитектурные решения (Architecture Decisions)

### 1. Инициализация Pagefind для GitHub Pages Subdirectories (INFRA-097)

При развертывании сайтов в подкаталогах (например, `https://user.github.io/repo/`), стандартный импорт ES-модулей Pagefind (`import.meta.url`) работает некорректно.
**Решение:** Использовать динамическую загрузку скрипта `pagefind-ui.js` через создание тега `<script>` в JS, с явным определением `basePath` на основе `window.location.pathname`.

### 2. Предотвращение мигания/сдвига логотипа при клике (INFRA-095)

Асинхронная декодировка изображений (`decoding="async"`) в сочетании с flex-контейнерами может вызывать микро-сдвиги (jitter) при reflow соседних элементов (например, при `:active` состоянии ссылки).
**Решение:**

- Убрать атрибут `decoding="async"` у логотипа (или явно указать `decoding="sync"`).
- Применить к контейнеру логотипа и самому изображению строгие правила: `flex: 0 0 auto !important`, `flex-shrink: 0 !important`.

### 3. Индексация Pagefind под Hugo pretty-URLs и изоляция контента (INFRA-097, расширение)

Hugo по умолчанию генерирует «красивые» URL: вместо файла `.../post.html` создаётся каталог `.../post/index.html`. Стандартный glob Pagefind читает каталоги как файлы и падает с `Is a directory (os error 21)`.
**Решение:**

- `pagefind.yml`: `glob: "**/index.html"` — искать только реальные файлы внутри каталогов.
- `baseof.html`: `<main>` получает `data-pagefind-body` **условно** — только когда `.Kind == "page"` (статья/about); для `home`/`section`/`taxonomy`/`term` ставится `data-pagefind-ignore`. В строгом режиме Pagefind пропускает страницы без body целиком, поэтому листинги и главная (дублировавшие карточки-сниппеты и дававшие мусорные заголовки вида «Categories | …») выпадают из индекса. Это согласует внутренний поиск с уже имеющимся `noindex` на листингах.
- Многословные запросы оборачиваются в кавычки на клиенте (фразовый режим) против шума однобуквенных предлогов: у Pagefind нет стоп-листов, поэтому запрос «о нас» без кавычек матчил предлог «о» на каждой странице. Реализация — нормализация значения поля в capture-фазе события `input` (без ре-диспатча, ровно один поиск на нажатие), идемпотентная к явным кавычкам пользователя.
- `data-pagefind-weight="100"` на `<h1>` статьи — совпадения в заголовке ранжируются выше совпадений в теле.

### 4. Tap-target 44px vs инлайн-ссылки в потоке текста (INFRA-074)

Глобальное правило `a, button { min-height: 44px; display: inline-flex; }` обеспечивает тап-таргеты навигации/кноппок, но просачивалось в инлайн-ссылки внутри описаний и заголовков карточек, растягивая строку до 44px при line-height 24–26px (видимый разрыв ритма «только в месте ссылки»).
**Решение:** сброс `display:inline; min-height:0` для инлайн-ссылок в контентных контейнерах (`.post-content a, .post-card-summary a, .post-card-title a`). Навигация/меню/кнопки не затронуты (не матчатся селектором) — проверено computed-замером (nav/menu/sticky остались 44px).

### 5. Контекст `$` внутри `range`/`with` (alt и Permalink карточек)

В Hugo `$` = корневой контекст шаблона (для листинга = страница-лист), а **не** итерируемая статья. Использование `{{ $.Title }}` / `{{ .Permalink }}` внутри `{{ with .Params.image }}` даёт строку-URL обложки вместо статьи → сборка падает (`can't evaluate field Permalink in type string`), а `alt` всех обложек становится заголовком страницы.
**Решение:** захватывать итерируемую статью в переменную сразу после `range` (`{{ $article := . }}`) и обращаться к `$article.Permalink` / `$article.Title`. Применено и к ссылке-обёртке обложки, и к

### 6. Не удалять «дубли» .site-logo в design-tokens.css (INFRA-095, аудит 2026-10-03)

**Проблема:** в `design-tokens.css` несколько блоков `.site-logo` / `.site-logo-link` выглядят как мёртвый дубль и провоцируют механическую чистку. Удаление регрессит шапку на всех 13 сайтах темы.
**Вердикт аудита (read-only, grep + computed по обеим темам):** дубли — живой override-каскад. `design-tokens.css` единственный владеет `!important` для `filter/opacity` (анти-фильтр), `padding/background/border-radius/display` ссылки и `width/height/object-fit` логотипа. Инертные ранние копии ничего не стоят в рантайме, но удаление кластера теряет эти свойства.
**Почему clamp INFRA-100 безопасен:** он задаёт только `width/height`; anti-jitter-защита INFRA-095 (`flex: 0 0 auto`, `flex-shrink: 0`, `decoding="sync"`, GPU-подсказки `will-change/transform/backface/image-rendering`) живёт в `main.css` и по набору свойств с `design-tokens.css` не пересекается ⇒ победитель каскада фиксирован независимо от порядка загрузки (disjoint `!important`).
**Site-level override = 0:** grep по `obrazslov` вне темы (`*.css`/`*.html`) + `public/` gitignored (scratch-билд) подтвердили, что логотип контролируют ровно два файла темы.
**Правило для агентов:** не удалять дубли механически.

### 7. Запрет на ручные `<img>` теги; использование только шорткода `{{< img >}}` (INFRA-104)

**Проблема:** Ручная вставка изображений в Markdown приводит к отсутствию обязательных атрибутов (`srcset`, `loading="lazy"`, `fetchpriority`, `width/height` для CLS), дублированию alt-текста и нарушению требований Google Discover/Core Web Vitals.
**Решение:** Все изображения в контенте всех 13 Hugo-сайтов обязаны вставляться через шорткод `{{< img src="..." alt="..." caption="..." />}}`. Шорткод автоматически генерирует полный набор HTML-атрибутов, указанных в МИГРАЦИЯ §5.1.1.7 и СУМКа §5.6.
**Правило для агентов:** При обнаружении ручного тега `<img>` в `.md` файлах — заменить на шорткод. Если шорткод недоступен (этап разработки) — пометить задачу как блокирующую деплой сайта. Любая будущая чистка — только после computed-замера в обеих темах и disjoint-`!important`-анализа обоих файлов, по факту, а не по виду «повторяющийся селектор». `alt`.
