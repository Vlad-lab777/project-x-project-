import { NavLink } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo-short.png" alt="TSD" className="h-8 w-auto" />
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
