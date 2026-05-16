const filterState = {
    categories: [],
    authors: []
};
document.addEventListener('DOMContentLoaded', () => {
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const authorInputs = document.querySelectorAll('input[name="author"]');

    categoryInputs.forEach(input => {
        input.addEventListener('change', (e) => handleFilterChange(e, 'categories'));
    });


    authorInputs.forEach(input => {
        input.addEventListener('change', (e) => handleFilterChange(e, 'authors'));
    });
});

function handleFilterChange(event, filterType) {
    const value = event.target.value;
    
    if (event.target.checked) {
        filterState[filterType].push(value);
    } else {
        filterState[filterType] = filterState[filterType].filter(item => item !== value);
    }

    applyFilters();
}

function applyFilters() {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productCategory = product.dataset.category;
        const productAuthor = product.dataset.author;
        const isCategoryMatch = filterState.categories.length === 0 || filterState.categories.includes(productCategory);
        const isAuthorMatch = filterState.authors.length === 0 || filterState.authors.includes(productAuthor);

        if (isCategoryMatch && isAuthorMatch) {
            product.style.display = 'block'; 
        } else {
            product.style.display = 'none';
        }
    });
}