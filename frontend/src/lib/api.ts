import { SERVICES, REVIEWS, CLIENTS } from '../data/mock'

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

const tick = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 150))

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

  createBooking: async (data: BookingPayload) => {
    const serviceNames = data.serviceIds
      .map((id) => SERVICES.find((s) => s.id === id)?.name)
      .filter(Boolean)
    const res = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, serviceNames }),
    })
    if (!res.ok) throw new Error('Failed to send booking')
    return res.json() as Promise<{ ok: boolean }>
  },
}
