document.addEventListener('DOMContentLoaded', function() {
    const bar = document.createElement('div');
    bar.id = 'sticky-bottom-bar';
    bar.innerHTML = `
        <style>
            #sticky-bottom-bar {
                position: fixed; bottom: 0; left: 0; right: 0;
                background: #fff; border-top: 1px solid #e0e0e0;
                display: flex; justify-content: space-around;
                padding: 8px 0; z-index: 1000;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            }
            #sticky-bottom-bar button {
                background: none; border: none; padding: 8px 16px;
                font-size: 14px; cursor: pointer;
            }
            @media (min-width: 768px) { #sticky-bottom-bar { display: none; } }
        </style>
        <button onclick="window.location.href='mailto:blagorussia@yandex.ru'">✉️ Написать</button>
        <button onclick="navigator.share({title: document.title, url: window.location.href})">📤 Поделиться</button>
        <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})">☰ В меню</button>
    `;
    document.body.appendChild(bar);
});
