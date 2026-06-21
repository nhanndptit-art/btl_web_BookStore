document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.khung form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    if (!form || !username || !password) return;

    // Tạo thẻ hiển thị lỗi cho từng input
    function createErrorTag(input) {
        if (!input) return null;
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#e74c3c';
        error.style.fontSize = '12px';
        error.style.margin = '-10px 0 10px';
        error.style.textAlign = 'left';
        input.insertAdjacentElement('afterend', error);
        return error;
    }

    const usernameError = createErrorTag(username);
    
    const passwordContainer = password.closest('.password-container') || password;
    const passwordError = createErrorTag(passwordContainer);

    function showError(el, msg) {
        if (el) el.textContent = msg;
    }

    function clearError(el) {
        if (el) el.textContent = '';
    }

    // Giữ lại validateField của nhánh Mai/login để phục vụ cho sự kiện blur
    function validateField(input) {
        if (input === username) {
            if (username.value.trim() === '') {
                showError(usernameError, 'Vui lòng nhập tên đăng nhập hoặc email.');
                return false;
            } else {
                clearError(usernameError);
            }
        }

        if (input === password) {
            if (password.value === '') {
                showError(passwordError, 'Vui lòng nhập mật khẩu.');
                return false;
            } else {
                clearError(passwordError);
            }
        }
        return true;
    }

    // Hàm validate toàn bộ form khi submit
    function validateForm() {
        let isValid = true;
        const inputs = [username, password];

        for (const input of inputs) {
            if (!validateField(input)) {
                isValid = false;
            }
        }
        return isValid;
    }

    const inputs = [username, password];
    for (const input of inputs) {
        input.addEventListener('blur', () => {
            validateField(input); // Chỉ validate riêng ô vừa rời khỏi, không ảnh hưởng ô khác
        });
    }

    // Xử lý sự kiện Submit Form và gọi API
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Giữ lại logic gọi API của nhánh main
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
                
                // Lưu user info vào localStorage để dùng cho các trang khác
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