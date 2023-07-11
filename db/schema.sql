DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

-- DEPARTMENT TABLE CREATION
CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL
);

-- ROLE TABLE CREATION
CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255),
salary DECIMAL(10,2),
department_id INT,
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE SET NULL
);

-- EMPLOYEE TABLE CREATION
CREATE TABLE employees (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
role_id INT
department_id INT 
FOREIGN KEY (role_id)
REFERENCES roles(id)
FOREIGN KEY (department_id)
REFERENCES department(id)
On DELETE cascade,
manager_id INT,
FOREIGN KEY (manager_id)
REFERENCES employees(id)
ON DELETE SET NULL
);