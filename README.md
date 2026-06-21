# 📚 StoreHau - Website Bookstore (E-Commerce)
*Dự án Bài tập lớn môn JavaScript - Học viện Công nghệ Bưu chính Viễn thông (PTIT)*

## 📝 Giới thiệu dự án
**StoreHau** là một nền tảng website thương mại điện tử chuyên bán sách, được xây dựng với mục tiêu mang lại trải nghiệm mua sắm mượt mà, giao diện trực quan và hiệu năng cao. Dự án tập trung vào việc áp dụng sức mạnh của **Vanilla JavaScript** (không sử dụng thư viện UI của bên thứ 3) kết hợp với Backend RESTful API mạnh mẽ.

## 🧑‍💻 Đội ngũ phát triển
Dự án được phát triển bởi nhóm sinh viên:
* **Nông Đức Nhân** (B25DCCC163) - Frontend (Product Grid, Product Detail, Xử lý API)
* **Vi Quang Huy** (B25DCCC084) - Frontend (Header/Footer, Blog, Contact, Wishlist)
* **Phạm Thanh Mai** (B25DCCC136) - Frontend (Hero Banner, Authentication UI)

## 🛠️ Công nghệ sử dụng
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (DOM Manipulation, Fetch API, LocalStorage).
* **Backend:** Python, FastAPI (Xử lý bất đồng bộ, RESTful API).
* **Database:** Triển khai thực tế trên nền tảng đám mây **Aiven Cloud Database**.

## ✨ Tính năng nổi bật
### Phía Client (Frontend)
- **Quản lý Giỏ hàng (Cart):** Xử lý hoàn toàn ở phía trình duyệt bằng `localStorage`. Hỗ trợ thêm/bớt số lượng, tính tổng tiền, thuế VAT và mô phỏng luồng thanh toán (Checkout) theo thời gian thực.
- **Lọc và Phân trang (Filter & Pagination):** Lọc sách theo danh mục, tác giả bằng cấu trúc `Set()` và cập nhật tham số truy vấn (URL Query Parameters) động.
- **Xác thực biểu mẫu (Form Validation):** Kiểm tra dữ liệu real-time ở form Đăng nhập/Đăng ký, tự động tạo và chèn các thẻ báo lỗi trực quan vào DOM.
- **UI/UX Tối ưu:** Tự phát triển component Toast Notification, trạng thái Loading Spinner, và tái sử dụng component (Header/Footer) qua `Fetch API`.

### Phía Server (Backend)
- Hệ thống RESTful API chuẩn hóa định dạng JSON.
- Xử lý mượt mà các truy vấn phức tạp (lấy danh sách, đánh giá, hình ảnh).
- Tự động sinh tài liệu API bằng Swagger UI.
