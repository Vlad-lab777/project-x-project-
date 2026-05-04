import { useState, useEffect, FormEvent } from 'react'
import {
  Card,
  CardContent,
  Button,
  Switch,
  SwitchControl,
  SwitchThumb,
  TextField,
  Label,
  Input,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  AvatarFallback,
  IconChevronDown,
} from '@heroui/react'

import { useI18n } from '../i18n/context'
import { useSettings } from '../context/SettingsContext'
import ConfirmModal from '../components/ConfirmModal'

// ── Staff types ────────────────────────────────────────────────────────────────

type StaffRole = 'seller' | 'manager' | 'admin'
type StaffStatus = 'active' | 'inactive'

interface StaffMember {
  id: number
  full_name: string
  role: StaffRole
  phone: string
  email: string
  status: StaffStatus
  avatar: string | null
}

interface StaffForm {
  full_name: string
  role: StaffRole
  phone: string
  email: string
  status: StaffStatus
  avatar: string | null
}

interface StaffErrors {
  full_name?: string
  phone?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const EMPTY_STAFF: StaffForm = {
  full_name: '',
  role: 'seller',
  phone: '',
  email: '',
  status: 'active',
  avatar: null,
}

const API = 'http://localhost:3000/api/staff'

function validateStaff(
  form: StaffForm,
  password: string,
  confirmPassword: string,
  isEdit: boolean,
  errors_i18n: Record<string, string>,
): StaffErrors {
  const errors: StaffErrors = {}
  const nameParts = form.full_name.trim().split(/\s+/)
  if (!form.full_name.trim()) {
    errors.full_name = errors_i18n.fullNameRequired
  } else if (nameParts.length < 2) {
    errors.full_name = errors_i18n.fullNameMin
  } else if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'\- ]+$/.test(form.full_name)) {
    errors.full_name = errors_i18n.fullNameInvalid
  }
  if (!form.phone.trim()) {
    errors.phone = errors_i18n.phoneRequired
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) {
    errors.phone = errors_i18n.phoneInvalid
  }
  if (!form.email.trim()) {
    errors.email = errors_i18n.emailRequired
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = errors_i18n.emailInvalid
  }
  if (!isEdit && !password.trim()) {
    errors.password = errors_i18n.passwordRequired
  } else if (password.trim() && password.length < 6) {
    errors.password = errors_i18n.passwordMin
  }
  if (password.trim() && password !== confirmPassword) {
    errors.confirmPassword = errors_i18n.passwordMismatch
  }
  return errors
}

// ── Staff tab ──────────────────────────────────────────────────────────────────

function StaffTab() {
  const { t } = useI18n()
  const ts = t.settings.staff as Record<string, any>

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editMember, setEditMember] = useState<StaffMember | null>(null)
  const [form, setForm] = useState<StaffForm>(EMPTY_STAFF)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<StaffErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data: StaffMember[]) => setStaff(data))
  }, [])

  function openAdd() {
    setEditMember(null)
    setForm(EMPTY_STAFF)
    setPassword('')
    setConfirmPassword('')
    setErrors({})
    setServerError(null)
    setShowModal(true)
  }

  function openEdit(member: StaffMember) {
    setEditMember(member)
    setForm({
      full_name: member.full_name,
      role: member.role,
      phone: member.phone,
      email: member.email || '',
      status: member.status,
      avatar: member.avatar ?? null,
    })
    setPassword('')
    setConfirmPassword('')
    setErrors({})
    setServerError(null)
    setShowModal(true)
  }

  function handleChange(field: keyof StaffForm, value: string) {
    const updated = { ...form, [field]: value } as StaffForm
    setForm(updated)
    const fieldError = validateStaff(updated, password, confirmPassword, !!editMember, ts.errors)[field as keyof StaffErrors]
    setErrors((prev) => ({ ...prev, [field]: fieldError }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validation = validateStaff(form, password, confirmPassword, !!editMember, ts.errors)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    setSubmitting(true)
    setServerError(null)
    try {
      const payload = { ...form, ...(password ? { password } : {}) }
      if (editMember) {
        const res = await fetch(`${API}/${editMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) { setServerError((await res.json()).error ?? 'Помилка сервера'); return }
        const updated: StaffMember = await res.json()
        setStaff(staff.map((m) => (m.id === updated.id ? updated : m)))
      } else {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) { setServerError((await res.json()).error ?? 'Помилка сервера'); return }
        const created: StaffMember = await res.json()
        setStaff([created, ...staff])
      }
      setShowModal(false)
      setEditMember(null)
      setForm(EMPTY_STAFF)
      setPassword('')
      setConfirmPassword('')
    } catch {
      setServerError('Не вдалося зʼєднатися з сервером')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    await fetch(`${API}/${deleteId}`, { method: 'DELETE' })
    setStaff(staff.filter((m) => m.id !== deleteId))
    setDeleteId(null)
  }

  const roleColor: Record<StaffRole, string> = {
    seller: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    manager: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    admin: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{ts.title}</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {staff.length} {ts.total} · {ts.subtitle}
              </p>
            </div>
            <button
              onClick={openAdd}
              className="shrink-0 bg-violet-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              {ts.add}
            </button>
          </div>

          {staff.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">{ts.empty}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.full_name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <Avatar size="sm" color="accent" aria-label={member.full_name}>
                      <AvatarFallback>
                        {member.full_name
                          .trim()
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                      {member.full_name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {member.phone}
                      {member.email ? ` · ${member.email}` : ''}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${roleColor[member.role]}`}
                  >
                    {(ts.roles as Record<string, string>)[member.role]}
                  </span>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      member.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'
                    }`}
                  >
                    {(ts.status as Record<string, string>)[member.status]}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEdit(member)}
                      className="text-zinc-400 hover:text-violet-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteId(member.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                {editMember ? ts.modal.titleEdit : ts.modal.titleAdd}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              {serverError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
                </div>
              )}
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-violet-200 dark:border-violet-800"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-zinc-400 text-xs">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {ts.modal.avatar}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 2 * 1024 * 1024) return
                      const reader = new FileReader()
                      reader.onload = () => setForm((prev) => ({ ...prev, avatar: reader.result as string }))
                      reader.readAsDataURL(file)
                    }}
                    className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 dark:file:bg-violet-900/30 dark:file:text-violet-300 hover:file:bg-violet-100 transition-colors"
                  />
                  <p className="text-[10px] text-zinc-400 mt-0.5">{ts.modal.avatarHint}</p>
                  {form.avatar && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, avatar: null }))}
                      className="text-[10px] text-red-400 hover:text-red-600 mt-0.5 transition-colors"
                    >
                      Видалити фото
                    </button>
                  )}
                </div>
              </div>

              {/* Full name */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ts.modal.fullName} *
                </label>
                <input
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder={ts.modal.fullNamePlaceholder}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${errors.full_name ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
                />
                {errors.full_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
                )}
              </div>

              {/* Role + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {ts.modal.role}
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                  >
                    {(['seller', 'manager', 'admin'] as StaffRole[]).map((r) => (
                      <option key={r} value={r}>
                        {(ts.roles as Record<string, string>)[r]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {ts.modal.status}
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                  >
                    {(['active', 'inactive'] as StaffStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {(ts.status as Record<string, string>)[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ts.modal.phone} *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder={ts.modal.phonePlaceholder}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${errors.phone ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ts.modal.email} *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={ts.modal.emailPlaceholder}
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${errors.email ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col gap-3">
                {editMember && (
                  <p className="text-[11px] text-zinc-400">{ts.modal.passwordHint}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      {ts.modal.password}{!editMember ? ' *' : ''}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }))
                      }}
                      placeholder={ts.modal.passwordPlaceholder}
                      autoComplete="new-password"
                      className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${errors.password ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
                    />
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      {ts.modal.confirmPassword}{!editMember ? ' *' : ''}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                      }}
                      placeholder={ts.modal.confirmPasswordPlaceholder}
                      autoComplete="new-password"
                      className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors ${errors.confirmPassword ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {ts.modal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-sm px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors"
                >
                  {submitting ? '...' : ts.modal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <ConfirmModal
          message={ts.deleteConfirm}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const { settings, updateSettings, updateProfile, updateDashboard } = useSettings()
  const ts = t.settings

  const [activeTab, setActiveTab] = useState<'general' | 'staff'>('general')
  const [profileForm, setProfileForm] = useState({
    name: settings.profile.name,
    email: settings.profile.email,
    initials: settings.profile.initials,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  function flash(setter: (v: boolean) => void) {
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    updateProfile(profileForm)
    flash(setProfileSaved)
  }

  function handleSavePassword(e: FormEvent) {
    e.preventDefault()
    setPasswordForm({ current: '', new: '', confirm: '' })
    setShowPassword(false)
    flash(setPasswordSaved)
  }

  function toggleWidget(id: string) {
    const { visibleWidgets } = settings.dashboard
    const next = visibleWidgets.includes(id)
      ? visibleWidgets.filter((w) => w !== id)
      : [...visibleWidgets, id]
    if (next.length === 0) return
    updateDashboard({ visibleWidgets: next })
  }

  function moveWidget(id: string, dir: number) {
    const order = [...settings.dashboard.widgetOrder]
    const idx = order.indexOf(id)
    const target = idx + dir
    if (target < 0 || target >= order.length) return
    ;[order[idx], order[target]] = [order[target], order[idx]]
    updateDashboard({ widgetOrder: order })
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-2xl flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
        {(['general', 'staff'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            {(ts.tabs as Record<string, string>)[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'staff' && <StaffTab />}

      {activeTab === 'general' && (
        <>
          {/* Profile */}
          <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-5 flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {ts.profile.title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{ts.profile.subtitle}</p>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <Avatar
                    size="lg"
                    color="accent"
                    aria-label={profileForm.name || ts.profile.title}
                    className="shrink-0"
                  >
                    <AvatarFallback>
                      {(profileForm.initials || '?').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <TextField>
                      <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {ts.profile.initials}
                      </Label>
                      <Input
                        className="w-20 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                        value={profileForm.initials}
                        maxLength={2}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, initials: e.target.value.toUpperCase() }))
                        }
                      />
                    </TextField>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{ts.profile.initialsHint}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField>
                    <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {ts.profile.name}
                    </Label>
                    <Input
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </TextField>

                  <TextField>
                    <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {ts.profile.email}
                    </Label>
                    <Input
                      type="email"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </TextField>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    {profileSaved ? ts.saved : ts.save}
                  </Button>
                  <Button
                    type="button"
                    className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors bg-transparent border-0 shadow-none"
                    onPress={() => setShowPassword((v) => !v)}
                  >
                    {ts.profile.changePassword}
                  </Button>
                  {passwordSaved && (
                    <span className="text-xs text-emerald-500 font-medium">{ts.saved}</span>
                  )}
                </div>
              </form>

              {showPassword && (
                <form
                  onSubmit={handleSavePassword}
                  className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col gap-3"
                >
                  {[
                    ['current', ts.profile.currentPassword],
                    ['new', ts.profile.newPassword],
                    ['confirm', ts.profile.confirmPassword],
                  ].map(([field, label]) => (
                    <TextField key={field}>
                      <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {label}
                      </Label>
                      <Input
                        type="password"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                        value={passwordForm[field as keyof typeof passwordForm]}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, [field]: e.target.value }))
                        }
                      />
                    </TextField>
                  ))}
                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      type="submit"
                      className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {ts.profile.updatePassword}
                    </Button>
                    <Button
                      type="button"
                      className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors bg-transparent border-0 shadow-none"
                      onPress={() => setShowPassword(false)}
                    >
                      {ts.profile.cancel}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-5 flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {ts.appearance.title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{ts.appearance.subtitle}</p>
              </div>
              <ToggleButtonGroup
                selectionMode="single"
                selectedKeys={new Set([settings.theme])}
                disallowEmptySelection
                onSelectionChange={(keys) => updateSettings({ theme: String([...keys][0]) })}
                aria-label="Theme"
              >
                <ToggleButton id="light">{ts.appearance.light}</ToggleButton>
                <ToggleButton id="dark">{ts.appearance.dark}</ToggleButton>
              </ToggleButtonGroup>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-5 flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {ts.language.title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{ts.language.subtitle}</p>
              </div>
              <ToggleButtonGroup
                selectionMode="single"
                selectedKeys={new Set([locale])}
                disallowEmptySelection
                onSelectionChange={(keys) => setLocale(String([...keys][0]))}
                aria-label="Language"
              >
                {Object.entries({ en: '🇬🇧 English', uk: '🇺🇦 Українська' }).map(([id, label]) => (
                  <ToggleButton key={id} id={id}>
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </CardContent>
          </Card>

          {/* Dashboard */}
          <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-5 flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {ts.dashboard.title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{ts.dashboard.subtitle}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  {ts.dashboard.chartRangeLabel}
                </p>
                <ToggleButtonGroup
                  selectionMode="single"
                  selectedKeys={new Set([settings.dashboard.chartRange])}
                  disallowEmptySelection
                  onSelectionChange={(keys) =>
                    updateDashboard({ chartRange: String([...keys][0]) })
                  }
                  aria-label="Chart range"
                >
                  <ToggleButton id="week">{ts.dashboard.rangeWeek}</ToggleButton>
                  <ToggleButton id="month">{ts.dashboard.rangeMonth}</ToggleButton>
                  <ToggleButton id="year">{ts.dashboard.rangeYear}</ToggleButton>
                </ToggleButtonGroup>
              </div>

              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  {ts.dashboard.widgetsLabel}
                </p>
                <div className="flex flex-col gap-1.5">
                  {settings.dashboard.widgetOrder.map((id, idx) => {
                    const visible = settings.dashboard.visibleWidgets.includes(id)
                    const isFirst = idx === 0
                    const isLast = idx === settings.dashboard.widgetOrder.length - 1

                    return (
                      <div
                        key={id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
                      >
                        <Switch
                          isSelected={visible}
                          onChange={() => toggleWidget(id)}
                          size="sm"
                          aria-label={(ts.dashboard.widgets as Record<string, string>)[id]}
                        >
                          <SwitchControl>
                            <SwitchThumb />
                          </SwitchControl>
                        </Switch>

                        <span
                          className={`text-xs flex-1 ${
                            visible
                              ? 'text-zinc-700 dark:text-zinc-200'
                              : 'text-zinc-400 dark:text-zinc-500 line-through'
                          }`}
                        >
                          {(ts.dashboard.widgets as Record<string, string>)[id]}
                        </span>

                        <div className="flex flex-col">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            isIconOnly
                            isDisabled={isFirst}
                            onPress={() => moveWidget(id, -1)}
                            aria-label="Move up"
                          >
                            <IconChevronDown className="rotate-180" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            isIconOnly
                            isDisabled={isLast}
                            onPress={() => moveWidget(id, 1)}
                            aria-label="Move down"
                          >
                            <IconChevronDown />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
