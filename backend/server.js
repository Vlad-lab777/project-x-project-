require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { neon } = require('@neondatabase/serverless')

const app = express()
const sql = neon(process.env.DATABASE_URL)

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.post('/api/products', async (req, res) => {
  const { name, category, price, stock, description = '' } = req.body

  if (!name || !category || price == null || stock == null) {
    return res.status(400).json({ error: 'name, category, price, stock are required' })
  }

  const status = stock === 0 ? 'out_of_stock' : stock < 15 ? 'low_stock' : 'active'

  const [product] = await sql`
    INSERT INTO products (name, category, price, stock, description, status)
    VALUES (${name}, ${category}, ${price}, ${stock}, ${description}, ${status})
    RETURNING *
  `

  res.status(201).json(product)
})

app.get('/api/products', async (req, res) => {
  const products = await sql`SELECT * FROM products ORDER BY created_at DESC`
  res.json(products)
})

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params
  await sql`DELETE FROM products WHERE id = ${id}`
  res.status(204).end()
})

// Clients
app.get('/api/clients', async (req, res) => {
  const clients = await sql`SELECT * FROM clients ORDER BY created_at DESC`
  res.json(clients)
})

app.get('/api/clients/:id', async (req, res) => {
  const { id } = req.params
  const [client] = await sql`SELECT * FROM clients WHERE id = ${id}`
  if (!client) return res.status(404).json({ error: 'Client not found' })
  res.json(client)
})

app.post('/api/clients', async (req, res) => {
  const { full_name, phone, email = '', city = '' } = req.body

  if (!full_name || !phone) {
    return res.status(400).json({ error: 'full_name and phone are required' })
  }

  const [client] = await sql`
    INSERT INTO clients (full_name, phone, email, city)
    VALUES (${full_name}, ${phone}, ${email}, ${city})
    RETURNING *
  `
  res.status(201).json(client)
})

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params
  const { full_name, phone, email = '', city = '' } = req.body

  if (!full_name || !phone) {
    return res.status(400).json({ error: 'full_name and phone are required' })
  }

  const [client] = await sql`
    UPDATE clients
    SET full_name = ${full_name}, phone = ${phone}, email = ${email}, city = ${city}
    WHERE id = ${id}
    RETURNING *
  `
  if (!client) return res.status(404).json({ error: 'Client not found' })
  res.json(client)
})

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params
  await sql`DELETE FROM clients WHERE id = ${id}`
  res.status(204).end()
})

// Orders
app.get('/api/orders', async (req, res) => {
  const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`
  res.json(orders)
})

app.post('/api/orders', async (req, res) => {
  const { full_name, phone, email = '', city, post_branch, total, items } = req.body

  if (!full_name || !phone || !city || !post_branch || total == null || !items?.length) {
    return res.status(400).json({ error: 'full_name, phone, city, post_branch, total, items are required' })
  }

  const [order] = await sql`
    INSERT INTO orders (full_name, phone, email, city, post_branch, total)
    VALUES (${full_name}, ${phone}, ${email}, ${city}, ${post_branch}, ${total})
    RETURNING *
  `

  for (const item of items) {
    await sql`
      INSERT INTO order_items (order_id, product_id, name, price, quantity, subtotal)
      VALUES (${order.id}, ${item.product_id}, ${item.name}, ${item.price}, ${item.quantity}, ${item.subtotal})
    `
  }

  res.status(201).json(order)
})

app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params
  await sql`DELETE FROM orders WHERE id = ${id}`
  res.status(204).end()
})

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const [member] = await sql`SELECT * FROM staff WHERE email = ${email} AND status = 'active'`
  if (!member || !member.password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  if (member.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const { password: _pw, ...safe } = member
  res.json(safe)
})

// Staff
app.get('/api/staff', async (req, res) => {
  const members = await sql`SELECT id, full_name, role, phone, email, status, avatar, created_at FROM staff ORDER BY created_at DESC`
  res.json(members)
})

app.post('/api/staff', async (req, res) => {
  const { full_name, role, phone, email = '', status = 'active', password, avatar = null } = req.body

  if (!full_name || !role || !phone || !email) {
    return res.status(400).json({ error: 'full_name, role, phone and email are required' })
  }

  if (!password) {
    return res.status(400).json({ error: 'password is required' })
  }

  const [member] = await sql`
    INSERT INTO staff (full_name, role, phone, email, status, password, avatar)
    VALUES (${full_name}, ${role}, ${phone}, ${email}, ${status}, ${password}, ${avatar})
    RETURNING id, full_name, role, phone, email, status, avatar, created_at
  `
  res.status(201).json(member)
})

app.put('/api/staff/:id', async (req, res) => {
  const { id } = req.params
  const { full_name, role, phone, email = '', status, password, avatar = null } = req.body

  if (!full_name || !role || !phone || !email) {
    return res.status(400).json({ error: 'full_name, role, phone and email are required' })
  }

  let member
  if (password) {
    ;[member] = await sql`
      UPDATE staff
      SET full_name = ${full_name}, role = ${role}, phone = ${phone},
          email = ${email}, status = ${status}, password = ${password}, avatar = ${avatar}
      WHERE id = ${id}
      RETURNING id, full_name, role, phone, email, status, avatar, created_at
    `
  } else {
    ;[member] = await sql`
      UPDATE staff
      SET full_name = ${full_name}, role = ${role}, phone = ${phone},
          email = ${email}, status = ${status}, avatar = ${avatar}
      WHERE id = ${id}
      RETURNING id, full_name, role, phone, email, status, avatar, created_at
    `
  }

  if (!member) return res.status(404).json({ error: 'Staff member not found' })
  res.json(member)
})

app.delete('/api/staff/:id', async (req, res) => {
  const { id } = req.params
  await sql`DELETE FROM staff WHERE id = ${id}`
  res.status(204).end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
