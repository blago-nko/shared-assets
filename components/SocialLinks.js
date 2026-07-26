document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('social-links');
    if (!container) return;
    container.innerHTML = `
        <a href="https://vk.com/blagorussia" target="_blank" rel="noopener">VK</a>
        <a href="https://t.me/blagorussia" target="_blank" rel="noopener">Telegram</a>
        <a href="https://ok.ru/blagorussia" target="_blank" rel="noopener">OK</a>
    `;
});
