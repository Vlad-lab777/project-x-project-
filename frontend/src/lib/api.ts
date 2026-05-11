const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface ApiService {
  id: string
  name: string
  category: string
  description: string
  duration: number
  price: number
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
  serviceId: string
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

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  getServices: () => req<ApiService[]>('/api/services'),
  getReviews:  () => req<ApiReview[]>('/api/reviews'),
  getStats:    () => req<ApiStats>('/api/stats'),
  createBooking: (data: BookingPayload) =>
    req<{ id: number }>('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
}
