export type ServiceCategory = 'wash' | 'polish' | 'ceramic' | 'dry-cleaning' | 'detailing'

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  initials: string
}

export interface Car {
  id: string
  clientId: string
  brand: string
  model: string
  year: number
  color: string
  plate: string
}

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  description: string
  duration: number
  price: number
  priceLabel: string
  gradient: string
  icon: string
  active: boolean
}

export interface Booking {
  id: string
  clientId: string
  carId: string
  serviceId: string
  date: string
  time: string
  status: BookingStatus
  price: number
  notes?: string
  createdAt: string
}

export interface Review {
  id: string
  clientId: string
  bookingId?: string
  rating: number
  text: string
  createdAt: string
  reply?: string
}
