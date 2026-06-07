import mysql.connector
from core.config import Config

def get_db_connection():
   return mysql.connector.connect(
       host=Config.DB_HOST,
       port=Config.DB_PORT,
       user=Config.DB_USER,
       password=Config.DB_PASSWORD,
       database=Config.DB_NAME
   )

def get_db()
   db = None
    try:
        db = get_db_connection()
        yield db
    finally:
        if db is not None and db.is_connected():
            db.close()