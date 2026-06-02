CREATE TABLE IF NOT EXISTS gifts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  link TEXT,
  status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'elegido')),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts(status);
