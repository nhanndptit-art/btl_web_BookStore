from fastapi import APIRouter, Depends, Query
from core.database import get_db
from services.book_svc import get_all_books_from_db, get_books_with_pagination
from services.author_svc import get_all_authors, search_authors
from services.genre_svc import get_all_genres, search_genres

router = APIRouter()

@router.get("/api/books")
def get_books(
    page: int = Query(1, ge=1), 
    limit: int = Query(20, ge=1, le=100),
    author_ids: str = Query(None),
    genre_ids: str = Query(None),
    db = Depends(get_db)
):
    """
    Lấy danh sách books với pagination và filter
    
    Query parameters:
    - page: Trang cần lấy (mặc định 1)
    - limit: Số sản phẩm trên 1 trang (mặc định 20, max 100)
    - author_ids: Danh sách author_id cách nhau bởi dấu phẩy (VD: "1,2,3") - OR logic
    - genre_ids: Danh sách genre_id cách nhau bởi dấu phẩy (VD: "1,2,3") - OR logic
    """
    try:
        # Parse author_ids
        author_ids_list = None
        if author_ids:
            try:
                author_ids_list = [int(id.strip()) for id in author_ids.split(',') if id.strip()]
            except ValueError:
                pass
        
        # Parse genre_ids
        genre_ids_list = None
        if genre_ids:
            try:
                genre_ids_list = [int(id.strip()) for id in genre_ids.split(',') if id.strip()]
            except ValueError:
                pass
        
        # Gọi hàm lấy dữ liệu từ tầng service với pagination và filter
        data = get_books_with_pagination(db, page=page, limit=limit, author_ids=author_ids_list, genre_ids=genre_ids_list)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/api/authors")
def get_authors(search: str = Query(None), db = Depends(get_db)):
    """
    Lấy danh sách tác giả
    
    Query parameters:
    - search: Từ khóa tìm kiếm theo tên (tùy chọn)
    """
    try:
        if search:
            data = search_authors(db, search)
        else:
            data = get_all_authors(db)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/api/genres")
def get_genres(search: str = Query(None), db = Depends(get_db)):
    """
    Lấy danh sách thể loại
    
    Query parameters:
    - search: Từ khóa tìm kiếm theo tên (tùy chọn)
    """
    try:
        if search:
            data = search_genres(db, search)
        else:
            data = get_all_genres(db)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}