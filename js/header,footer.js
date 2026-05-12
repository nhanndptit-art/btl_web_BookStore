function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            // Kiểm tra xem file có tồn tại không (status 200)
            if (!response.ok) {
                throw new Error(`Không thể tải ${filePath}`);
            }
            // Chuyển đổi dữ liệu trả về thành dạng text (chuỗi HTML)
            return response.text(); 
        })
        .then(htmlData => { //arow function
            // Chèn chuỗi HTML vừa lấy được vào phần tử có ID tương ứng
            document.getElementById(elementId).innerHTML = htmlData;
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

// Chạy hàm khi cấu trúc HTML (DOM) của trang chính đã load xong
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header-placeholder", "header.html");
    loadComponent("footer-placeholder", "footer.html");
});