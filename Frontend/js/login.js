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

        // Tên đăng nhập hoặc email
        if (username.value.trim() === '') {
            showError(usernameError, 'Vui lòng nhập tên đăng nhập hoặc email.');
            isValid = false;
        } else {
            clearError(usernameError);
        }

        // Mật khẩu
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            // TODO: thay đoạn này bằng gọi API đăng nhập thực tế
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