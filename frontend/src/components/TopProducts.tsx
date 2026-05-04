import {
  Card,
  CardContent,
  CardHeader,
  ProgressBar,
  ProgressBarTrack,
  ProgressBarFill,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

interface TopProduct {
  name: string
  sales: number
  revenue: string
  progress: number
}

export default function TopProducts() {
  const { t } = useI18n()
  const [products, setProducts] = useState<TopProduct[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/stats/top-products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
  }, [])

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardHeader className="px-5 pt-5 pb-0">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t.topProducts.title}
          </p>
          <p className="text-xs text-zinc-400">{t.topProducts.subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-4">
        {products.length === 0 ? (
          <p className="text-xs text-zinc-400 py-4 text-center">—</p>
        ) : (
          products.map((product) => (
            <div key={product.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {product.name}
                </span>
                <span className="text-xs text-zinc-400">
                  {product.sales} {t.topProducts.salesUnit} · {product.revenue}
                </span>
              </div>
              <ProgressBar
                value={product.progress}
                minValue={0}
                maxValue={100}
                aria-label={product.name}
              >
                <ProgressBarTrack className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <ProgressBarFill
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                    style={{ width: `${product.progress}%` }}
                  />
                </ProgressBarTrack>
              </ProgressBar>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
