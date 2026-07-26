from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector 

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="YOUR_MYSQL_PASSWORD", #Use your own pass here
        database="neumann_training"
    )

@app.route("/")
def home():
    return "Backend is working"

@app.route("/users")
def get_users():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(users)


@app.route("/users/<int:user_id>", methods=["Delete"])
def delete_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "User deleted successfully"}) 

if __name__ == "__main__":
    app.run(debug=True)

