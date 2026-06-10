const API_URL = 'http://127.0.0.1:8000';
const ITEMS_PER_PAGE = 20;

let currentPage = 1;
let totalPages = 1;
let allBooks = [];

// DOM Elements
const containerPg = document.querySelector('.container_pg');
const paginationContainer = document.querySelector('.pagination-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

/**
 * Fetch books từ API
 */
async function fetchBooks(page = 1) {
    try {
        // Hiển thị loading spinner
        showLoading(true);
        hideError();

        const response = await fetch(`${API_URL}/api/books?page=${page}&limit=${ITEMS_PER_PAGE}`);
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
                <a href="products_detail.html?id=${book.book_id}">${book.title}</a>
            </h3>
            <div class="card-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-number">5</span>
            </div>
            <p class="card-author">
                <a class="author-title" href="#">${authorNames}</a>
            </p>
            <p class="card-price">${price}</p>
        </div>
    `;

    return article;
}

/**
 * Render pagination buttons
 */
function renderPagination(currentPage, totalPages) {
    if (!paginationContainer) {
        console.warn('Pagination container not found');
        return;
    }

    paginationContainer.innerHTML = '';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            fetchBooks(currentPage - 1);
            scrollToTop();
        }
    };
    paginationContainer.appendChild(prevBtn);

    // Page numbers
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'pagination-btn active' : 'pagination-btn';
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
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            fetchBooks(currentPage + 1);
            scrollToTop();
        }
    };
    paginationContainer.appendChild(nextBtn);

    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
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
 * Initialize - load products khi page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing products page...');
    fetchBooks(1);
});
