CREATE USER bookstore_user with encrypted password '1234';
CREATE DATABASE bookstore_db;
GRANT ALL PRIVILEGES ON DATABASE bookstore_db TO bookstore_user;
