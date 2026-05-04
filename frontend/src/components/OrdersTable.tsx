import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

type OrderStatus = 'paid' | 'pending' | 'failed'

const statusStyle: Record<OrderStatus, string> = {
  paid: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400',
}

const statusDot: Record<OrderStatus, string> = {
  paid: 'bg-emerald-500',
  pending: 'bg-amber-500',
  failed: 'bg-red-500',
}

interface RecentOrder {
  id: number
  full_name: string
  total: string
  status: string
  product_name: string | null
}

export default function OrdersTable() {
  const { t } = useI18n()
  const [orders, setOrders] = useState<RecentOrder[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/orders/recent')
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
  }, [])

  return (
    <div
      className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm p-5 animate-fade-up"
      style={{ animationDelay: '250ms' }}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t.ordersTable.title}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{t.ordersTable.subtitle}</p>
        </div>
        <button className="text-xs text-violet-500 hover:text-violet-700 font-semibold transition-colors hover:underline underline-offset-2">
          {t.ordersTable.viewAll}
        </button>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {[
                t.ordersTable.columns.order,
                t.ordersTable.columns.customer,
                t.ordersTable.columns.product,
                t.ordersTable.columns.amount,
                t.ordersTable.columns.status,
              ].map((col) => (
                <th
                  key={col}
                  className="text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-3 px-1"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              const s = (order.status as OrderStatus) ?? 'pending'
              return (
                <tr
                  key={order.id}
                  className="group/row border-b border-zinc-50 dark:border-zinc-800/60 last:border-0 hover:bg-violet-50/40 dark:hover:bg-violet-950/10 transition-colors animate-fade-up"
                  style={{ animationDelay: `${250 + i * 60}ms` }}
                >
                  <td className="py-3 px-1 font-mono text-zinc-400">#{order.id}</td>
                  <td className="py-3 px-1 font-medium text-zinc-800 dark:text-zinc-200">
                    {order.full_name}
                  </td>
                  <td className="py-3 px-1 text-zinc-500">{order.product_name ?? '—'}</td>
                  <td className="py-3 px-1 font-bold text-zinc-900 dark:text-white">
                    ${parseFloat(order.total).toFixed(2)}
                  </td>
                  <td className="py-3 px-1">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle[s]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[s]}`} />
                      {(t.ordersTable.status as Record<string, string>)[s] ?? s}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
