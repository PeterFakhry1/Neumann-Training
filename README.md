# Neumann Training Project

This is a full-stack employee directory web application.

The project contains a frontend interface, a Python Flask backend, and a MySQL database.

## Technologies Used

- HTML
- CSS
- JavaScript
- jQuery
- AJAX
- Python
- Flask
- MySQL

## Features

- Loading screen
- Login page
- User cards
- User details panel
- Company filter
- Show more / show less
- Add user
- Edit user
- Delete user
- Backend API using Flask
- Database using MySQL

## Database Setup

Open MySQL Workbench and run the file:

```text
database.sql
```

This will create the database, create the `users` table, and insert the default users.

The database name is:

```text
neumann_training
```

## Backend Setup

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Create a file named `.env` in the main project folder.

Inside `.env`, add your MySQL password:

```text
MYSQL_PASSWORD=your_mysql_password
```

Open `backend/app.py` and make sure the password is read from the environment variable:

```python
password=os.getenv("MYSQL_PASSWORD")
```

Run the backend:

```bash
python backend/app.py
```


The backend runs on:

```text
http://127.0.0.1:5000
```

To test the backend, open:

```text
http://127.0.0.1:5000/users
```

It should show the users as JSON data.

## Frontend Setup

Open `index.html` using Live Server.

Make sure the backend is running before using the frontend.

The frontend sends AJAX requests to the Flask backend.

## Login

Use the following login credentials:

```text
Username: admin
Password: admin
```

## Notes

- The `users.json` file was used during the first frontend phase.
- The final version uses MySQL through the Flask backend.
- The `database.sql` file is included so the database can be recreated on another computer.
- The `venv/` folder is not uploaded to GitHub.
- Each person running the project must use their own MySQL password.