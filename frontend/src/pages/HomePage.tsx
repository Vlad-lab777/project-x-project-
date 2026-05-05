import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SERVICES, REVIEWS, CLIENTS, BOOKINGS } from '../data/mock'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

const totalRevenue = BOOKINGS.filter((b) => b.status === 'completed').reduce((s, b) => s + b.price, 0)
const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)

const USP = [
  { icon: '🏆', title: 'Преміум якість', desc: 'Використовуємо тільки сертифіковані засоби провідних брендів Gyeon, Koch Chemie, Meguiars.' },
  { icon: '⏱️', title: 'Точно в строк', desc: 'Поважаємо ваш час. Всі роботи виконуються у домовлені терміни без зайвого очікування.' },
  { icon: '🛡️', title: 'Гарантія результату', desc: 'Надаємо гарантію на керамічне покриття до 3 років. Будемо раді, якщо ви повернетесь.' },
  { icon: '📍', title: 'Зручне розташування', desc: 'Знаходимось в центрі міста. Зручне паркування та трансфер до зупинки.' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? '#F59E0B' : 'none'} stroke={i < rating ? '#F59E0B' : '#3F3F46'} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function formatDuration(m: number) {
  const h = Math.floor(m / 60)
  const min = m % 60
  return h ? (min ? `${h}г ${min}хв` : `${h}г`) : `${m}хв`
}

export function HomePage() {
  const navigate = useNavigate()
  const featuredServices = SERVICES.filter((s) => s.active).slice(0, 3)
  const recentReviews = [...REVIEWS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative max-w-6xl mx-auto px-4 py-32 w-full">
          <div className="max-w-2xl">
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Преміум детейлінг студія · Київ
            </motion.div>

            <motion.h1 {...fadeUp(0.2)} className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Ваше авто заслуговує на{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                найкраще
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.3)} className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl">
              Детейлінг, полірування, керамічне покриття та хімчистка преміум-класу.
              Відновлюємо зовнішній вигляд авто до ідеального стану.
            </motion.p>

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Записатись зараз
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-3.5 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold hover:bg-zinc-700 transition-colors"
              >
                Наші послуги →
              </button>
            </motion.div>
          </div>

          {/* Floating stats */}
          <motion.div
            {...fadeUp(0.5)}
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4"
          >
            {[
              { value: `₴${(totalRevenue / 1000).toFixed(0)}k+`, label: 'Виконано робіт' },
              { value: `★ ${avgRating}`, label: 'Середня оцінка' },
              { value: `${CLIENTS.length}+`, label: 'Постійних клієнтів' },
              { value: `${SERVICES.length}`, label: 'Послуг у каталозі' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl px-5 py-4 text-right min-w-40">
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </motion.div>
      </section>

      {/* ─── USP ─── */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Чому обирають нас</p>
            <h2 className="text-3xl font-bold text-white">Стандарт якості, якому довіряють</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {USP.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center text-2xl mb-4">
                  {icon}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED SERVICES ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Послуги</p>
              <h2 className="text-3xl font-bold text-white">Популярні послуги</h2>
            </div>
            <button onClick={() => navigate('/services')} className="text-sm text-zinc-500 hover:text-white transition-colors">
              Всі послуги →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden group"
              >
                <div className={`h-36 bg-gradient-to-br ${s.gradient} flex items-center justify-center relative`}>
                  <span className="text-6xl drop-shadow-xl group-hover:scale-110 transition-transform duration-300">{s.icon}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white mb-2">{s.name}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">₴{s.price.toLocaleString()}</p>
                      <p className="text-[11px] text-zinc-600">{formatDuration(s.duration)}</p>
                    </div>
                    <button
                      onClick={() => navigate('/booking')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
                    >
                      Записатись
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Відгуки</p>
              <h2 className="text-3xl font-bold text-white">Що кажуть клієнти</h2>
            </div>
            <button onClick={() => navigate('/reviews')} className="text-sm text-zinc-500 hover:text-white transition-colors">
              Всі відгуки →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentReviews.map((r, i) => {
              const client = CLIENTS.find((c) => c.id === r.clientId)!
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {client.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{client.name}</p>
                      <Stars rating={r.rating} />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{r.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-center"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Готові до трансформації?</h2>
              <p className="text-blue-100 mb-8 max-w-md mx-auto">
                Запишіть своє авто вже сьогодні та переконайтесь у якості нашої роботи особисто.
              </p>
              <button
                onClick={() => navigate('/booking')}
                className="px-10 py-4 rounded-2xl bg-white text-blue-600 font-bold text-base shadow-2xl hover:shadow-3xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Записатись безкоштовно
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
