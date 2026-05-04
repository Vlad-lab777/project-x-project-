CREATE TABLE IF NOT EXISTS staff (
  id         SERIAL PRIMARY KEY,
  full_name  VARCHAR(255) NOT NULL,
  role       VARCHAR(50)  NOT NULL DEFAULT 'seller',
  phone      VARCHAR(50)  NOT NULL,
  email      VARCHAR(255),
  status     VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
