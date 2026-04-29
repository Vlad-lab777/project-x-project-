require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function main() {
  const result = await sql`SELECT version()`
  console.log('Connected to Neon!')
  console.log(result[0].version)
}

main().catch(console.error)
