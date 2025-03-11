-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastLoginAt TIMESTAMP NULL,
  resetToken VARCHAR(255) UNIQUE NULL,
  resetExpires TIMESTAMP NULL
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) UNIQUE NOT NULL,
  membershipTier VARCHAR(50) DEFAULT 'basic',
  status VARCHAR(50) DEFAULT 'active',
  phoneNumber VARCHAR(20) NULL,
  address TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Login attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  ipAddress VARCHAR(45) NOT NULL,
  userAgent TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, password, firstName, lastName, role, isActive)
VALUES (
  UUID(),
  'admin@flyhelo.one',
  '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iq.7ZxZxZxZxZx', -- This is a placeholder, we'll update it with proper hash
  'Admin',
  'User',
  'admin',
  true
);

-- Insert default member user (password: member123)
INSERT INTO users (id, email, password, firstName, lastName, role, isActive)
VALUES (
  UUID(),
  'member@flyhelo.one',
  '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iq.7ZxZxZxZxZx', -- This is a placeholder, we'll update it with proper hash
  'Member',
  'User',
  'member',
  true
); 