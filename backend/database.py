 import mysql.connector 
import os 
def get_db_connection(): 
connection = mysql.connector.connect( host=os.environ.get("DB_HOST"),
 user=os.environ.get("DB_USER"), 
password=os.environ.get("DB_PASSWORD"),
 database=os.environ.get("DB_NAME"), port=int(os.environ.get("DB_PORT", 3306)) )
 return connection if __name__ == "__main__":
 try: connection = get_db_connection()
 if connection.is_connected():
 print("MySQL connection successful!") connection.close()
 except mysql.connector.Error as error: print("MySQL connection failed:") print(error)