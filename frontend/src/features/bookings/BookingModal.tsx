import { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { CLIENTS, CARS, SERVICES } from '../../data/mock'
import type { Booking, BookingStatus } from '../../types'

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']
const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Очікує', confirmed: 'Підтверджено', 'in-progress': 'В роботі',
  completed: 'Завершено', cancelled: 'Скасовано',
}

interface Props {
  open: boolean
  onClose: () => void
  booking: Booking | null
  onSave: (data: Omit<Booking, 'id' | 'createdAt'>) => void
}

const EMPTY: Omit<Booking, 'id' | 'createdAt'> = {
  clientId: CLIENTS[0].id, carId: CARS[0].id, serviceId: SERVICES[0].id,
  date: new Date().toISOString().slice(0, 10), time: '09:00',
  status: 'pending', price: SERVICES[0].price, notes: '',
}

export function BookingModal({ open, onClose, booking, onSave }: Props) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (booking) {
      const { id: _id, createdAt: _c, ...rest } = booking
      setForm(rest)
    } else {
      setForm(EMPTY)
    }
  }, [booking, open])

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const clientCars = CARS.filter((c) => c.clientId === form.clientId)
  const selectedService = SERVICES.find((s) => s.id === form.serviceId)

  function handleClientChange(clientId: string) {
    const cars = CARS.filter((c) => c.clientId === clientId)
    set('clientId', clientId)
    set('carId', cars[0]?.id ?? '')
  }

  function handleServiceChange(serviceId: string) {
    const svc = SERVICES.find((s) => s.id === serviceId)
    set('serviceId', serviceId)
    if (svc) set('price', svc.price)
  }

  function handleSubmit() {
    if (!form.clientId || !form.carId || !form.serviceId || !form.date || !form.time) return
    onSave(form)
    onClose()
  }

  const inputCls = 'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 transition-colors'
  const labelCls = 'block text-xs font-medium text-zinc-400 mb-1.5'

  return (
    <Modal open={open} onClose={onClose} title={booking ? 'Редагувати запис' : 'Новий запис'} size="lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Клієнт</label>
          <select className={inputCls} value={form.clientId} onChange={(e) => handleClientChange(e.target.value)}>
            {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Автомобіль</label>
          <select className={inputCls} value={form.carId} onChange={(e) => set('carId', e.target.value)}>
            {clientCars.map((v) => (
              <option key={v.id} value={v.id}>{v.brand} {v.model} {v.year} · {v.plate}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Послуга</label>
          <select className={inputCls} value={form.serviceId} onChange={(e) => handleServiceChange(e.target.value)}>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — ₴{s.price} · {s.duration} хв</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Дата</label>
          <input type="date" className={inputCls} value={form.date} onChange={(e) => set('date', e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>Час</label>
          <input type="time" className={inputCls} value={form.time} onChange={(e) => set('time', e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>Статус</label>
          <select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value as BookingStatus)}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Ціна (₴)</label>
          <input
            type="number"
            className={inputCls}
            value={form.price}
            onChange={(e) => set('price', Number(e.target.value))}
            placeholder={String(selectedService?.price ?? 0)}
          />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Нотатки</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            value={form.notes ?? ''}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Побажання клієнта..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-zinc-800">
        <Button variant="secondary" onClick={onClose}>Скасувати</Button>
        <Button onClick={handleSubmit}>{booking ? 'Зберегти' : 'Створити запис'}</Button>
      </div>
    </Modal>
  )
}
