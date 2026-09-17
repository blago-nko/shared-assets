# Вклад в shared-assets

Процесс контрибуции — как в [blago-nko/manifests](https://github.com/blago-nko/manifests/blob/main/CONTRIBUTING.md).

Специфика этого репозитория:

- Ветки `тип/краткое-описание`; PR в `main`, только squash-merge.
- Hugo-layouts и Astro-компоненты должны сохранять совместимость со всеми подключёнными сайтами.
- Изменения CookieConsent.js и web-бандла затрагивают 14 доменов — обязательно ревью владельца (CODEOWNERS).
- Markdown по markdownlint; локальная проверка:

    npx markdownlint-cli2 "ФАЙЛ.md"

- Лицензии: код AGPLv3, контент CC BY-NC 4.0.
