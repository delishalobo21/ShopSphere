import mysql.connector


def get_db_connection():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="shopsphere"
    )

    return connection


if __name__ == "__main__":

    try:

        connection = get_db_connection()

        if connection.is_connected():
            print("MySQL connection successful!")

        connection.close()

    except mysql.connector.Error as error:

        print("MySQL connection failed:")
        print(error)