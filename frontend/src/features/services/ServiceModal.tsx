import { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import type { Service, ServiceCategory } from '../../types'

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'wash', label: 'Мийка' },
  { value: 'polish', label: 'Полірування' },
  { value: 'ceramic', label: 'Кераміка' },
  { value: 'dry-cleaning', label: 'Хімчистка' },
  { value: 'detailing', label: 'Детейлінг' },
]

const GRADIENTS = [
  'from-sky-500 to-cyan-500',
  'from-purple-500 to-violet-600',
  'from-amber-400 to-orange-500',
  'from-blue-500 to-indigo-600',
  'from-teal-500 to-emerald-500',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
]

const ICONS = ['💧','🧹','✨','🔷','⚙️','🏆','🛡️','🪑','🚗','🔧','🧽','💎']

interface Props {
  open: boolean
  onClose: () => void
  service: Service | null
  onSave: (data: Omit<Service, 'id'>) => void
}

const EMPTY: Omit<Service, 'id'> = {
  name: '', category: 'wash', description: '', duration: 60,
  price: 0, gradient: GRADIENTS[0], icon: ICONS[0], active: true,
}

export function ServiceModal({ open, onClose, service, onSave }: Props) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (service) {
      const { id: _id, ...rest } = service
      setForm(rest)
    } else {
      setForm(EMPTY)
    }
  }, [service, open])

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  function handleSubmit() {
    if (!form.name.trim()) return
    onSave(form)
    onClose()
  }

  const inputCls = 'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 transition-colors'
  const labelCls = 'block text-xs font-medium text-zinc-400 mb-1.5'

  return (
    <Modal open={open} onClose={onClose} title={service ? 'Редагувати послугу' : 'Нова послуга'} size="lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Назва послуги</label>
          <input type="text" className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Комплексна мийка..." />
        </div>

        <div>
          <label className={labelCls}>Категорія</label>
          <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value as ServiceCategory)}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Іконка</label>
          <div className="flex flex-wrap gap-1.5">
            {ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => set('icon', ic)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${form.icon === ic ? 'bg-blue-500/20 border border-blue-500/50 scale-110' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Колір картки</label>
          <div className="flex flex-wrap gap-2">
            {GRADIENTS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => set('gradient', g)}
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g} transition-all ${form.gradient === g ? 'ring-2 ring-white/50 scale-110' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Опис</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Короткий опис послуги..."
          />
        </div>

        <div>
          <label className={labelCls}>Тривалість (хв)</label>
          <input type="number" className={inputCls} value={form.duration} onChange={(e) => set('duration', Number(e.target.value))} min={15} />
        </div>

        <div>
          <label className={labelCls}>Ціна (₴)</label>
          <input type="number" className={inputCls} value={form.price} onChange={(e) => set('price', Number(e.target.value))} min={0} />
        </div>

        <div className="col-span-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => set('active', !form.active)}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.active ? 'bg-blue-500' : 'bg-zinc-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? 'left-5' : 'left-0.5'}`} />
          </button>
          <span className="text-sm text-zinc-400">Активна</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-zinc-800">
        <Button variant="secondary" onClick={onClose}>Скасувати</Button>
        <Button onClick={handleSubmit}>{service ? 'Зберегти' : 'Створити'}</Button>
      </div>
    </Modal>
  )
}
