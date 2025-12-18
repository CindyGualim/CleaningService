-- Tabla admin (solo 1 usuario)
CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Tabla leads (posibles clientes)
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT,
  lastname TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabla home_images (máximo 5, pero eso lo validamos en código)
CREATE TABLE IF NOT EXISTS home_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabla about_image (solo 1)
CREATE TABLE IF NOT EXISTS about_image (
  id INTEGER PRIMARY KEY,
  url TEXT NOT NULL
);

-- Tabla testimonial_images (máximo 5, validado en código)
CREATE TABLE IF NOT EXISTS testimonial_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
);
