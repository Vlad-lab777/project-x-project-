import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api, type ApiService } from '../lib/api'
import { SERVICE_ICONS } from '../lib/serviceIcons'

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

function formatDuration(m: number) {
  const h = Math.floor(m / 60)
  const min = m % 60
  return h ? (min ? `${h}г ${min}хв` : `${h}г`) : `${m}хв`
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

function formatDateUa(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface FormData {
  serviceIds: string[]
  date: string
  time: string
  name: string
  phone: string
  email: string
  carBrand: string
  carModel: string
  carYear: string
  notes: string
}

const EMPTY: FormData = {
  serviceIds: [], date: '', time: '', name: '', phone: '', email: '',
  carBrand: '', carModel: '', carYear: '', notes: '',
}

type FieldErrors = Partial<Record<keyof FormData | 'serviceIds', string>>

export function BookingPage() {
  const location = useLocation()
  const preselectedId = (location.state as { serviceId?: string } | null)?.serviceId ?? ''

  const [services, setServices] = useState<ApiService[]>([])
  const [form,      setForm]     = useState<FormData>({ ...EMPTY, serviceIds: preselectedId ? [preselectedId] : [] })
  const [errors,    setErrors]   = useState<FieldErrors>({})
  const [submitting,setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error)
  }, [])

  const selectedServices = services.filter((s) => form.serviceIds.includes(s.id))
  const totalPrice    = selectedServices.reduce((sum, s) => sum + s.price, 0)
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0)

  function toggleService(id: string) {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter((x) => x !== id)
        : [...f.serviceIds, id],
    }))
    setErrors((e) => ({ ...e, serviceIds: undefined }))
  }

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const e: FieldErrors = {}
    if (!form.serviceIds.length) e.serviceIds = 'Оберіть хоча б одну послугу'
    if (!form.date) e.date = 'Оберіть дату'
    if (!form.time) e.time = 'Оберіть час'
    if (!form.name.trim()) e.name = "Введіть ваше ім'я"
    if (!/^\+?[\d\s\-()]{10,}$/.test(form.phone)) e.phone = 'Введіть коректний номер телефону'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Введіть коректний email'
    if (!form.carBrand.trim()) e.carBrand = 'Введіть марку авто'
    if (!form.carModel.trim()) e.carModel = 'Введіть модель авто'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await api.createBooking({
        serviceIds: form.serviceIds,
        date: form.date,
        time: form.time,
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        carBrand: form.carBrand,
        carModel: form.carModel,
        carYear: form.carYear || undefined,
        notes: form.notes || undefined,
      })
      setSubmitted(true)
    } catch {
      setErrors({ name: 'Сталась помилка. Спробуйте ще раз.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="max-w-lg w-full bg-zinc-900 border border-zinc-800/60 rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Запис підтверджено!</h2>
          <p className="text-zinc-400 mb-8">Ми зв'яжемось з вами найближчим часом для підтвердження.</p>
          <div className="bg-zinc-800/50 rounded-2xl p-5 text-left space-y-3 mb-8">
            <Row label="Послуги" value={selectedServices.map((s) => s.name).join(', ')} />
            <Row label="Дата"    value={formatDateUa(form.date)} />
            <Row label="Час"     value={form.time} />
            <Row label="Клієнт"  value={form.name} />
            <Row label="Телефон" value={form.phone} />
            <Row label="Авто"    value={`${form.carBrand} ${form.carModel}${form.carYear ? ` (${form.carYear})` : ''}`} />
            <Row label="Тривалість" value={formatDuration(totalDuration)} />
            <Row label="Вартість" value={`від ${totalPrice}$`} />
          </div>
          <button
            onClick={() => { setForm({ ...EMPTY, serviceIds: preselectedId ? [preselectedId] : [] }); setSubmitted(false) }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
          >
            Записатись ще раз
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Запис</p>
          <h1 className="text-4xl font-extrabold text-white">Запишіться онлайн</h1>
          <p className="text-zinc-400 mt-3">Заповніть форму — ми передзвонимо для підтвердження.</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Services */}
          <Section title="Послуги (можна обрати декілька)">
            {services.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s) => {
                  const selected = form.serviceIds.includes(s.id)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleService(s.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        selected
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-zinc-700/50 bg-zinc-800/50 hover:border-zinc-600'
                      }`}
                    >
                      <div className={`shrink-0 transition-colors ${selected ? 'text-blue-400' : 'text-zinc-500'}`}>
                        {SERVICE_ICONS[s.id] ?? s.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{s.name}</p>
                        <p className="text-xs text-zinc-500">{formatDuration(s.duration)} · {s.priceLabel}</p>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                        selected ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'
                      }`}>
                        {selected && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <polyline points="1 4 3 6 7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
            <FieldError msg={errors.serviceIds} />
          </Section>

          {/* Date & Time */}
          <Section title="Дата і час">
            <div className="mb-4">
              <label className="text-xs text-zinc-500 mb-1.5 block">Дата</label>
              <input
                type="date"
                min={getTodayStr()}
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={inputCls(!!errors.date)}
              />
              <FieldError msg={errors.date} />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Час</label>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('time', t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      form.time === t
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.time} />
            </div>
          </Section>

          {/* Contact */}
          <Section title="Контактні дані">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ім'я та прізвище *" error={errors.name}>
                <input type="text" placeholder="Іван Іваненко" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls(!!errors.name)} />
              </Field>
              <Field label="Телефон *" error={errors.phone}>
                <input type="tel" placeholder="+38 (067) 000-00-00" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls(!!errors.phone)} />
              </Field>
              <Field label="Email" error={errors.email} className="sm:col-span-2">
                <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls(!!errors.email)} />
              </Field>
            </div>
          </Section>

          {/* Car */}
          <Section title="Інформація про авто">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Марка *" error={errors.carBrand}>
                <input type="text" placeholder="BMW" value={form.carBrand} onChange={(e) => set('carBrand', e.target.value)} className={inputCls(!!errors.carBrand)} />
              </Field>
              <Field label="Модель *" error={errors.carModel}>
                <input type="text" placeholder="X5" value={form.carModel} onChange={(e) => set('carModel', e.target.value)} className={inputCls(!!errors.carModel)} />
              </Field>
              <Field label="Рік" error={errors.carYear}>
                <input type="number" placeholder="2022" min="1990" max={new Date().getFullYear() + 1} value={form.carYear} onChange={(e) => set('carYear', e.target.value)} className={inputCls(false)} />
              </Field>
            </div>
          </Section>

          {/* Notes */}
          <Section title="Додаткові побажання">
            <textarea
              rows={4}
              placeholder="Особливі побажання, стан авто, що турбує..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </Section>

          {/* Summary */}
          <AnimatePresence>
            {selectedServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 space-y-3"
              >
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400 shrink-0">{SERVICE_ICONS[s.id] ?? s.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-white">{s.name}</p>
                        <p className="text-xs text-zinc-400">{formatDuration(s.duration)}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white shrink-0">{s.priceLabel}</p>
                  </div>
                ))}
                {selectedServices.length > 1 && (
                  <div className="pt-3 border-t border-blue-500/20 flex items-center justify-between">
                    <p className="text-xs text-zinc-400">Разом · {formatDuration(totalDuration)}</p>
                    <p className="text-xl font-bold text-white">від {totalPrice}$</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-base shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/45 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {submitting ? 'Відправляємо...' : 'Підтвердити запис'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-5">{title}</h2>
      {children}
    </motion.div>
  )
}

function Field({ label, error, children, className = '' }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="text-xs text-zinc-500 mb-1.5 block">{label}</label>
      {children}
      <FieldError msg={error} />
    </div>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs text-red-400 mt-1.5">{msg}</p>
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm text-white font-medium text-right">{value}</span>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl bg-zinc-800 border text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors ${hasError ? 'border-red-500' : 'border-zinc-700/50'}`
}
