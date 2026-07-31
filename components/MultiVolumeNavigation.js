/**
 * Компонент навигации по многостраничным материалам (Book/Chapter Pattern)
 * Соответствует САМ v1.3, п. 1.6.1 и Манифесту Миграции v5.4
 */
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('multi-volume-nav');
    if (!navContainer) return;

    // Данные передаются через data-атрибуты из шаблона (Hugo/Jekyll/Blogger)
    const prevUrl = navContainer.dataset.prevUrl;
    const nextUrl = navContainer.dataset.nextUrl;
    const prevTitle = navContainer.dataset.prevTitle || 'Предыдущая часть';
    const nextTitle = navContainer.dataset.nextTitle || 'Следующая часть';

    let html = '<div class="multi-volume-nav__wrapper" role="navigation" aria-label="Навигация по частям материала">';

    if (prevUrl) {
        html += `<a href="${prevUrl}" class="multi-volume-nav__btn multi-volume-nav__btn--prev" aria-label="${prevTitle}">
                    <span class="multi-volume-nav__icon" aria-hidden="true">←</span>
                    <span class="multi-volume-nav__text">${prevTitle}</span>
                 </a>`;
    } else {
        html += `<span class="multi-volume-nav__btn multi-volume-nav__btn--disabled" aria-disabled="true">
                    <span class="multi-volume-nav__icon" aria-hidden="true">←</span>
                    <span class="multi-volume-nav__text">Начало</span>
                 </span>`;
    }

    if (nextUrl) {
        html += `<a href="${nextUrl}" class="multi-volume-nav__btn multi-volume-nav__btn--next" aria-label="${nextTitle}">
                    <span class="multi-volume-nav__text">${nextTitle}</span>
                    <span class="multi-volume-nav__icon" aria-hidden="true">→</span>
                 </a>`;
    } else {
        html += `<span class="multi-volume-nav__btn multi-volume-nav__btn--disabled" aria-disabled="true">
                    <span class="multi-volume-nav__text">Конец</span>
                    <span class="multi-volume-nav__icon" aria-hidden="true">→</span>
                 </span>`;
    }

    html += '</div>';
    navContainer.innerHTML = html;
});
