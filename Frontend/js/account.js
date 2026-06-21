document.addEventListener("DOMContentLoaded", () => {
    // 1. Kéo dữ liệu từ LocalStorage
    const userData = localStorage.getItem("currentUser");

    // 2. Bảo vệ trang (Nếu chưa đăng nhập thì đuổi về trang login)
    if (!userData) {
        window.location.href = "login.html";
        return; 
    }

    // 3. Giải mã dữ liệu JSON thành object
    const user = JSON.parse(userData);

    // 4. Gắn dữ liệu vào các thẻ tương ứng trên giao diện (Khớp chuẩn xác với các key trả về trong ảnh)
    document.getElementById("acc-id").textContent = user.id || "N/A";
    document.getElementById("acc-username").textContent = user.username || "Chưa cập nhật";
    document.getElementById("acc-email").textContent = user.email || "Chưa cập nhật";
    document.getElementById("acc-phone").textContent = user.phone || "Chưa cập nhật";
    
    // Xử lý làm đẹp cho trường Role (ví dụ admin -> Quản trị viên)
    if (user.role === "admin") {
        document.getElementById("acc-role").textContent = "Quản trị viên";
    } else {
        document.getElementById("acc-role").textContent = "Khách hàng";
    }

    // Xử lý làm đẹp cho chuỗi thời gian (cắt bớt phần giờ phút giây nếu chỉ muốn hiện ngày)
    // Dữ liệu gốc: "2026-06-07 16:27:08" -> Lấy phần "2026-06-07"
    if (user.created_at) {
        document.getElementById("acc-created").textContent = user.created_at.split(" ")[0];
    } else {
        document.getElementById("acc-created").textContent = "Chưa cập nhật";
    }

    // 5. Lắng nghe sự kiện click cho nút Đăng xuất
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // Xác nhận trước khi thoát
            const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất?");
            if (confirmLogout) {
                // Xóa sạch dấu vết trong bộ nhớ
                localStorage.removeItem("currentUser");
                // Chuyển hướng về lại trang đăng nhập (hoặc trang chủ)
                window.location.href = "login.html";
            }
        });
    }
});