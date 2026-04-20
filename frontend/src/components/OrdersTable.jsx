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
import { recentOrders } from '../data/mockData'

const statusColor = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
}

export default function OrdersTable() {
  return (
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardHeader className="px-5 pt-5 pb-0 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Recent Orders</p>
          <p className="text-xs text-zinc-400">Latest 5 transactions</p>
        </div>
        <button className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors">
          View all →
        </button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Table className="mt-2" aria-label="Recent orders">
          <TableContent>
            <TableHeader>
              <TableColumn isRowHeader className="text-xs text-zinc-400 font-medium uppercase">
                Order
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                Customer
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                Product
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                Amount
              </TableColumn>
              <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                Status
              </TableColumn>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} id={order.id}>
                  <TableCell className="text-xs font-mono text-zinc-500">{order.id}</TableCell>
                  <TableCell className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {order.customer}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">{order.product}</TableCell>
                  <TableCell className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {order.amount}
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" color={statusColor[order.status]} variant="flat">
                      {order.status}
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
