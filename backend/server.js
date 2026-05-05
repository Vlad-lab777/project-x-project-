require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { neon } = require('@neondatabase/serverless')

const app = express()
const sql = neon(process.env.DATABASE_URL)

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// routes go here

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
