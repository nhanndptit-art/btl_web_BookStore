from passlib.context import CryptContext
from core.database import get_db_connection 

# Khởi tạo bộ kiểm tra mã băm Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def authenticate_user(username_or_email: str, password_raw: str):
    conn = get_db_connection()
    if not conn:
        return {"success": False, "message": "Không thể kết nối cơ sở dữ liệu"}
    
    # Sử dụng dictionary=True để kết quả trả về là một dict với key là tên cột
    cursor = conn.cursor(dictionary=True)
    try:
        # Đã cập nhật thành cột `email` và `usr_name` theo đúng cấu trúc bảng
        query = "SELECT * FROM usr WHERE usr_name = %s OR email = %s"
        cursor.execute(query, (username_or_email, username_or_email))
        user = cursor.fetchone()
        
        if not user:
            return {"success": False, "message": "Tài khoản hoặc email không tồn tại"}
        
        # Đã lấy đúng tên cột `password_hash`
        hashed_password = user.get("password_hash") 
        
        # So khớp mật khẩu text thô với mã băm Bcrypt
        if not pwd_context.verify(password_raw, hashed_password):
            return {"success": False, "message": "Mật khẩu không chính xác"}
        
        # Đăng nhập thành công, trả về các thông tin cần thiết cho Frontend
        # ĐÃ SỬA: Bổ sung thêm phone và created_at
        return {
            "success": True, 
            "user": {
                "id": user.get("usr_id"), 
                "username": user.get("usr_name"),
                "email": user.get("email"),
                "role": user.get("role"),
                "phone": user.get("phone"), # Thêm trường số điện thoại
                # Ép kiểu created_at về chuỗi (string) để tránh lỗi JSON không dịch được kiểu Datetime của MySQL
                "created_at": str(user.get("created_at")) if user.get("created_at") else None 
            }
        }
    except Exception as e:
        return {"success": False, "message": f"Lỗi xử lý hệ thống: {str(e)}"}
    finally:
        cursor.close()
        conn.close()