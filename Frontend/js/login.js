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

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            alert('Đăng nhập thành công!');
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