import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  gradient: string
  delay?: number
}

export function StatCard({ label, value, sub, icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/60 p-5 cursor-default"
    >
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl pointer-events-none`} />
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg shrink-0`}>
          <span className="text-white">{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">{value}</p>
      {sub && <p className="text-xs text-zinc-500">{sub}</p>}
    </motion.div>
  )
}
