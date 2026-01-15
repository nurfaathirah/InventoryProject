-- Inventory Management System Database Schema
-- For use with XAMPP MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS inventory_management;
USE inventory_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Items table (PC/Laptop items)
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('PC', 'Laptop') NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_brand (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock table (individual stock entries)
CREATE TABLE IF NOT EXISTS stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    serial_number VARCHAR(100),
    asset_id VARCHAR(100),
    location VARCHAR(255),
    staff_id VARCHAR(100),
    deployment_location VARCHAR(255),
    deployment_date DATE,
    admin_id INT,
    admin_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_item_id (item_id),
    INDEX idx_serial_number (serial_number),
    INDEX idx_asset_id (asset_id),
    INDEX idx_location (location),
    INDEX idx_admin_id (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock Out table (deployed stock entries)
CREATE TABLE IF NOT EXISTS stock_out (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT NOT NULL,
    item_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_category ENUM('PC', 'Laptop') NOT NULL,
    item_brand VARCHAR(100) NOT NULL,
    item_model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    asset_id VARCHAR(100),
    location VARCHAR(255),
    staff_id VARCHAR(100) NOT NULL,
    deployment_location VARCHAR(255) NOT NULL,
    deployment_date DATE NOT NULL,
    admin_id INT,
    admin_name VARCHAR(100),
    stock_out_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_item_id (item_id),
    INDEX idx_staff_id (staff_id),
    INDEX idx_deployment_location (deployment_location),
    INDEX idx_stock_out_date (stock_out_date),
    INDEX idx_admin_id (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional)
INSERT INTO users (name, email, password) VALUES
('Admin User', 'admin@inventory.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K');

-- Sample items
INSERT INTO items (name, category, brand, model) VALUES
('Dell OptiPlex 7090', 'PC', 'Dell', 'OptiPlex 7090'),
('HP EliteBook 840', 'Laptop', 'HP', 'EliteBook 840'),
('Lenovo ThinkPad X13', 'Laptop', 'Lenovo', 'ThinkPad X13');

-- Sample stock entries
INSERT INTO stock (item_id, serial_number, asset_id, location) VALUES
(1, 'SN001234', 'AST001', 'Warehouse A'),
(1, 'SN001235', 'AST002', 'Warehouse A'),
(2, 'SN002345', 'AST003', 'Office 101'),
(3, 'SN003456', 'AST004', 'Office 102');
