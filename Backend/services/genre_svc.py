"""
Service layer for Genre operations
"""

def get_all_genres(db_connection):
    """
    Lấy tất cả thể loại từ database
    
    Returns:
        List of dicts với keys: genre_id, genre_name
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT genre_id, genre_name
            FROM genres
            ORDER BY genre_name ASC
        """
        cursor.execute(query)
        genres = cursor.fetchall()
        cursor.close()
        
        return genres
    except Exception as e:
        raise Exception(f"Error fetching genres: {str(e)}")


def search_genres(db_connection, search_term):
    """
    Tìm kiếm thể loại theo tên
    
    Args:
        db_connection: Database connection
        search_term: Từ khóa tìm kiếm
        
    Returns:
        List of dicts với keys: genre_id, genre_name
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT genre_id, genre_name
            FROM genres
            WHERE genre_name LIKE %s
            ORDER BY genre_name ASC
        """
        cursor.execute(query, (f"%{search_term}%",))
        genres = cursor.fetchall()
        cursor.close()
        
        return genres
    except Exception as e:
        raise Exception(f"Error searching genres: {str(e)}")
