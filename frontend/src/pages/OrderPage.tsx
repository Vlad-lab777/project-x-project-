import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, Chip } from '@heroui/react'
import { useI18n } from '../i18n/context'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: string
}

interface OrderItem {
  product_id: number
  name: string
  price: number
  quantity: number
  subtotal: number
}

interface FormState {
  fullName: string
  phone: string
  email: string
  city: string
  postBranch: string
}

interface FormErrors {
  fullName?: boolean
  phone?: boolean
  city?: boolean
  postBranch?: boolean
  noProducts?: boolean
}

const EMPTY_FORM: FormState = { fullName: '', phone: '', email: '', city: '', postBranch: '' }

function QtyControl({ qty, onInc, onDec }: { qty: number; onInc: () => void; onDec: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onDec}
        className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-sm font-bold transition-colors"
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-sm font-bold transition-colors"
      >
        +
      </button>
    </div>
  )
}

export default function OrderPage() {
  const { t } = useI18n()
  const o = t.order

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const selected = products.filter((p) => (quantities[p.id] || 0) > 0)
  const total = selected.reduce((sum, p) => sum + Number(p.price) * (quantities[p.id] || 0), 0)

  function inc(id: number) {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  function dec(id: number) {
    setQuantities((prev) => {
      const next = (prev[id] || 0) - 1
      if (next <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.fullName.trim()) e.fullName = true
    if (!form.phone.trim()) e.phone = true
    if (!form.city.trim()) e.city = true
    if (!form.postBranch.trim()) e.postBranch = true
    if (selected.length === 0) e.noProducts = true
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    const items: OrderItem[] = selected.map((p) => ({
      product_id: p.id,
      name: p.name,
      price: Number(p.price),
      quantity: quantities[p.id],
      subtotal: Number(p.price) * quantities[p.id],
    }))

    setSubmitting(true)
    try {
      await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName,
          phone: form.phone,
          email: form.email,
          city: form.city,
          post_branch: form.postBranch,
          total,
          items,
        }),
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setQuantities({})
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 px-4">
        <div className="text-6xl">✅</div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{o.form.success}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
          {o.form.successMessage}
        </p>
        <button
          onClick={reset}
          className="mt-2 px-6 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          {o.form.newOrder}
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Products */}
      <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <CardHeader className="px-5 pt-5 pb-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {o.products.title}
            </p>
            <p className="text-xs text-zinc-400">{o.products.subtitle}</p>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 flex flex-col gap-2">
          {errors.noProducts && (
            <p className="text-xs text-red-500 mb-1">{o.products.noSelected}</p>
          )}
          {loading ? (
            <p className="text-sm text-zinc-400 py-6 text-center">...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((p) => {
                const qty = quantities[p.id] || 0
                const active = qty > 0
                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${
                      active
                        ? 'border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/30'
                        : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 leading-tight">
                          {p.name}
                        </p>
                        <Chip size="sm" color="default" className="mt-1 text-[10px]">
                          {p.category}
                        </Chip>
                      </div>
                      <span className="text-sm font-bold text-violet-700 dark:text-violet-300 shrink-0">
                        ${Number(p.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <QtyControl qty={qty} onInc={() => inc(p.id)} onDec={() => dec(p.id)} />
                      {active && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          = ${(Number(p.price) * qty).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {selected.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-xs text-zinc-500">
                {o.products.selected}: {selected.length}
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">
                {o.products.total}: ${total.toFixed(2)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery form */}
      <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <CardHeader className="px-5 pt-5 pb-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{o.form.title}</p>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {o.form.fullName} *
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value })
                    setErrors({ ...errors, fullName: false })
                  }}
                  placeholder={o.form.fullNamePlaceholder}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${
                    errors.fullName ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{o.form.required}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {o.form.phone} *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value })
                    setErrors({ ...errors, phone: false })
                  }}
                  placeholder={o.form.phonePlaceholder}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${
                    errors.phone ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{o.form.required}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {o.form.email}
                  <span className="ml-1 text-zinc-400 font-normal">({o.form.optional})</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={o.form.emailPlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {o.form.city} *
                </label>
                <input
                  value={form.city}
                  onChange={(e) => {
                    setForm({ ...form, city: e.target.value })
                    setErrors({ ...errors, city: false })
                  }}
                  placeholder={o.form.cityPlaceholder}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${
                    errors.city ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{o.form.required}</p>}
              </div>

              {/* Post branch */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {o.form.postBranch} *
                </label>
                <input
                  value={form.postBranch}
                  onChange={(e) => {
                    setForm({ ...form, postBranch: e.target.value })
                    setErrors({ ...errors, postBranch: false })
                  }}
                  placeholder={o.form.postBranchPlaceholder}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${
                    errors.postBranch ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
                {errors.postBranch && (
                  <p className="text-xs text-red-500 mt-1">{o.form.required}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60"
              >
                {o.form.submit}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
