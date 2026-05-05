import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { BookingModal } from './BookingModal'
import { BookingCalendar } from './BookingCalendar'
import { useToast } from '../../context/ToastContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { BOOKINGS as INITIAL, CLIENTS, CARS, SERVICES } from '../../data/mock'
import type { Booking, BookingStatus } from '../../types'

type View = 'list' | 'calendar'

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Очікує', confirmed: 'Підтверджено', 'in-progress': 'В роботі',
  completed: 'Завершено', cancelled: 'Скасовано',
}

export function BookingsPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useLocalStorage<Booking[]>('detail_bookings', INITIAL)
  const [view, setView] = useState<View>('list')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Booking | null>(null)

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (serviceFilter !== 'all' && b.serviceId !== serviceFilter) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  function handleSave(data: Omit<Booking, 'id' | 'createdAt'>) {
    if (editing) {
      setBookings((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...data } : b))
      toast('Запис оновлено')
    } else {
      const nb: Booking = { ...data, id: `b${Date.now()}`, createdAt: new Date().toISOString() }
      setBookings((prev) => [nb, ...prev])
      toast('Запис створено')
    }
  }

  function handleDelete(id: string) {
    if (!confirm('Видалити цей запис?')) return
    setBookings((prev) => prev.filter((b) => b.id !== id))
    toast('Запис видалено', 'error')
  }

  function handleMove(bookingId: string, newDate: string) {
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, date: newDate } : b))
    toast(`Запис перенесено на ${newDate}`)
  }

  function openEdit(b: Booking) {
    setEditing(b)
    setModalOpen(true)
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  const selectCls = 'bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none focus:border-blue-500 transition-colors'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-zinc-100">Записи</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{bookings.length} записів загалом</p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-zinc-800 rounded-xl p-1">
          {(['list', 'calendar'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                view === v ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {v === 'list' ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              )}
              {v === 'list' ? 'Список' : 'Календар'}
            </button>
          ))}
        </div>

        <Button onClick={openCreate} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
          Новий запис
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select className={selectCls} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}>
          <option value="all">Всі статуси</option>
          {(Object.entries(STATUS_LABELS) as [BookingStatus, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select className={selectCls} value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
          <option value="all">Всі послуги</option>
          {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {(statusFilter !== 'all' || serviceFilter !== 'all') && (
          <button onClick={() => { setStatusFilter('all'); setServiceFilter('all') }} className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
            Скинути
          </button>
        )}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800/60 p-5">
        {view === 'calendar' ? (
          <BookingCalendar bookings={bookings} onMove={handleMove} onEdit={openEdit} />
        ) : (
          <>
            {sorted.length === 0 ? (
              <EmptyState icon="📅" title="Немає записів" description="Додайте перший запис для клієнта" action={{ label: 'Новий запис', onClick: openCreate }} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {['Клієнт / Авто', 'Послуга', 'Дата', 'Ціна', 'Статус', ''].map((h) => (
                        <th key={h} className="text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-widest pb-3 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((b, i) => {
                      const client = CLIENTS.find((c) => c.id === b.clientId)!
                      const car = CARS.find((c) => c.id === b.carId)!
                      const service = SERVICES.find((s) => s.id === b.serviceId)!
                      return (
                        <motion.tr
                          key={b.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-[11px] font-bold text-zinc-300 shrink-0">
                                {client.initials}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-zinc-200">{client.name}</p>
                                <p className="text-xs text-zinc-500">{car.brand} {car.model} · {car.plate}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{service.icon}</span>
                              <span className="text-sm text-zinc-300">{service.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-sm text-zinc-300">{b.date}</p>
                            <p className="text-xs text-zinc-500">{b.time}</p>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-sm font-semibold text-zinc-200">₴{b.price.toLocaleString()}</p>
                          </td>
                          <td className="px-3 py-3">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEdit(b)} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={() => handleDelete(b.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} booking={editing} onSave={handleSave} />
    </div>
  )
}
