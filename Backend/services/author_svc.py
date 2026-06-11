"""
Service layer for Author operations
"""

def get_all_authors(db_connection):
    """
    Lấy tất cả tác giả từ database
    
    Returns:
        List of dicts với keys: author_id, author_name, bio
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT author_id, author_name, bio
            FROM authors
            ORDER BY author_name ASC
        """
        cursor.execute(query)
        authors = cursor.fetchall()
        cursor.close()
        
        return authors
    except Exception as e:
        raise Exception(f"Error fetching authors: {str(e)}")


def search_authors(db_connection, search_term):
    """
    Tìm kiếm tác giả theo tên
    
    Args:
        db_connection: Database connection
        search_term: Từ khóa tìm kiếm
        
    Returns:
        List of dicts với keys: author_id, author_name, bio
    """
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        query = """
            SELECT author_id, author_name, bio
            FROM authors
            WHERE author_name LIKE %s
            ORDER BY author_name ASC
        """
        cursor.execute(query, (f"%{search_term}%",))
        authors = cursor.fetchall()
        cursor.close()
        
        return authors
    except Exception as e:
        raise Exception(f"Error searching authors: {str(e)}")
