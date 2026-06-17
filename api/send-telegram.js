export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Telegram credentials not configured' })
  }

  const {
    serviceNames,
    date,
    time,
    name,
    phone,
    email,
    carBrand,
    carModel,
    carYear,
    notes,
  } = req.body ?? {}

  if (!name || !phone || !date || !time || !carBrand || !carModel) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const car = [carBrand, carModel, carYear].filter(Boolean).join(' ')
  const services = Array.isArray(serviceNames) && serviceNames.length
    ? serviceNames.join(', ')
    : '—'

  const text = [
    '🚗 *Нове замовлення — TimCar Studio*',
    '',
    `👤 *Ім'я:* ${esc(name)}`,
    `📞 *Телефон:* ${esc(phone)}`,
    email ? `📧 *Email:* ${esc(email)}` : null,
    '',
    `🔧 *Послуги:* ${esc(services)}`,
    `📅 *Дата:* ${esc(date)}`,
    `⏰ *Час:* ${esc(time)}`,
    '',
    `🚙 *Авто:* ${esc(car)}`,
    notes ? `💬 *Побажання:* ${esc(notes)}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  const tgRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'MarkdownV2' }),
  })

  if (!tgRes.ok) {
    const err = await tgRes.text()
    console.error('Telegram error:', err)
    return res.status(502).json({ error: 'Failed to send Telegram message' })
  }

  return res.status(200).json({ ok: true })
}

function esc(str) {
  return String(str).replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1')
}
