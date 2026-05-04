import { useState, FormEvent } from 'react'
import { useI18n } from '../i18n/context'

interface LoginForm {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

interface Props {
  onLogin: (user: { id: number; full_name: string; role: string; email: string }) => void
}

export default function LoginPage({ onLogin }: Props) {
  const { t } = useI18n()
  const tl = t.login

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const newErrors: LoginErrors = {}
    if (!form.email.trim()) newErrors.email = tl.emailRequired
    if (!form.password.trim()) newErrors.password = tl.passwordRequired
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        setErrors({ general: tl.invalid })
        return
      }
      const user = await res.json()
      onLogin(user)
    } catch {
      setErrors({ general: tl.invalid })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{tl.title}</h1>
          <p className="text-sm text-zinc-400 mt-1">{tl.subtitle}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                {tl.email}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={tl.emailPlaceholder}
                autoComplete="email"
                className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${errors.email ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                {tl.password}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder={tl.passwordPlaceholder}
                autoComplete="current-password"
                className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${errors.password ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mt-1"
            >
              {loading ? '...' : tl.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
