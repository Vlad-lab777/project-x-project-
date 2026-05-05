import { NavLink } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                  <rect x="9" y="11" width="14" height="10" rx="2"/>
                  <circle cx="12" cy="20" r="1"/><circle cx="20" cy="20" r="1"/>
                </svg>
              </div>
              <span className="font-bold text-white">DetailPRO</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Преміум студія автомобільного детейлінгу.<br />
              Ваше авто заслуговує на найкраще.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Навігація</p>
            <ul className="space-y-2">
              {[['/', 'Головна'], ['/services', 'Послуги'], ['/booking', 'Записатись'], ['/reviews', 'Відгуки']].map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} className="text-sm text-zinc-500 hover:text-white transition-colors">{label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Контакти</p>
            <ul className="space-y-3">
              {[
                { icon: '📞', text: '+38 (067) 000-00-00' },
                { icon: '📧', text: 'info@detailpro.ua' },
                { icon: '📍', text: 'вул. Автомобільна, 1, Київ' },
                { icon: '🕐', text: 'Пн–Сб: 8:00 – 20:00' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-zinc-500">
                  <span>{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-700">© 2026 DetailPRO. Всі права захищено.</p>
          <p className="text-xs text-zinc-700">Преміум детейлінг у вашому місті</p>
        </div>
      </div>
    </footer>
  )
}
