import { useState } from 'react'
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

const LOCALE_LABELS = {
  en: '🇬🇧 English',
  uk: '🇺🇦 Українська',
}

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const { settings, updateSettings, updateProfile, updateDashboard } = useSettings()
  const ts = t.settings

  const [profileForm, setProfileForm] = useState({
    name: settings.profile.name,
    email: settings.profile.email,
    initials: settings.profile.initials,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  function flash(setter) {
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  function handleSaveProfile(e) {
    e.preventDefault()
    updateProfile(profileForm)
    flash(setProfileSaved)
  }

  function handleSavePassword(e) {
    e.preventDefault()
    setPasswordForm({ current: '', new: '', confirm: '' })
    setShowPassword(false)
    flash(setPasswordSaved)
  }

  function toggleWidget(id) {
    const { visibleWidgets } = settings.dashboard
    const next = visibleWidgets.includes(id)
      ? visibleWidgets.filter((w) => w !== id)
      : [...visibleWidgets, id]
    if (next.length === 0) return
    updateDashboard({ visibleWidgets: next })
  }

  function moveWidget(id, dir) {
    const order = [...settings.dashboard.widgetOrder]
    const idx = order.indexOf(id)
    const target = idx + dir
    if (target < 0 || target >= order.length) return
    ;[order[idx], order[target]] = [order[target], order[idx]]
    updateDashboard({ widgetOrder: order })
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-2xl flex flex-col gap-4">
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
                    value={passwordForm[field]}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, [field]: e.target.value }))}
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
            onSelectionChange={(keys) => updateSettings({ theme: [...keys][0] })}
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
            onSelectionChange={(keys) => setLocale([...keys][0])}
            aria-label="Language"
          >
            {Object.entries(LOCALE_LABELS).map(([id, label]) => (
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
              onSelectionChange={(keys) => updateDashboard({ chartRange: [...keys][0] })}
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
                      aria-label={ts.dashboard.widgets[id]}
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
                      {ts.dashboard.widgets[id]}
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
    </div>
  )
}
