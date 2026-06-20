import mysql.connector

def get_books_with_pagination(db_connection, page=1, limit=20, author_ids=None, genre_ids=None):
    """
    Lấy danh sách books với pagination, kèm theo tên tác giả và thể loại, có filter
    
    Args:
        db_connection: Database connection
        page: Trang cần lấy (mặc định 1)
        limit: Số sản phẩm trên 1 trang (mặc định 20)
        author_ids: List các author_id để filter (OR logic - nếu có nhiều)
        genre_ids: List các genre_id để filter (OR logic - nếu có nhiều)
    
    Returns:
        Dict với keys: 'books', 'total', 'page', 'limit', 'total_pages'
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        # Tính offset
        offset = (page - 1) * limit
        
        # Build WHERE clause cho filter
        where_clauses = []
        params = []
        
        # Filter by authors (OR logic)
        if author_ids and len(author_ids) > 0:
            placeholders = ','.join(['%s'] * len(author_ids))
            where_clauses.append(f"ba.author_id IN ({placeholders})")
            params.extend(author_ids)
        
        # Filter by genres (OR logic)
        if genre_ids and len(genre_ids) > 0:
            placeholders = ','.join(['%s'] * len(genre_ids))
            where_clauses.append(f"bg.genre_id IN ({placeholders})")
            params.extend(genre_ids)
        
        # Combine WHERE clauses with AND
        where_clause = ""
        if where_clauses:
            where_clause = "WHERE " + " AND ".join(where_clauses)
        
        # Query lấy danh sách books với authors và genres
        query = f"""
            SELECT 
                b.book_id,
                b.book_code,
                b.title,
                b.description,
                b.cover_img,
                b.published_date,
                b.price,
                GROUP_CONCAT(DISTINCT a.author_name SEPARATOR ', ') as author_names,
                GROUP_CONCAT(DISTINCT a.author_id SEPARATOR ',') as author_ids,
                GROUP_CONCAT(DISTINCT g.genre_name SEPARATOR ', ') as genre_names,
                GROUP_CONCAT(DISTINCT g.genre_id SEPARATOR ',') as genre_ids
            FROM books b
            LEFT JOIN books_authors ba ON b.book_id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.author_id
            LEFT JOIN books_genres bg ON b.book_id = bg.book_id
            LEFT JOIN genres g ON bg.genre_id = g.genre_id
            {where_clause}
            GROUP BY b.book_id
            ORDER BY b.book_id DESC
            LIMIT %s OFFSET %s
        """
        
        params.extend([limit, offset])
        cursor.execute(query, params)
        books = cursor.fetchall()
        
        # Query lấy tổng số books (với filter)
        count_query = f"""
            SELECT COUNT(DISTINCT b.book_id) as total 
            FROM books b
            LEFT JOIN books_authors ba ON b.book_id = ba.book_id
            LEFT JOIN books_genres bg ON b.book_id = bg.book_id
            {where_clause}
        """
        
        count_params = params[:-2]  # Remove LIMIT and OFFSET
        cursor.execute(count_query, count_params)
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
def get_book_by_id(db_connection, book_id):
    """Lấy chi tiết 1 cuốn sách theo ID kèm tất cả thông số kỹ thuật mới"""
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                b.book_id,
                b.book_code,
                b.title,
                b.description,
                b.cover_img,
                b.published_date,
                b.price,
                b.publisher,
                b.page_number,
                b.cover_type,
                b.size,
                GROUP_CONCAT(DISTINCT a.author_name SEPARATOR ', ') as author_names,
                GROUP_CONCAT(DISTINCT a.author_id SEPARATOR ',') as author_ids,
                GROUP_CONCAT(DISTINCT g.genre_name SEPARATOR ', ') as genre_names,
                GROUP_CONCAT(DISTINCT g.genre_id SEPARATOR ',') as genre_ids
            FROM books b
            LEFT JOIN books_authors ba ON b.book_id = ba.book_id
            LEFT JOIN authors a ON ba.author_id = a.author_id
            LEFT JOIN books_genres bg ON b.book_id = bg.book_id
            LEFT JOIN genres g ON bg.genre_id = g.genre_id
            WHERE b.book_id = %s
            GROUP BY b.book_id
        """
        
        cursor.execute(query, (book_id,))
        book = cursor.fetchone()
        cursor.close()
        
        return book
    except Exception as e:
        raise Exception(f"Error fetching book by ID: {str(e)}")

def get_images_by_book(db_connection, book_id):
    """Lấy danh sách 4 ảnh của sách từ bảng books_img"""
    try:
        cursor = db_connection.cursor(dictionary=True)
        query = """
            SELECT img_id, book_id, img_url
            FROM books_img
            WHERE book_id = %s
        """
        cursor.execute(query, (book_id,))
        images = cursor.fetchall()
        cursor.close()
        
        return images
    except Exception as e:
        print(f"Lỗi khi query books_img: {str(e)}")
        return []