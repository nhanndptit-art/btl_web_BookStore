const API_URL = 'http://127.0.0.1:8000';
const ITEMS_PER_PAGE = 20;
const MAX_VISIBLE_FILTERS = 6;

let currentPage = 1;
let totalPages = 1;
let allBooks = [];
let allAuthors = [];
let allGenres = [];
let filteredAuthors = [];
let filteredGenres = [];
let selectedAuthors = new Set();
let selectedGenres = new Set();

// DOM Elements
const containerPg = document.querySelector('.container_pg');
const paginationContainer = document.querySelector('.pagination-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const genreSearchInput = document.getElementById('genre-search');
const authorSearchInput = document.getElementById('author-search');
const genreFilterList = document.getElementById('genre-filter-list');
const authorFilterList = document.getElementById('author-filter-list');

/**
 * Fetch authors từ API
 */
async function fetchAuthors() {
    try {
        const response = await fetch(`${API_URL}/api/authors`);
        const result = await response.json();
        
        if (result.status === 'success') {
            allAuthors = result.data;
            filteredAuthors = [...allAuthors];
            renderAuthorFilters();
        }
    } catch (error) {
        console.error('Error fetching authors:', error);
    }
}

/**
 * Fetch genres từ API
 */
async function fetchGenres() {
    try {
        const response = await fetch(`${API_URL}/api/genres`);
        const result = await response.json();
        
        if (result.status === 'success') {
            allGenres = result.data;
            filteredGenres = [...allGenres];
            renderGenreFilters();
        }
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

/**
 * Render author filter checkboxes
 */
function renderAuthorFilters() {
    authorFilterList.innerHTML = '';
    
    filteredAuthors.slice(0, MAX_VISIBLE_FILTERS).forEach(author => {
        const label = document.createElement('label');
        label.className = 'filter-item';
        label.innerHTML = `
            <input type="checkbox" value="${author.author_id}" class="author-checkbox">
            ${author.author_name}
        `;
        
        // Check if already selected
        const checkbox = label.querySelector('input');
        if (selectedAuthors.has(author.author_id)) {
            checkbox.checked = true;
        }
        
        checkbox.addEventListener('change', () => {
            handleAuthorFilter(author.author_id, checkbox.checked);
        });
        
        authorFilterList.appendChild(label);
    });
}

/**
 * Render genre filter checkboxes
 */
function renderGenreFilters() {
    genreFilterList.innerHTML = '';
    
    filteredGenres.slice(0, MAX_VISIBLE_FILTERS).forEach(genre => {
        const label = document.createElement('label');
        label.className = 'filter-item';
        label.innerHTML = `
            <input type="checkbox" value="${genre.genre_id}" class="genre-checkbox">
            ${genre.genre_name}
        `;
        
        // Check if already selected
        const checkbox = label.querySelector('input');
        if (selectedGenres.has(genre.genre_id)) {
            checkbox.checked = true;
        }
        
        checkbox.addEventListener('change', () => {
            handleGenreFilter(genre.genre_id, checkbox.checked);
        });
        
        genreFilterList.appendChild(label);
    });
}

/**
 * Handle author filter change
 */
function handleAuthorFilter(authorId, isChecked) {
    if (isChecked) {
        selectedAuthors.add(authorId);
    } else {
        selectedAuthors.delete(authorId);
    }
    
    // Fetch books với filter mới
    currentPage = 1;
    fetchBooks(1);
}

/**
 * Handle genre filter change
 */
function handleGenreFilter(genreId, isChecked) {
    if (isChecked) {
        selectedGenres.add(genreId);
    } else {
        selectedGenres.delete(genreId);
    }
    
    // Fetch books với filter mới
    currentPage = 1;
    fetchBooks(1);
}

/**
 * Search authors by name
 */
function searchAuthorsData(searchTerm) {
    if (!searchTerm) {
        filteredAuthors = [...allAuthors];
    } else {
        filteredAuthors = allAuthors.filter(author =>
            author.author_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    renderAuthorFilters();
}

/**
 * Search genres by name
 */
function searchGenresData(searchTerm) {
    if (!searchTerm) {
        filteredGenres = [...allGenres];
    } else {
        filteredGenres = allGenres.filter(genre =>
            genre.genre_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    renderGenreFilters();
}

/**
 * Fetch books từ API
 */
async function fetchBooks(page = 1) {
    try {
        // Hiển thị loading spinner
        showLoading(true);
        hideError();

        // Build query params
        let url = `${API_URL}/api/books?page=${page}&limit=${ITEMS_PER_PAGE}`;
        
        if (selectedAuthors.size > 0) {
            const authorIds = Array.from(selectedAuthors).join(',');
            url += `&author_ids=${authorIds}`;
        }
        
        if (selectedGenres.size > 0) {
            const genreIds = Array.from(selectedGenres).join(',');
            url += `&genre_ids=${genreIds}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === 'success') {
            const data = result.data;
            allBooks = data.books;
            currentPage = data.page;
            totalPages = data.total_pages;

            renderProducts(allBooks);
            renderPagination(data.page, data.total_pages);
            showLoading(false);
        } else {
            showError('Lỗi khi tải dữ liệu: ' + result.message);
            showLoading(false);
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        showError('Không thể kết nối đến server. Vui lòng thử lại sau.');
        showLoading(false);
    }
}

/**
 * Render product cards
 */
function renderProducts(books) {
    if (!containerPg) {
        console.error('Container .container_pg not found');
        return;
    }

    // Xóa tất cả product cards cũ
    containerPg.innerHTML = '';

    if (books.length === 0) {
        containerPg.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Không tìm thấy sản phẩm</p>';
        return;
    }

    books.forEach(book => {
        const productCard = createProductCard(book);
        containerPg.appendChild(productCard);
    });

    // Re-attach event listeners
    attachActionButtonListeners();
}

/**
 * Fetch rating cho một cuốn sách
 */
async function fetchRating(bookId, ratingElement) {
    try {
        const response = await fetch(`${API_URL}/api/reviews/rating/${bookId}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            const data = result.data;
            const averageRating = data.average_rating || 0;
            const totalReviews = data.total_reviews || 0;
            
            // Tạo stars động dựa trên rating
            const stars = generateStars(averageRating);
            ratingElement.innerHTML = `
                <span class="stars">${stars}</span>
                <span class="rating-number">${averageRating.toFixed(1)} (${totalReviews})</span>
            `;
        } else {
            // Nếu không có reviews, hiển thị 0 rating
            ratingElement.innerHTML = `
                <span class="stars">☆☆☆☆☆</span>
                <span class="rating-number">0 (0)</span>
            `;
        }
    } catch (error) {
        console.error('Error fetching rating:', error);
        ratingElement.innerHTML = `
            <span class="stars">☆☆☆☆☆</span>
            <span class="rating-number">0 (0)</span>
        `;
    }
}

/**
 * Tạo stars động dựa trên rating value (1-5)
 */
function generateStars(rating) {
    rating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '⭐'; // Full star
        } else if (i - 0.5 <= rating) {
            stars += '⭐'; // Half star (hiển thị tương tự full star cho đơn giản)
        } else {
            stars += '☆'; // Empty star
        }
    }
    
    return stars;
}

/**
 * Tạo HTML cho một product card
 */
function createProductCard(book) {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('data-book-id', book.book_id);

    const authorNames = book.author_names || 'Unknown Author';
    const price = book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'N/A';
    const coverImg = book.cover_img || 'https://via.placeholder.com/300x400?text=No+Image';

    article.innerHTML = `
        <div class="card-image-wrapper">
            <a href="products_detail.html?id=${book.book_id}">
                <img src="${coverImg}" alt="${book.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
            </a>
            <div class="card-actions">
                <button class="action-btn wishlist-btn" title="Add to wishlist">
                    <img class="ui-icon" src="../assets/icon/heart.png" alt="favorite">
                </button>
                <button class="action-btn view-detail-btn" title="View detail" data-book-id="${book.book_id}">
                    <img class="ui-icon" src="../assets/icon/eye.png" alt="see detail">
                </button>
                <button class="action-btn add-to-cart-btn" title="Add to cart" data-book-id="${book.book_id}">
                    <img class="ui-icon" src="../assets/icon/shop.png" alt="add to cart">
                </button>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">
                <a href="products_detail.html?id=${book.book_id}" class="book-title-link">${book.title}</a>
            </h3>
            <div class="card-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-number">Loading...</span>
            </div>
            <p class="card-author">
                <a class="author-title" href="#">${authorNames}</a>
            </p>
            <p class="card-price">${price}</p>
        </div>
    `;
    
    // Fetch rating sau khi card được tạo
    const ratingElement = article.querySelector('.card-rating');
    fetchRating(book.book_id, ratingElement);
  
    return article;
}

/**
 * Render pagination buttons
 */
function renderPagination(currentPageNum, totalPagesNum) {
    if (!paginationContainer) {
        console.warn('Pagination container not found');
        return;
    }

    paginationContainer.innerHTML = '';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPageNum === 1;
    prevBtn.onclick = () => {
        if (currentPageNum > 1) {
            fetchBooks(currentPageNum - 1);
            scrollToTop();
        }
    };
    paginationContainer.appendChild(prevBtn);

    // Page numbers
    for (let i = Math.max(1, currentPageNum - 2); i <= Math.min(totalPagesNum, currentPageNum + 2); i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPageNum ? 'pagination-btn active' : 'pagination-btn';
        pageBtn.onclick = () => {
            fetchBooks(i);
            scrollToTop();
        };
        paginationContainer.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = currentPageNum === totalPagesNum;
    nextBtn.onclick = () => {
        if (currentPageNum < totalPagesNum) {
            fetchBooks(currentPageNum + 1);
            scrollToTop();
        }
    };
    paginationContainer.appendChild(nextBtn);

    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPageNum} of ${totalPagesNum}`;
    paginationContainer.appendChild(pageInfo);
}

/**
 * Attach event listeners to action buttons
 */
function attachActionButtonListeners() {
    // View detail buttons
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bookId = btn.getAttribute('data-book-id');
            window.location.href = `products_detail.html?id=${bookId}`;
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bookId = btn.getAttribute('data-book-id');
            addToCart(bookId);
        });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addToWishlist(btn);
        });
    });
}

/**
 * Add to cart (placeholder - chưa phát triển)
 */
function addToCart(bookId) {
    console.log('Add to cart:', bookId);
    // TODO: Implement add to cart logic
}

/**
 * Add to wishlist (placeholder - chưa phát triển)
 */
function addToWishlist(btn) {
    btn.classList.toggle('active');
    console.log('Wishlist toggled');
    // TODO: Implement wishlist logic
}

/**
 * Show/hide loading spinner
 */
function showLoading(show) {
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
}

/**
 * Show error message
 */
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

/**
 * Hide error message
 */
function hideError() {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

/**
 * Scroll to top of products
 */
function scrollToTop() {
    const productsMain = document.querySelector('.products-main');
    if (productsMain) {
        productsMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Initialize - load data khi page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing products page...');
    
    // Fetch data
    Promise.all([fetchAuthors(), fetchGenres()]).then(() => {
        fetchBooks(1);
    });
    
    // Add search event listeners
    if (genreSearchInput) {
        genreSearchInput.addEventListener('input', (e) => {
            searchGenresData(e.target.value);
        });
    }
    
    if (authorSearchInput) {
        authorSearchInput.addEventListener('input', (e) => {
            searchAuthorsData(e.target.value);
        });
    }
});
