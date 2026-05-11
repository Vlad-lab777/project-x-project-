require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { neon } = require('@neondatabase/serverless')

const app = express()
const sql = neon(process.env.DATABASE_URL)

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ── DB SETUP ──────────────────────────────────────────────────────────────────

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id        TEXT PRIMARY KEY,
      name      TEXT    NOT NULL,
      category  TEXT    NOT NULL,
      description TEXT,
      duration  INTEGER NOT NULL,
      price     INTEGER NOT NULL,
      gradient  TEXT,
      icon      TEXT,
      active    BOOLEAN DEFAULT true
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id              SERIAL PRIMARY KEY,
      client_name     TEXT    NOT NULL,
      client_initials TEXT,
      rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      text            TEXT    NOT NULL,
      reply           TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id          SERIAL PRIMARY KEY,
      service_id  TEXT REFERENCES services(id),
      price       INTEGER,
      name        TEXT    NOT NULL,
      phone       TEXT    NOT NULL,
      email       TEXT,
      car_brand   TEXT    NOT NULL,
      car_model   TEXT    NOT NULL,
      car_year    INTEGER,
      date        TEXT    NOT NULL,
      time        TEXT    NOT NULL,
      notes       TEXT,
      status      TEXT    DEFAULT 'pending',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

const SEED_SERVICES = [
  { id: 's1', name: 'Комплексна мийка',    category: 'wash',        description: 'Зовнішня мийка кузова, чищення дисків та арок, сушіння та поліролення скла.',                              duration: 90,  price: 800,   gradient: 'from-sky-500 to-cyan-500',      icon: '💧' },
  { id: 's2', name: 'Хімчистка салону',    category: 'dry-cleaning',description: 'Глибоке очищення всіх поверхонь салону: сидінь, килимів, стелі, дверних карт.',                         duration: 240, price: 3500,  gradient: 'from-purple-500 to-violet-600', icon: '🧹' },
  { id: 's3', name: 'Полірування кузова',  category: 'polish',      description: 'Усунення подряпин, вихрів та оксидації. Відновлення блиску лакофарбового покриття.',                    duration: 480, price: 6000,  gradient: 'from-amber-400 to-orange-500',  icon: '✨' },
  { id: 's4', name: 'Керамічне покриття',  category: 'ceramic',     description: 'Нанесення керамічного захисного покриття. Захист від хімічних впливів і UV-випромінювання.',             duration: 600, price: 15000, gradient: 'from-blue-500 to-indigo-600',   icon: '🔷' },
  { id: 's5', name: 'Мийка двигуна',       category: 'wash',        description: 'Безпечне очищення підкапотного простору з використанням спеціальних засобів.',                          duration: 60,  price: 600,   gradient: 'from-teal-500 to-emerald-500',  icon: '⚙️' },
  { id: 's6', name: 'Преміум детейлінг',   category: 'detailing',   description: 'Повний цикл відновлення та захисту: мийка, полірування, керамічне покриття, хімчистка.',                duration: 720, price: 22000, gradient: 'from-rose-500 to-pink-600',     icon: '🏆' },
  { id: 's7', name: 'Нанощитне покриття',  category: 'ceramic',     description: 'Рідке скло + гідрофобний шар. Стійкість до подряпин, бруду та хімікатів.',                              duration: 480, price: 12000, gradient: 'from-indigo-500 to-blue-600',   icon: '🛡️' },
  { id: 's8', name: 'Хімчистка сидінь',    category: 'dry-cleaning',description: 'Видалення плям, запахів та бактерій. Шкіра, тканина, алькантара.',                                     duration: 180, price: 2500,  gradient: 'from-fuchsia-500 to-purple-600',icon: '🪑' },
]

const SEED_REVIEWS = [
  { client_name: 'Олексій Петренко', client_initials: 'ОП', rating: 5, text: 'Керамічне покриття нанесли ідеально! BMW виглядає як нова. Блиск тримається вже 3 місяці — жодної подряпини. Дуже задоволений результатом.', reply: 'Дякуємо, Олексію! Раді, що ви задоволені результатом. Чекаємо вас знову!', created_at: '2026-05-03T10:00:00Z' },
  { client_name: 'Марія Коваленко',  client_initials: 'МК', rating: 5, text: 'Хімчистка салону перевершила всі очікування. Виводили плями, яким вже 2 роки — всі зникли. Запах свіжості — неймовірний. Рекомендую всім!', reply: null, created_at: '2026-05-04T14:00:00Z' },
  { client_name: 'Дмитро Сидоренко', client_initials: 'ДС', rating: 4, text: "Мийка якісна, диски виблискують. Трохи довше чекав ніж очікував, але результат того вартий. Обов'язково приїду ще.", reply: 'Дякуємо за відгук! Працюємо над прискоренням процесу.', created_at: '2026-04-29T11:00:00Z' },
  { client_name: 'Анна Мельник',     client_initials: 'АМ', rating: 5, text: 'Полірування кузова — top! Audi виглядає краще, ніж коли я її купив. Майстри — справжні профі. Вже записалась на керамічне покриття.', reply: null, created_at: '2026-05-05T09:00:00Z' },
  { client_name: 'Ігор Бондаренко',  client_initials: 'ІБ', rating: 5, text: 'Преміум детейлінг — це інший рівень. Порш виглядає як зі салону. Кожна деталь опрацьована бездоганно. Однозначно найкраща студія в місті!', reply: 'Ігорю, дуже приємно це чути! Завжди раді бачити вас у нас.', created_at: '2026-04-22T15:00:00Z' },
  { client_name: 'Тетяна Шевченко',  client_initials: 'ТШ', rating: 4, text: 'Перший раз у цій студії — дуже приємне враження. Ввічливий персонал, чисто, акуратно. XC90 блищить. Повернусь на хімчистку.', reply: null, created_at: '2026-05-05T16:00:00Z' },
  { client_name: 'Марія Коваленко',  client_initials: 'МК', rating: 5, text: 'Нанощитне покриття — чудово! Вода скочується краплями, бруд не прилипає. Майстри пояснили весь процес. Дуже професійний підхід.', reply: null, created_at: '2026-05-09T12:00:00Z' },
  { client_name: 'Олексій Петренко', client_initials: 'ОП', rating: 3, text: 'Мийка двигуна зроблена добре, але хотілось би більш детального підходу до важкодоступних місць. Загалом задоволений, але є куди рости.', reply: 'Дякуємо за чесний відгук! Врахуємо ваші побажання.', created_at: '2026-05-08T10:00:00Z' },
]

async function seed() {
  const [{ count: svcCount }] = await sql`SELECT COUNT(*)::int AS count FROM services`
  if (svcCount === 0) {
    for (const s of SEED_SERVICES) {
      await sql`
        INSERT INTO services (id, name, category, description, duration, price, gradient, icon, active)
        VALUES (${s.id}, ${s.name}, ${s.category}, ${s.description}, ${s.duration}, ${s.price}, ${s.gradient}, ${s.icon}, true)
      `
    }
    console.log('Seeded services')
  }

  const [{ count: rvCount }] = await sql`SELECT COUNT(*)::int AS count FROM reviews`
  if (rvCount === 0) {
    for (const r of SEED_REVIEWS) {
      await sql`
        INSERT INTO reviews (client_name, client_initials, rating, text, reply, created_at)
        VALUES (${r.client_name}, ${r.client_initials}, ${r.rating}, ${r.text}, ${r.reply}, ${r.created_at})
      `
    }
    console.log('Seeded reviews')
  }
}

// ── ROUTES ───────────────────────────────────────────────────────────────────

app.get('/api/services', async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM services WHERE active = true ORDER BY price ASC`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
})

app.get('/api/reviews', async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM reviews ORDER BY created_at DESC`
    res.json(rows.map((r) => ({
      id: r.id,
      clientName: r.client_name,
      clientInitials: r.client_initials,
      rating: r.rating,
      text: r.text,
      reply: r.reply,
      createdAt: r.created_at,
    })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
})

app.get('/api/stats', async (_req, res) => {
  try {
    const [svc]  = await sql`SELECT COUNT(*)::int AS count FROM services WHERE active = true`
    const [rv]   = await sql`SELECT COUNT(*)::int AS count, ROUND(AVG(rating)::numeric, 1) AS avg FROM reviews`
    const [bk]   = await sql`SELECT COUNT(DISTINCT phone)::int AS clients, COALESCE(SUM(price),0)::int AS revenue FROM bookings WHERE status = 'completed'`
    res.json({
      serviceCount:  svc.count,
      reviewCount:   rv.count,
      avgRating:     parseFloat(rv.avg ?? '0'),
      clientCount:   bk.clients,
      totalRevenue:  bk.revenue,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
})

app.post('/api/bookings', async (req, res) => {
  try {
    const { serviceId, date, time, name, phone, email, carBrand, carModel, carYear, notes } = req.body
    if (!serviceId || !date || !time || !name || !phone || !carBrand || !carModel) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [service] = await sql`SELECT price FROM services WHERE id = ${serviceId}`
    if (!service) return res.status(400).json({ error: 'Service not found' })

    const [row] = await sql`
      INSERT INTO bookings (service_id, price, name, phone, email, car_brand, car_model, car_year, date, time, notes)
      VALUES (${serviceId}, ${service.price}, ${name}, ${phone}, ${email ?? null}, ${carBrand}, ${carModel}, ${carYear ? Number(carYear) : null}, ${date}, ${time}, ${notes ?? null})
      RETURNING id
    `
    res.status(201).json({ id: row.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
})

// ── START ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000
migrate()
  .then(seed)
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((err) => { console.error('Startup failed:', err); process.exit(1) })
