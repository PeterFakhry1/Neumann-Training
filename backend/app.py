from flask_cors import CORS
import mysql.connector 
from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=os.getenv("MYSQL_PASSWORD"),
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

@app.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO users (fname, lname, company, address, city, county, color, photo)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            data["fname"],
            data["lname"],
            data["company"],
            data["address"],
            data["city"],
            data["county"],
            data["color"],
            data["photo"]
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "User added successfully"})

@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE users
        SET fname = %s,
            lname = %s,
            company = %s,
            address = %s,
            city = %s,
            county = %s,
            color = %s,
            photo = %s
        WHERE id = %s
        """,
        (
            data["fname"],
            data["lname"],
            data["company"],
            data["address"],
            data["city"],
            data["county"],
            data["color"],
            data["photo"],
            user_id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "User updated successfully"})

if __name__ == "__main__":
    app.run(debug=True)

