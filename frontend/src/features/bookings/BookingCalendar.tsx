import { useState } from 'react'
import { motion } from 'framer-motion'
import { SERVICES, CLIENTS } from '../../data/mock'
import type { Booking } from '../../types'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const MONTH_NAMES = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень']

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-500', confirmed: 'bg-blue-500',
  'in-progress': 'bg-violet-500', completed: 'bg-emerald-500', cancelled: 'bg-zinc-600',
}

interface Props {
  bookings: Booking[]
  onMove: (bookingId: string, newDate: string) => void
  onEdit: (booking: Booking) => void
}

export function BookingCalendar({ bookings, onMove, onEdit }: Props) {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [dragging, setDragging] = useState<string | null>(null)

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7

  const days: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (days.length % 7 !== 0) days.push(null)

  function toISO(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function dayBookings(d: Date) {
    const iso = toISO(d)
    return bookings.filter((b) => b.date === iso)
  }

  function isToday(d: Date) {
    return toISO(d) === toISO(today)
  }

  function handleDrop(e: React.DragEvent, d: Date) {
    e.preventDefault()
    if (dragging) {
      onMove(dragging, toISO(d))
      setDragging(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <button onClick={() => setCurrent(new Date(year, month - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h3 className="text-sm font-semibold text-zinc-100 min-w-32 text-center">{MONTH_NAMES[month]} {year}</h3>
        <button onClick={() => setCurrent(new Date(year, month + 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))} className="ml-2 px-3 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
          Сьогодні
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-zinc-600 uppercase py-2">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-zinc-800/40 rounded-xl overflow-hidden">
        {days.map((d, i) => {
          if (!d) return <div key={i} className="bg-zinc-900/50 min-h-24 p-2" />
          const dbs = dayBookings(d)
          const today_ = isToday(d)
          return (
            <div
              key={i}
              className="bg-zinc-900 min-h-24 p-2 hover:bg-zinc-800/50 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, d)}
            >
              <p className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                today_ ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' : 'text-zinc-500'
              }`}>
                {d.getDate()}
              </p>
              <div className="flex flex-col gap-0.5">
                {dbs.slice(0, 3).map((b) => {
                  const client = CLIENTS.find((c) => c.id === b.clientId)
                  void SERVICES.find((s) => s.id === b.serviceId)
                  return (
                    <motion.div
                      key={b.id}
                      draggable
                      onDragStart={() => setDragging(b.id)}
                      onDragEnd={() => setDragging(null)}
                      onClick={() => onEdit(b)}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-white cursor-grab active:cursor-grabbing ${STATUS_COLOR[b.status]} bg-opacity-80`}
                    >
                      <span className="truncate">{b.time} {client?.name.split(' ')[0]}</span>
                    </motion.div>
                  )
                })}
                {dbs.length > 3 && (
                  <p className="text-[10px] text-zinc-600 px-1">+{dbs.length - 3}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        {[['pending','Очікує'],['confirmed','Підтверджено'],['in-progress','В роботі'],['completed','Завершено'],['cancelled','Скасовано']].map(([s, label]) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLOR[s]}`} />
            <span className="text-[11px] text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
