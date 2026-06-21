function loadComponent(elementId, filePath) {
    // Trả về promise để có thể bắt sự kiện sau khi load xong
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không thể tải ${filePath}`);
            }
            return response.text(); 
        })
        .then(htmlData => { 
            document.getElementById(elementId).innerHTML = htmlData;
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    // Load footer bình thường
    loadComponent("footer-placeholder", "footer.html");

    // Load header và xử lý logic đổi link icon sau khi load xong
    loadComponent("header-placeholder", "header.html").then(() => {
        // Tìm thẻ a chứa icon user (có href mặc định là login.html)
        const userIconLink = document.querySelector('.header-action[href="login.html"]');
        
        if (userIconLink) {
            // Kiểm tra trạng thái đăng nhập trong localStorage
            const currentUser = localStorage.getItem("currentUser");
            
            if (currentUser) {
                // Đã đăng nhập: Chuyển hướng sang trang tài khoản
                userIconLink.setAttribute("href", "account.html");
            } else {
                // Chưa đăng nhập: Giữ nguyên hướng sang trang đăng nhập
                userIconLink.setAttribute("href", "login.html");
            }
        }
    });
});