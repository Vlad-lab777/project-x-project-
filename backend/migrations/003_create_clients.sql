CREATE TABLE IF NOT EXISTS clients (
  id         SERIAL PRIMARY KEY,
  full_name  VARCHAR(255) NOT NULL,
  phone      VARCHAR(50) NOT NULL,
  email      VARCHAR(255),
  city       VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
