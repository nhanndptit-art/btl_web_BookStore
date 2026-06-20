document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.anim-item');
    if (items.length === 0) return;

    function playHeroIntro() {
        for (const item of items) {
            item.classList.remove('show');
        }

        void document.body.offsetWidth;

        for (const item of items) {
            item.classList.add('show');
        }
    }

    playHeroIntro();

    setInterval(() => {
        for (const item of items) {
            item.style.transition = 'opacity 0.6s ease';
            item.style.opacity = 0;
        }

        setTimeout(() => {
            for (const item of items) {
                item.style.transition = '';
                item.style.opacity = '';
            }
            playHeroIntro();
        }, 700);
    }, 9000);
});