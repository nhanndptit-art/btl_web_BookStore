document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container form');
    const fullName = document.querySelector('input[name="name_acc"]');
    const email = document.querySelector('input[name="email_acc"]');
    const password = document.querySelector('input[name="password_acc"]');
    const confirmPassword = document.querySelector('input[name="confirm_password_acc"]');
    const genderRadios = document.querySelectorAll('input[name="r1"]');
    const country = document.querySelector('.country');
    const checkTerms = document.querySelector('.check-btn');

    // Tạo các thẻ hiển thị lỗi cho từng input
    function checkErrorTag(input) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#e74c3c';
        error.style.fontSize = '12px';
        error.style.marginTop = '4px';
        input.closest('.input-name').appendChild(error);
        return error;
    }

    const fullNameError = checkErrorTag(fullName);
    const emailError = checkErrorTag(email);
    const passwordError = checkErrorTag(password);
    const confirmPasswordError = checkErrorTag(confirmPassword);

    function showError(el, msg) {
        el.textContent = msg;
    }

    function clearError(el) {
        el.textContent = '';
    }

    function checkEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateForm() {
        let isValid = true;

        // Họ và tên
        if (fullName.value.trim() === '') {
            showError(fullNameError, 'Vui lòng nhập họ và tên.');
            isValid = false;
        } else {
            clearError(fullNameError);
        }

        // Email
        if (email.value.trim() === '') {
            showError(emailError, 'Vui lòng nhập email.');
            isValid = false;
        } else if (!checkEmail(email.value.trim())) {
            showError(emailError, 'Email không hợp lệ.');
            isValid = false;
        } else {
            clearError(emailError);
        }

        // Mật khẩu
        if (password.value.length < 8) {
            showError(passwordError, 'Mật khẩu phải chứa ít nhất 8 ký tự.');
            isValid = false;
        } else {
            clearError(passwordError);
        }

        // Xác nhận mật khẩu
        if (confirmPassword.value !== password.value || confirmPassword.value === '') {
            showError(confirmPasswordError, 'Xác nhận mật khẩu không đúng.');
            isValid = false;
        } else {
            clearError(confirmPasswordError);
        }

        // Quốc gia
        if (country.selectedIndex === 0) {
            alert('Vui lòng chọn quốc gia.');
            isValid = false;
        }

        // Điều khoản
        if (!checkTerms.checked) {
            alert('Bạn cần đồng ý với điều khoản và điều kiện.');
            isValid = false;
        }

        return isValid;
    }

    // Validate realtime khi rời khỏi input (blur)
    [fullName, email, password, confirmPassword].forEach(input => {
        input.addEventListener('blur', validateForm);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            // TODO: thay đoạn này bằng gọi API đăng ký thực tế
            alert('Tạo tài khoản thành công!');
            form.reset();
        }
    });

    // Toggle hiện/ẩn mật khẩu khi click vào icon con mắt (.toggle-password)
    // Vị trí, màu, cursor của icon đã được định nghĩa trong CSS (.input-name .toggle-password)
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.closest('.input-name').querySelector('input[type="password"], input[type="text"].text-name');
            if (!input) return;

            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !isHidden);
            icon.classList.toggle('fa-eye-slash', isHidden);
        });
    });
});