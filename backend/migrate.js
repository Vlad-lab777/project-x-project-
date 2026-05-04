require('dotenv').config()
const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `

  const applied = await sql`SELECT name FROM migrations`
  const appliedSet = new Set(applied.map((r) => r.name))

  const migrationsDir = path.join(__dirname, 'migrations')
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`Skip (already applied): ${file}`)
      continue
    }

    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    const statements = content
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    console.log(`Running: ${file}`)
    for (const statement of statements) {
      await sql.query(statement)
    }

    await sql`INSERT INTO migrations (name) VALUES (${file})`
    console.log(`Done: ${file}`)
  }

  console.log('All migrations completed!')
}

migrate().catch(console.error)
