require('dotenv').config()
const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  const migrationsDir = path.join(__dirname, 'migrations')
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()

  for (const file of files) {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    const statements = content
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    console.log(`Running: ${file}`)
    for (const statement of statements) {
      await sql.query(statement)
    }
    console.log(`Done: ${file}`)
  }

  console.log('All migrations completed!')
}

migrate().catch(console.error)
