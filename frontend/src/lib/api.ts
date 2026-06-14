// ⚙️ Дані беруться локально з src/data/mock.ts — бекенд не потрібен.
// Форма запису формує повідомлення й відкриває Telegram студії.

import { SERVICES, REVIEWS, CLIENTS } from '../data/mock'

// 👇 ПОМІНЯЙ ЦЕ на Telegram-юзернейм брата (без @).
// Напр. якщо його акаунт t.me/timcar_detailing — пиши 'timcar_detailing'.
export const TELEGRAM_USERNAME = 'T1mpah'

export interface ApiService {
  id: string
  name: string
  category: string
  description: string
  duration: number
  price: number
  priceLabel: string
  gradient: string
  icon: string
  active: boolean
}

export interface ApiReview {
  id: number
  clientName: string
  clientInitials: string
  rating: number
  text: string
  reply: string | null
  createdAt: string
}

export interface ApiStats {
  serviceCount: number
  reviewCount: number
  avgRating: number
  clientCount: number
  totalRevenue: number
}

export interface BookingPayload {
  serviceIds: string[]
  date: string
  time: string
  name: string
  phone: string
  email?: string
  carBrand: string
  carModel: string
  carYear?: string
  notes?: string
}

// Невелика затримка, щоб скелетони-завантаження встигли показатись (як було з сервером).
const tick = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 150))

function buildTelegramMessage(data: BookingPayload): string {
  const serviceNames = data.serviceIds
    .map((id) => SERVICES.find((s) => s.id === id)?.name)
    .filter(Boolean)
    .join(', ')

  const totalPrice = data.serviceIds.reduce((sum, id) => {
    const svc = SERVICES.find((s) => s.id === id)
    return sum + (svc?.price ?? 0)
  }, 0)

  const dateUa = data.date
    ? new Date(data.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const car = `${data.carBrand} ${data.carModel}${data.carYear ? ` (${data.carYear})` : ''}`

  const lines = [
    '🚗 Нова заявка з сайту',
    '',
    `🧰 Послуги: ${serviceNames || '—'}`,
    `📅 Дата: ${dateUa}`,
    `🕐 Час: ${data.time || '—'}`,
    '',
    `👤 Клієнт: ${data.name}`,
    `📞 Телефон: ${data.phone}`,
    data.email ? `📧 Email: ${data.email}` : '',
    `🚙 Авто: ${car}`,
    data.notes ? `📝 Побажання: ${data.notes}` : '',
    '',
    `💰 Орієнтовна сума: від ${totalPrice}$`,
  ]

  return lines.filter((l) => l !== '').join('\n')
}

export const api = {
  getServices: () => tick<ApiService[]>(SERVICES as ApiService[]),

  getReviews: () => {
    const reviews: ApiReview[] = REVIEWS.map((r, i) => {
      const client = CLIENTS.find((c) => c.id === r.clientId)
      return {
        id: i + 1,
        clientName: client?.name ?? 'Клієнт',
        clientInitials: client?.initials ?? '–',
        rating: r.rating,
        text: r.text,
        reply: r.reply ?? null,
        createdAt: r.createdAt,
      }
    })
    return tick<ApiReview[]>(reviews)
  },

  getStats: () => {
    const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / (REVIEWS.length || 1)
    return tick<ApiStats>({
      serviceCount: SERVICES.length,
      reviewCount: REVIEWS.length,
      avgRating: Math.round(avg * 10) / 10,
      clientCount: CLIENTS.length,
      totalRevenue: 0,
    })
  },

  // Замість сервера: відкриваємо Telegram студії з готовим текстом заявки.
  createBooking: (data: BookingPayload) => {
    const text = buildTelegramMessage(data)
    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
    return tick<{ id: number }>({ id: Date.now() })
  },
}
