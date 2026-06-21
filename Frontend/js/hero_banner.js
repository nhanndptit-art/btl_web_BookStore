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

});