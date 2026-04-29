require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

const products = [
  {
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 149.99,
    stock: 45,
    description: 'High-quality wireless headphones with noise cancellation',
  },
  {
    name: 'Running Shoes',
    category: 'Sports',
    price: 89.99,
    stock: 128,
    description: 'Lightweight running shoes for everyday training',
  },
  {
    name: 'Coffee Maker',
    category: 'Kitchen',
    price: 59.99,
    stock: 12,
    description: 'Compact coffee maker for home use',
  },
]

async function seed() {
  for (const p of products) {
    const status = p.stock === 0 ? 'out_of_stock' : p.stock < 15 ? 'low_stock' : 'active'
    await sql`
      INSERT INTO products (name, category, price, stock, description, status)
      VALUES (${p.name}, ${p.category}, ${p.price}, ${p.stock}, ${p.description}, ${status})
    `
    console.log(`Inserted: ${p.name}`)
  }
  console.log('Seeding completed!')
}

seed().catch(console.error)
