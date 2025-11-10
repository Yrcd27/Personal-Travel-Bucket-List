-- db/init.sql
CREATE DATABASE IF NOT EXISTS travel_bucket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE travel_bucket;

-- Create the application user and grant permissions
CREATE USER IF NOT EXISTS 'travel_user'@'%' IDENTIFIED BY 'userpassword123';
GRANT ALL PRIVILEGES ON travel_bucket.* TO 'travel_user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
