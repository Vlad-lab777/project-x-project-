import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { ServiceCard } from './ServiceCard'
import { ServiceModal } from './ServiceModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../context/ToastContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { SERVICES as INITIAL } from '../../data/mock'
import type { Service, ServiceCategory } from '../../types'

const CATEGORY_LABELS: Record<ServiceCategory | 'all', string> = {
  all: 'Всі', wash: 'Мийка', polish: 'Полірування',
  ceramic: 'Кераміка', 'dry-cleaning': 'Хімчистка', detailing: 'Детейлінг',
}

export function ServicesPage() {
  const { toast } = useToast()
  const [services, setServices] = useLocalStorage<Service[]>('detail_services', INITIAL)
  const [category, setCategory] = useState<ServiceCategory | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  const filtered = category === 'all' ? services : services.filter((s) => s.category === category)

  function handleSave(data: Omit<Service, 'id'>) {
    if (editing) {
      setServices((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...data } : s))
      toast('Послугу оновлено')
    } else {
      const ns: Service = { ...data, id: `s${Date.now()}` }
      setServices((prev) => [...prev, ns])
      toast('Послугу додано')
    }
  }

  function handleDelete(id: string) {
    if (!confirm('Видалити цю послугу?')) return
    setServices((prev) => prev.filter((s) => s.id !== id))
    toast('Послугу видалено', 'error')
  }

  function openEdit(s: Service) { setEditing(s); setModalOpen(true) }
  function openCreate() { setEditing(null); setModalOpen(true) }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-100">Послуги</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{services.length} послуг у каталозі</p>
        </div>
        <Button onClick={openCreate} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
          Нова послуга
        </Button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(CATEGORY_LABELS) as [ServiceCategory | 'all', string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setCategory(val)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              category === val
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/60 p-8">
          <EmptyState icon="🔧" title="Немає послуг" description="Додайте першу послугу до каталогу" action={{ label: 'Нова послуга', onClick: openCreate }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s, i) => (
            <ServiceCard key={s.id} service={s} onEdit={openEdit} onDelete={handleDelete} index={i} />
          ))}
        </div>
      )}

      <ServiceModal open={modalOpen} onClose={() => setModalOpen(false)} service={editing} onSave={handleSave} />
    </div>
  )
}
