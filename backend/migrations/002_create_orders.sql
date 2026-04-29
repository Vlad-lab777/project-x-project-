CREATE TABLE IF NOT EXISTS orders (
  id           SERIAL PRIMARY KEY,
  full_name    VARCHAR(255) NOT NULL,
  phone        VARCHAR(50) NOT NULL,
  email        VARCHAR(255),
  city         VARCHAR(100) NOT NULL,
  post_branch  VARCHAR(100) NOT NULL,
  total        NUMERIC(10, 2) NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  name        VARCHAR(255) NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  quantity    INTEGER NOT NULL,
  subtotal    NUMERIC(10, 2) NOT NULL
);
