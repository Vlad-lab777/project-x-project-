import type { BookingStatus, ServiceCategory } from '../../types'

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending:     { label: 'Очікує',    className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  confirmed:   { label: 'Підтверджено', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  'in-progress': { label: 'В роботі', className: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  completed:   { label: 'Завершено', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  cancelled:   { label: 'Скасовано', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
}

const categoryConfig: Record<ServiceCategory, { label: string; className: string }> = {
  wash:          { label: 'Мийка',       className: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
  polish:        { label: 'Полірування', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  ceramic:       { label: 'Кераміка',    className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  'dry-cleaning':{ label: 'Хімчистка',  className: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  detailing:     { label: 'Детейлінг',  className: 'bg-rose-500/15 text-rose-400 border-rose-500/20' },
}

interface StatusBadgeProps { status: BookingStatus }
interface CategoryBadgeProps { category: ServiceCategory }

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const cfg = categoryConfig[category]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
