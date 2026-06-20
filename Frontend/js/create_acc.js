document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy các phần tử DOM
    const form = document.querySelector('.form-container form');
    const fullName = document.querySelector('input[name="name_acc"]');
    const email = document.querySelector('input[name="email_acc"]');
    const password = document.querySelector('input[name="password_acc"]');
    const confirmPassword = document.querySelector('input[name="confirm_password_acc"]');
    const genderRadios = document.querySelectorAll('input[name="r1"]');
    const country = document.querySelector('.country');
    const checkTerms = document.querySelector('.check-btn');

    // 2. KHAI BÁO MẢNG INPUTS TẠI ĐÂY (Đã sửa vị trí để tránh lỗi)
    const inputs = [fullName, email, password, confirmPassword];

    // Tạo các thẻ hiển thị lỗi cho từng input
    function checkErrorTag(input) {
        if (!input) return null;
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
        if (el) el.textContent = msg;
    }

    function clearError(el) {
        if (el) el.textContent = '';
    }

    function checkEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // Hàm validate một input cụ thể (Dùng cho sự kiện blur)
    function validateField(input) {
        if (input === fullName) {
            if (fullName.value.trim() === '') {
                showError(fullNameError, 'Vui lòng nhập họ và tên.');
                return false;
            } else {
                clearError(fullNameError);
            }
        }

        if (input === email) {
            if (email.value.trim() === '') {
                showError(emailError, 'Vui lòng nhập email.');
                return false;
            } else if (!checkEmail(email.value.trim())) {
                showError(emailError, 'Email không hợp lệ.');
                return false;
            } else {
                clearError(emailError);
            }
        }

        if (input === password) {
            if (password.value.length < 8) {
                showError(passwordError, 'Mật khẩu phải chứa ít nhất 8 ký tự.');
                return false;
            } else {
                clearError(passwordError);
            }
        }

        if (input === confirmPassword) {
            if (confirmPassword.value !== password.value || confirmPassword.value === '') {
                showError(confirmPasswordError, 'Xác nhận mật khẩu không đúng.');
                return false;
            } else {
                clearError(confirmPasswordError);
            }
        }
        return true;
    }

    // Hàm validate toàn bộ form (Dùng khi submit)
    function validateForm() {
        let isValid = true;

        for (const input of inputs) {
            if (!validateField(input)) {
                isValid = false; 
            }
        }

        // Quốc gia
        if (country.selectedIndex === 0) {
            console.log('Vui lòng chọn quốc gia.');
            isValid = false;
        }

        // Điều khoản
        if (!checkTerms.checked) {
            console.log('Bạn cần đồng ý với điều khoản và điều kiện.');
            isValid = false;
        }

        return isValid;
    }

    for (const input of inputs) {
        input.addEventListener('blur', () => {
            validateField(input); 
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Tạo tài khoản thành công!');
            form.reset();
        }
    });

    const passwordIcons = document.querySelectorAll('.toggle-password');
    for (const icon of passwordIcons) {
        icon.addEventListener('click', () => {
            const input = icon.closest('.input-name').querySelector('input');
            if (!input) return;

            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !isHidden);
            icon.classList.toggle('fa-eye-slash', isHidden);
        });
    }
});