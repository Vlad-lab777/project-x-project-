import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

interface TopProduct {
  name: string
  sales: number
  revenue: string
  progress: number
}

const BAR_GRADIENTS = [
  'from-violet-500 to-purple-500',
  'from-sky-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-orange-400 to-amber-500',
  'from-pink-500 to-rose-500',
]

export default function TopProducts() {
  const { t } = useI18n()
  const [products, setProducts] = useState<TopProduct[]>([])
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/stats/top-products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data)
        setTimeout(() => setAnimated(true), 80)
      })
      .catch(() => {})
  }, [])

  return (
    <div
      className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm p-5 animate-fade-up"
      style={{ animationDelay: '300ms' }}
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t.topProducts.title}</p>
      <p className="text-xs text-zinc-400 mt-0.5 mb-5">{t.topProducts.subtitle}</p>

      <div className="flex flex-col gap-5">
        {products.length === 0 ? (
          <p className="text-xs text-zinc-400 py-4 text-center">—</p>
        ) : (
          products.map((product, i) => (
            <div key={product.name} className="animate-fade-up" style={{ animationDelay: `${300 + i * 80}ms` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {product.name}
                </span>
                <span className="text-xs text-zinc-400">
                  {product.sales} {t.topProducts.salesUnit}
                  <span className="mx-1 text-zinc-300 dark:text-zinc-600">·</span>
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400">{product.revenue}</span>
                </span>
              </div>
              {/* Progress track */}
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${BAR_GRADIENTS[i % BAR_GRADIENTS.length]} origin-left`}
                  style={{
                    width: animated ? `${product.progress}%` : '0%',
                    transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
                    boxShadow: '0 0 8px rgba(139,92,246,0.3)',
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
