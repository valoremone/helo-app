const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function setupDatabase() {
  console.log('Setting up database for Better-Auth...');
  
  // Create database connection
  const connection = await mysql.createConnection({
    host: process.env.VITE_DB_HOST || 'localhost',
    user: process.env.VITE_DB_USER || 'helo_admin',
    password: process.env.VITE_DB_PASSWORD || 'ValoremPres1!',
    multipleStatements: true,
  });
  
  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.VITE_DB_NAME || 'helo_admin_app'}`);
    console.log(`Database '${process.env.VITE_DB_NAME || 'helo_admin_app'}' created or already exists.`);
    
    // Use the database
    await connection.query(`USE ${process.env.VITE_DB_NAME || 'helo_admin_app'}`);
    
    // Drop existing tables if they exist
    try {
      await connection.query(`
        DROP TABLE IF EXISTS user_profiles;
        DROP TABLE IF EXISTS login_attempts;
        DROP TABLE IF EXISTS sessions;
        DROP TABLE IF EXISTS users;
      `);
      console.log('Dropped existing tables.');
    } catch (dropError) {
      console.warn('Warning: Could not drop all tables:', dropError.message);
    }
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'member',
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        lastLoginAt TIMESTAMP NULL
      )
    `);
    console.log('Users table created or already exists.');
    
    // Create sessions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        token TEXT NOT NULL,
        expiresAt TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Sessions table created or already exists.');
    
    // Create login_attempts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        ipAddress VARCHAR(45) NOT NULL,
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Login attempts table created or already exists.');
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();