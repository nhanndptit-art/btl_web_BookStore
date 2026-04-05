const searchInput = document.querySelector('.search-input');
const products = Array.from(document.querySelectorAll('.product-card'));

if (searchInput && products.length) {
    const normalize = (text) => text?.toLowerCase().trim() ?? '';

    searchInput.addEventListener('input', (event) => {
        const query = normalize(event.target.value);

        products.forEach((product) => {
            const title = normalize(product.querySelector('.card-title')?.textContent);
            const author = normalize(product.querySelector('.card-author')?.textContent);
            const matches = title.includes(query) || author.includes(query);

            product.style.display = query.length === 0 || matches ? '' : 'none';
        });
    });
}
