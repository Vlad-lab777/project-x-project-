import { NavLink } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo-short.png" alt="TimCar Studio" className="h-8 w-auto" />
              <span className="font-bold text-white">TimCar Studio</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Студія автомобільного детейлінгу в Летичеві.<br />
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
                { icon: '📞', text: '+380 67 320 89 60' },
                { icon: '✈️', text: 'Telegram: @T1mpah' },
                { icon: '📍', text: 'Летичів, стара газ контора' },
                { icon: '🕐', text: 'Пн–Сб: 9:00 – 19:00' },
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
          <p className="text-xs text-zinc-700">© 2026 TimCar Studio. Всі права захищено.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/timcar.detailing_letychiv" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-white transition-colors">Instagram</a>
            <a href="https://www.facebook.com/share/1HKv3NUm4g/" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-white transition-colors">Facebook</a>
            <a href="https://t.me/T1mpah" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-white transition-colors">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
