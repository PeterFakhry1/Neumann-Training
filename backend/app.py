from flask_cors import CORS
import mysql.connector 
from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash


load_dotenv()

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "images", "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

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

@app.route("/upload", methods=["POST"])
def upload_image():
    if "photo" not in request.files:
        return jsonify({"error": "No photo uploaded"}), 400

    photo = request.files["photo"]

    if photo.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if photo and allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        photo.save(save_path)

        image_path = f"images/uploads/{filename}"

        return jsonify({"photo": image_path})

    return jsonify({"error": "Invalid file type"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data["username"]
    password = data["password"]

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM admins WHERE username = %s",
        (username,)
    )

    admin = cursor.fetchone()

    cursor.close()
    connection.close()

    if admin and check_password_hash(admin["password_hash"], password):
        return jsonify({"message": "Login successful"})

    return jsonify({"message": "Invalid username or password"}), 401


if __name__ == "__main__":
    app.run(debug=True)

