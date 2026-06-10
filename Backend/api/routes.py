from fastapi import APIRouter, Depends, Query
from core.database import get_db
from services.book_svc import get_all_books_from_db, get_books_with_pagination

router = APIRouter()

@router.get("/api/books")
def get_books(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100), db = Depends(get_db)):
    """
    Lấy danh sách books với pagination
    
    Query parameters:
    - page: Trang cần lấy (mặc định 1)
    - limit: Số sản phẩm trên 1 trang (mặc định 20, max 100)
    """
    try:
        # Gọi hàm lấy dữ liệu từ tầng service với pagination
        data = get_books_with_pagination(db, page=page, limit=limit)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}