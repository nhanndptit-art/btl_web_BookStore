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
}