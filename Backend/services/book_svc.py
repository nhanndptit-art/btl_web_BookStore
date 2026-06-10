import mysql.connector

def get_books_with_pagination(db_connection, page=1, limit=20):
    """
    Lấy danh sách books với pagination, kèm theo tên tác giả
    
    Args:
        db_connection: Database connection
        page: Trang cần lấy (mặc định 1)
        limit: Số sản phẩm trên 1 trang (mặc định 20)
    
    Returns:
        Dict với keys: 'books', 'total', 'page', 'limit', 'total_pages'
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        # Tính offset
        offset = (page - 1) * limit
        
        # Query lấy danh sách books với authors
        query = """
            SELECT 
                b.book_id,
                b.book_code,
                b.title,
                b.description,
                b.cover_img,
                b.published_date,
                b.price,
                GROUP_CONCAT(a.author_name SEPARATOR ', ') as author_names,
                GROUP_CONCAT(a.author_id SEPARATOR ',') as author_ids
            FROM books b
            LEFT JOIN books_authors ba ON b.book_id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.author_id
            GROUP BY b.book_id
            ORDER BY b.book_id DESC
            LIMIT %s OFFSET %s
        """
        
        cursor.execute(query, (limit, offset))
        books = cursor.fetchall()
        
        # Query lấy tổng số books
        count_query = "SELECT COUNT(DISTINCT b.book_id) as total FROM books b"
        cursor.execute(count_query)
        total_result = cursor.fetchone()
        total = total_result['total'] if total_result else 0
        
        cursor.close()
        
        # Tính tổng số trang
        total_pages = (total + limit - 1) // limit
        
        return {
            'books': books,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': total_pages
        }
    except Exception as e:
        raise Exception(f"Error fetching books: {str(e)}")


def get_all_books_from_db(db_connection):
    """Legacy function - giữ lại cho compatibility"""
    cursor = db_connection.cursor(dictionary=True)
    
    query = "SELECT * FROM books"
    cursor.execute(query)
    
    books = cursor.fetchall()
    
    cursor.close()
    return books