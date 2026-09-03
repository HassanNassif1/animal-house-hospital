// config/database.sql
-- Create database
CREATE DATABASE animal_house;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets table
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- dog, cat, etc.
  breed VARCHAR(100),
  age INTEGER,
  weight DECIMAL(5,2),
  medical_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- general, specialized, emergency
  description TEXT,
  price DECIMAL(10,2),
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- dog, cat, accessories, food, toys, supplements
  subcategory VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pets(id) ON DELETE SET NULL,
  service_id INTEGER REFERENCES services(id),
  appointment_type VARCHAR(50) NOT NULL, -- veterinary, grooming, mobile
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings (boarding, grooming, mobile visits)
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pets(id) ON DELETE SET NULL,
  booking_type VARCHAR(50) NOT NULL, -- boarding, grooming, mobile_visit
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2)
);

-- Insert sample data
INSERT INTO services (name, category, description, price, duration_minutes) VALUES
('Wellness Exam', 'general', 'Comprehensive physical examination and health assessment', 50.00, 30),
('Vaccinations', 'general', 'Core and optional vaccinations for pets', 75.00, 20),
('Cardiology', 'specialized', 'Advanced cardiac evaluation and treatment', 250.00, 60),
('Surgery', 'specialized', 'Specialized surgical procedures', 500.00, 120),
('CT Scan', 'diagnostics', 'Advanced imaging and diagnostics', 350.00, 45),
('Dermatology', 'specialized', 'Skin and allergy treatment', 150.00, 45);

INSERT INTO products (name, category, subcategory, description, price, stock_quantity) VALUES
('Premium Dog Food', 'dog', 'food', 'High-quality nutrition for adult dogs', 45.99, 50),
('Cat Food Deluxe', 'cat', 'food', 'Premium cat food with essential nutrients', 42.99, 40),
('Chew Toy Set', 'dog', 'toys', 'Durable chew toys for active dogs', 19.99, 30),
('Cat Scratcher', 'cat', 'accessories', 'Cardboard scratching pad for cats', 15.99, 25),
('Joint Supplements', 'dog', 'supplements', 'Glucosamine for joint health', 29.99, 35),
('Grooming Kit', 'cat', 'accessories', 'Complete grooming set for cats', 34.99, 20);