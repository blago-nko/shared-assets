/**
 * Простой виджет обратной связи для RSS-сайтов
 * Интеграция с Web3Forms/Formspree. Соответствует САМ v1.3, п. 1.6.1
 */
document.addEventListener('DOMContentLoaded', () => {
    const feedbackContainer = document.getElementById('feedback-widget');
    if (!feedbackContainer) return;

    // Конфигурация через data-атрибуты для гибкости на разных сайтах
    const formAction = feedbackContainer.dataset.formAction || 'https://api.web3forms.com/submit';
    const accessKey = feedbackContainer.dataset.accessKey || 'YOUR_DEFAULT_ACCESS_KEY';
    const redirectUrl = feedbackContainer.dataset.redirectUrl || window.location.href;

    feedbackContainer.innerHTML = `
        <form action="${formAction}" method="POST" class="feedback-simple__form" id="feedback-form">
            <input type="hidden" name="access_key" value="${accessKey}">
            <input type="hidden" name="subject" value="Новое сообщение с сайта">
            <input type="hidden" name="from_page" value="${window.location.href}">
            <input type="hidden" name="redirect" value="${redirectUrl}">
            
            <!-- Honeypot для защиты от спама -->
            <input type="checkbox" name="botcheck" class="hidden" style="display: none;">

            <div class="feedback-simple__group">
                <label for="fb-name" class="feedback-simple__label">Ваше имя</label>
                <input type="text" id="fb-name" name="name" class="feedback-simple__input" required autocomplete="name">
            </div>

            <div class="feedback-simple__group">
                <label for="fb-email" class="feedback-simple__label">Email (для ответа)</label>
                <input type="email" id="fb-email" name="email" class="feedback-simple__input" autocomplete="email">
            </div>

            <div class="feedback-simple__group">
                <label for="fb-message" class="feedback-simple__label">Сообщение</label>
                <textarea id="fb-message" name="message" class="feedback-simple__textarea" rows="4" required></textarea>
            </div>

            <button type="submit" class="feedback-simple__btn">Отправить сообщение</button>
        </form>
    `;
});
