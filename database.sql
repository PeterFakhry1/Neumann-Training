CREATE DATABASE IF NOT EXISTS neumann_training;

USE neumann_training;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(100),
    lname VARCHAR(100),
    company VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    county VARCHAR(100),
    color VARCHAR(20),
    photo VARCHAR(255)
);

INSERT INTO users (fname, lname, company, address, city, county, color, photo)
VALUES
('James', 'Butt', 'Benton', '6649 N Blue Gum St', 'New Orleans', 'Orleans', '#8bc447', 'images/default-user.png'),
('Josephine', 'Darakjy', 'Chanay', '4 B Blue Ridge Blvd', 'Brighton', 'Livingston', '#8a3b93', 'images/default-user.png'),
('Art', 'Venere', 'Chemel', '8 W Cerritos Ave', 'Bridgeport', 'Gloucester', '#1473bb', 'images/default-user.png'),
('Lenna', 'Paprocki', 'Feltz Printing', '639 Main St', 'Anchorage', 'Anchorage', '#c32482', 'images/default-user.png'),
('Donette', 'Foller', 'Commercial Press', '34 Center St', 'Hamilton', 'Butler', '#dde553', 'images/default-user.png'),
('Simona', 'Morasca', 'Benton', '3 Mcauley Dr', 'Ashland', 'Ashland', '#8bc447', 'images/default-user.png'),
('Mitsue', 'Tollner', 'Chanay', '7 Eads St', 'Chicago', 'Cook', '#8a3b93', 'images/default-user.png'),
('Leota', 'Dilliard', 'Chemel', '7 W Jackson Blvd', 'San Jose', 'Santa Clara', '#1473bb', 'images/default-user.png'),
('Sage', 'Wieser', 'Feltz Printing', '5 Boston Ave', 'Sioux Falls', 'Minnehaha', '#c32482', 'images/default-user.png'),
('Kris', 'Marrier', 'Commercial Press', '228 Runamuck Pl', 'Baltimore', 'Baltimore City', '#dde553', 'images/default-user.png'),
('Minna', 'Amigon', 'Benton', '2371 Jerrold Ave', 'Kulpsville', 'Montgomery', '#8bc447', 'images/default-user.png'),
('Abel', 'Maclead', 'Chanay', '37275 St  Rt 17m M', 'Middle Island', 'Suffolk', '#8a3b93', 'images/default-user.png'),
('Kiley', 'Caldarera', 'Chemel', '25 E 75th St', 'Los Angeles', 'Los Angeles', '#1473bb', 'images/default-user.png'),
('Bette', 'Ruta', 'Feltz Printing', '98 Connecticut Ave Nw', 'Chagrin Falls', 'Geauga', '#c32482', 'images/default-user.png'),
('Veronika', 'Albares', 'Commercial Press', '56 E Morehead St', 'Laredo', 'Webb', '#dde553', 'images/default-user.png');

SELECT * FROM users;