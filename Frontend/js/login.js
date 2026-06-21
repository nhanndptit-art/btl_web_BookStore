document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.khung form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    // Tạo thẻ hiển thị lỗi cho từng input
    function createErrorTag(afterEl) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#e74c3c';
        error.style.fontSize = '12px';
        error.style.margin = '-10px 0 10px';
        error.style.textAlign = 'left';
        afterEl.insertAdjacentElement('afterend', error);
        return error;
    }

    const usernameError = createErrorTag(username);
    // Mật khẩu nằm trong .password-container nên chèn lỗi sau cả container
    const passwordError = createErrorTag(password.closest('.password-container'));

    function showError(el, msg) {
        el.textContent = msg;
    }

    function clearError(el) {
        el.textContent = '';
    }

    function validateForm() {
        let isValid = true;

        // Kiểm tra tên đăng nhập hoặc email
        if (username.value.trim() === '') {
            showError(usernameError, 'Vui lòng nhập tên đăng nhập hoặc email.');
            isValid = false;
        } else {
            clearError(usernameError);
        }

        // Kiểm tra mật khẩu
        if (password.value === '') {
            showError(passwordError, 'Vui lòng nhập mật khẩu.');
            isValid = false;
        } else {
            clearError(passwordError);
        }

        return isValid;
    }

    // Validate realtime khi rời khỏi input (blur)
    [username, password].forEach(input => {
        input.addEventListener('blur', validateForm);
    });

    // Xử lý sự kiện Submit Form và gọi API
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Kích hoạt trạng thái chờ để tối ưu UX
            submitBtn.textContent = 'Đang xử lý...';
            submitBtn.disabled = true;
            clearError(passwordError); // Xóa lỗi cũ nếu có

            // Gửi dữ liệu đăng nhập lên API Backend FastAPI
            fetch('http://localhost:8000/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username_or_email: username.value.trim(),
                    password: password.value
                })
            })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    // Lấy lỗi trả về từ HTTPException của FastAPI
                    throw new Error(data.detail || 'Đăng nhập không thành công');
                }
                return data;
            })
            .then((res) => {
                // Hiển thị thông báo thành công
                alert(`Đăng nhập thành công! Chào mừng ${res.user.username}`);
                
                // ĐÃ MỞ COMMENT: Lưu user info vào localStorage để dùng cho các trang khác
                localStorage.setItem('currentUser', JSON.stringify(res.user));
                
                // Chuyển hướng về trang chủ
                window.location.href = 'index.html'; 
            })
            .catch((error) => {
                // Hiển thị lỗi (sai pass, không tồn tại user...) ngay dưới ô mật khẩu
                showError(passwordError, error.message);
            })
            .finally(() => {
                // Phục hồi lại trạng thái nút bấm
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        }
    });

    // Toggle hiện/ẩn mật khẩu khi click vào icon con mắt
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isHidden = password.type === 'password';
            password.type = isHidden ? 'text' : 'password';
            togglePassword.classList.toggle('fa-eye', !isHidden);
            togglePassword.classList.toggle('fa-eye-slash', isHidden);
        });
    }
});