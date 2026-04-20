const navItems = [
  { icon: '▣', label: 'Dashboard', active: true },
  { icon: '📊', label: 'Analytics', active: false },
  { icon: '📦', label: 'Orders', active: false },
  { icon: '👥', label: 'Customers', active: false },
  { icon: '🛍️', label: 'Products', active: false },
  { icon: '⚙️', label: 'Settings', active: false },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">X</span>
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
            ProjectX
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
              item.active
                ? 'bg-violet-50 text-violet-700 font-semibold dark:bg-violet-950 dark:text-violet-300'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">Admin</p>
            <p className="text-[10px] text-zinc-400 truncate">admin@projectx.io</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
