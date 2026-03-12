const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-input');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        if (e.target === searchInput) return;

        e.preventDefault();
        navItems.forEach(nav => {
            nav.classList.remove('active');
            const icon = nav.querySelector('i');
            const iconName = nav.getAttribute('data-icon');
            icon.className = `ph ph-${iconName}`;
        });

        this.classList.add('active');
        const activeIcon = this.querySelector('i');
        const activeIconName = this.getAttribute('data-icon');
        activeIcon.className = `ph-fill ph-${activeIconName}`;

        if (this.classList.contains('search-item')) {
            searchInput.focus();
        } else {
            searchInput.value = ''; 
        }
    });
});