require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { neon } = require('@neondatabase/serverless')

const app = express()
const sql = neon(process.env.DATABASE_URL)

app.use(cors())
app.use(express.json())

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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
