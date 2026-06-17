def get_reviews_by_book(db_connection, book_id):
    """
    Lấy tất cả reviews của một cuốn sách
    
    Args:
        db_connection: Database connection
        book_id: ID của cuốn sách
    
    Returns:
        List các reviews của cuốn sách
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                review_id,
                usr_id,
                book_id,
                rating_value,
                comment,
                created_at
            FROM review
            WHERE book_id = %s
            ORDER BY created_at DESC
        """
        
        cursor.execute(query, (book_id,))
        reviews = cursor.fetchall()
        cursor.close()
        
        return reviews
    except Exception as e:
        raise Exception(f"Error fetching reviews: {str(e)}")


def get_average_rating_by_book(db_connection, book_id):
    """
    Lấy đánh giá trung bình và số lượng reviews của một cuốn sách
    
    Args:
        db_connection: Database connection
        book_id: ID của cuốn sách
    
    Returns:
        Dict với keys: 'average_rating', 'total_reviews'
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                ROUND(AVG(rating_value), 1) as average_rating,
                COUNT(*) as total_reviews
            FROM review
            WHERE book_id = %s
        """
        
        cursor.execute(query, (book_id,))
        result = cursor.fetchone()
        cursor.close()
        
        if result and result['average_rating'] is not None:
            return {
                'average_rating': float(result['average_rating']),
                'total_reviews': int(result['total_reviews'])
            }
        else:
            return {
                'average_rating': 0,
                'total_reviews': 0
            }
    except Exception as e:
        raise Exception(f"Error calculating average rating: {str(e)}")


def get_all_reviews(db_connection):
    """
    Lấy tất cả reviews từ database
    
    Returns:
        List tất cả reviews
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                review_id,
                usr_id,
                book_id,
                rating_value,
                comment,
                created_at
            FROM review
            ORDER BY created_at DESC
        """
        
        cursor.execute(query)
        reviews = cursor.fetchall()
        cursor.close()
        
        return reviews
    except Exception as e:
        raise Exception(f"Error fetching all reviews: {str(e)}")
