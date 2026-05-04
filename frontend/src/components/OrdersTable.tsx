import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

type OrderStatus = 'paid' | 'pending' | 'failed'

const statusColor: Record<OrderStatus, 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
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
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardHeader className="px-5 pt-5 pb-0 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t.ordersTable.title}
          </p>
          <p className="text-xs text-zinc-400">{t.ordersTable.subtitle}</p>
        </div>
        <button className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors">
          {t.ordersTable.viewAll}
        </button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Table className="mt-2">
          <TableContent aria-label={t.ordersTable.title}>
            <TableHeader>
              <TableColumn isRowHeader className="text-xs text-zinc-400 font-medium uppercase">
                {t.ordersTable.columns.order}
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                {t.ordersTable.columns.customer}
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                {t.ordersTable.columns.product}
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                {t.ordersTable.columns.amount}
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                {t.ordersTable.columns.status}
              </TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} id={String(order.id)}>
                  <TableCell className="text-xs font-mono text-zinc-500">#{order.id}</TableCell>
                  <TableCell className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {order.full_name}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">
                    {order.product_name ?? '—'}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    ${parseFloat(order.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" color={statusColor[(order.status as OrderStatus) ?? 'pending']}>
                      {(t.ordersTable.status as Record<string, string>)[order.status] ?? order.status}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContent>
        </Table>
      </CardContent>
    </Card>
  )
}
