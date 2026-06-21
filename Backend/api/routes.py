from fastapi import APIRouter, Depends, Query
from core.database import get_db
from services.book_svc import get_all_books_from_db, get_books_with_pagination
from services.author_svc import get_all_authors, search_authors
from services.genre_svc import get_all_genres, search_genres
from services.review_svc import get_reviews_by_book, get_average_rating_by_book, get_all_reviews
from services.book_svc import get_all_books_from_db, get_books_with_pagination, get_book_by_id, get_images_by_book
from fastapi import APIRouter, HTTPException, status
from models.user import UserLogin
from services.user_svc import authenticate_user

router = APIRouter()


@router.get("/api/books/{book_id}")
def get_book_detail(book_id: int, db = Depends(get_db)):
    """Lấy thông tin chi tiết của 1 cuốn sách"""
    try:
        book = get_book_by_id(db, book_id)
        if not book:
            return {"status": "error", "message": "Book not found"}
        return {"status": "success", "data": book}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/api/books/{book_id}/images")
def get_book_images(book_id: int, db = Depends(get_db)):
    """Lấy danh sách hình ảnh của cuốn sách"""
    try:
        images = get_images_by_book(db, book_id)
        return {"status": "success", "data": images}
    except Exception as e:
        return {"status": "error", "message": str(e)}

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


@router.get("/api/reviews/book/{book_id}")
def get_book_reviews(book_id: int, db = Depends(get_db)):
    """
    Lấy tất cả reviews của một cuốn sách
    
    Path parameters:
    - book_id: ID của cuốn sách
    """
    try:
        reviews = get_reviews_by_book(db, book_id)
        return {"status": "success", "data": reviews}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/api/reviews/rating/{book_id}")
def get_book_rating(book_id: int, db = Depends(get_db)):
    """
    Lấy đánh giá trung bình và số lượng reviews của một cuốn sách
    
    Path parameters:
    - book_id: ID của cuốn sách
    
    Returns:
    - average_rating: Đánh giá trung bình (từ 0 đến 5)
    - total_reviews: Số lượng reviews
    """
    try:
        rating_data = get_average_rating_by_book(db, book_id)
        return {"status": "success", "data": rating_data}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/api/reviews")
def get_all_books_reviews(db = Depends(get_db)):
    """
    Lấy tất cả reviews từ database
    """
    try:
        reviews = get_all_reviews(db)
        return {"status": "success", "data": reviews}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    


@router.post("/login")
def login(payload: UserLogin):
    result = authenticate_user(payload.username_or_email, payload.password)
    
    if not result["success"]:
        # Trả về status code 401 kèm thông điệp lỗi cụ thể từ tầng service
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result["message"]
        )
        
    return {"message": "Đăng nhập thành công", "user": result["user"]}