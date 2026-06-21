const API_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (bookId) {
        Promise.all([
            fetchBookDetail(bookId),
            fetchBookImages(bookId),
            fetchBookRating(bookId)
        ]);
    } else {
        window.location.href = 'products.html';
    }
});

async function fetchBookDetail(bookId) {
    try {
        const response = await fetch(`${API_URL}/api/books/${bookId}`);
        const result = await response.json();

        if (result.status === 'success' && result.data) {
            renderBookDetail(result.data);
        } else {
            console.error('Không tìm thấy thông tin sách');
        }
    } catch (error) {
        console.error('Lỗi khi tải chi tiết sách:', error);
    }
}

async function fetchBookImages(bookId) {
    try {
        const response = await fetch(`${API_URL}/api/books/${bookId}/images`);
        const result = await response.json();

        if (result.status === 'success' && result.data) {
            renderBookImages(result.data);
        }
    } catch (error) {
        console.error('Lỗi khi tải ảnh sách:', error);
    }
}

async function fetchBookRating(bookId) {
    try {
        const response = await fetch(`${API_URL}/api/reviews/rating/${bookId}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
            renderRating(result.data.average_rating, result.data.total_reviews);
        } else {
            renderRating(0, 0);
        }
    } catch (error) {
        console.error('Error fetching rating:', error);
        renderRating(0, 0);
    }
}

function renderBookDetail(book) {
    // Xử lý dữ liệu fallback nếu có trường bị null trong DB
    const publisher = book.publisher || 'Đang cập nhật';
    const pageNumber = book.page_number || 'Đang cập nhật';
    const size = book.size || 'Đang cập nhật';
    const coverType = book.cover_type || 'Đang cập nhật';
    const publishedYear = book.published_date ? book.published_date.split('-')[0] : 'Đang cập nhật';
    
    const price = book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'N/A';
    const authorNames = book.author_names || 'Đang cập nhật';
    const genreNames = book.genre_names || 'Đang cập nhật';

    // Đắp thông tin cơ bản
    document.title = `${book.title} - StoreHau`;
    document.getElementById('detail-breadcrumb-name').textContent = book.title;
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-sku').textContent = `Mã SP: ${book.book_code || book.book_id}`;
    
    document.getElementById('detail-genre-top').textContent = genreNames;
    document.getElementById('detail-name').textContent = book.title;
    document.getElementById('detail-author').textContent = authorNames;
    document.getElementById('detail-price').textContent = price;
    
    // Đắp Highlights
    document.getElementById('detail-highlights').innerHTML = `
        <p><strong>Thể loại:</strong> ${genreNames}</p>
        <p><strong>Ngôn ngữ:</strong> Tiếng Việt</p>
        <p><strong>Kích thước:</strong> ${size}</p>
    `;
    
    // Đắp Description
    document.getElementById('detail-description').textContent = book.description || 'Chưa có thông tin giới thiệu.';

    // Đắp Bảng Specs (Lấy đúng tên trường trong DB)
    document.getElementById('detail-spec-table').innerHTML = `
        <tr><td>Nhà xuất bản</td><td>${publisher}</td></tr>
        <tr><td>Năm xuất bản</td><td>${publishedYear}</td></tr>
        <tr><td>Số trang</td><td>${pageNumber}</td></tr>
        <tr><td>Kích thước</td><td>${size}</td></tr>
        <tr><td>Loại bìa</td><td>${coverType}</td></tr>
    `;
}

function renderBookImages(images) {
    const mainImgDiv = document.getElementById('detail-main-img');
    const thumbList = document.getElementById('detail-thumb-list');
    
    if (images && images.length > 0) {
        // Đặt ảnh chính là ảnh đầu tiên trong database
        mainImgDiv.src = images[0].img_url;
        
        // Render 4 ảnh nhỏ
        thumbList.innerHTML = '';
        images.forEach((img, index) => {
            const btn = document.createElement('button');
            btn.className = 'thumb-item';
            btn.innerHTML = `<img src="${img.img_url}" alt="Ảnh phụ ${index + 1}">`;
            
            // Đổi ảnh chính khi click ảnh nhỏ
            btn.onclick = () => {
                mainImgDiv.src = img.img_url;
            };
            thumbList.appendChild(btn);
        });
    }
}

function renderRating(averageRating, totalReviews) {
    const ratingContainer = document.querySelector('.product-rating');
    if (ratingContainer) {
        const avg = parseFloat(averageRating) || 0;
        const total = parseInt(totalReviews) || 0;
        
        const stars = generateStars(avg);
        ratingContainer.innerHTML = `
            <span class="stars">${stars}</span>
            <span class="rating-count">(${total} đánh giá)</span>
        `;
    }
}

function generateStars(rating) {
    rating = Math.round(rating * 2) / 2;
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '⭐';
        } else if (i - 0.5 <= rating) {
            stars += '⭐';
        } else {
            stars += '☆';
        }
    }
    return stars;
}// ==========================================
// LOGIC CHO GIỎ HÀNG VÀ WISHLIST TRÊN TRANG CHI TIẾT
// ==========================================

// Biến toàn cục để lưu thông tin sản phẩm đang xem
let currentProduct = {
    id: null,
    name: '',
    price: 0,
    image: 'https://via.placeholder.com/300x400?text=No+Image'
};

// 1. Hook vào hàm renderBookDetail (chạy ngầm sau khi lấy data)
const originalRenderBookDetail = renderBookDetail;
renderBookDetail = function(book) {
    originalRenderBookDetail(book);
    // Cập nhật thông tin cơ bản vào object currentProduct
    currentProduct.id = book.book_id;
    currentProduct.name = book.title;
    currentProduct.price = parseFloat(book.price) || 0;
};

// 2. Hook vào hàm renderBookImages (để lấy ảnh chính xác cho giỏ hàng)
const originalRenderBookImages = renderBookImages;
renderBookImages = function(images) {
    originalRenderBookImages(images);
    if (images && images.length > 0) {
        currentProduct.image = images[0].img_url;
    }
};

// 3. Thiết lập các nút bấm số lượng và hành động
document.addEventListener('DOMContentLoaded', () => {
    // Đợi một chút để HTML render xong (do dùng Promise ở trên)
    setTimeout(setupInteractions, 500); 
});

function setupInteractions() {
    const qtyInput = document.querySelector('.qty-input');
    const btnMinus = document.querySelector('.qty-btn:first-child'); // Nút -
    const btnPlus = document.querySelector('.qty-btn:last-child'); // Nút +
    
    const btnAddToCart = document.querySelector('.btn-primary'); // Nút Thêm vào giỏ
    const btnWishlist = document.querySelector('.btn-wishlist'); // Nút Yêu thích

    // Logic tăng giảm số lượng
    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value) || 1;
            if (qty > 1) qtyInput.value = qty - 1;
        });

        btnPlus.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value) || 1;
            qtyInput.value = qty + 1;
        });
    }

    // Nút Add to Cart
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            if (!currentProduct.id) return; // Nếu API chưa load xong thì không cho bấm
            
            const selectedQty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
            
            // Gọi hàm bên cart.js, truyền thêm số lượng
            addToCart(currentProduct, selectedQty);
        });
    }

    // Nút Wishlist
    if (btnWishlist) {
        btnWishlist.addEventListener('click', () => {
            if (!currentProduct.id) return;
            
            // Gọi hàm bên wishlist.js
            addToWishlist(currentProduct);
        });
    }
}