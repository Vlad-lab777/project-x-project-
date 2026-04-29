import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react'
import { useI18n } from '../i18n/context'
import ConfirmModal from '../components/ConfirmModal'

const EMPTY_FORM = { full_name: '', phone: '', email: '', city: '' }

export default function ClientsPage() {
  const { t } = useI18n()
  const c = t.clients
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editClient, setEditClient] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/clients')
      .then((r) => r.json())
      .then(setClients)
  }, [])

  function openAdd() {
    setEditClient(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(client) {
    setEditClient(client)
    setForm({
      full_name: client.full_name,
      phone: client.phone,
      email: client.email || '',
      city: client.city || '',
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editClient) {
      const res = await fetch(`http://localhost:3000/api/clients/${editClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const updated = await res.json()
      setClients(clients.map((c) => (c.id === updated.id ? updated : c)))
    } else {
      const res = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const created = await res.json()
      setClients([created, ...clients])
    }
    setShowModal(false)
    setForm(EMPTY_FORM)
    setEditClient(null)
  }

  async function handleDelete() {
    await fetch(`http://localhost:3000/api/clients/${deleteId}`, { method: 'DELETE' })
    setClients(clients.filter((c) => c.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6">
      <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <CardHeader className="px-5 pt-6 pb-0 flex flex-col items-center text-center gap-1">
          <p className="text-base font-semibold text-zinc-900 dark:text-white">{c.title}</p>
          <p className="text-xs text-zinc-400">{c.subtitle}</p>
          <span className="text-xs text-zinc-400">
            {clients.length} {c.total}
          </span>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex justify-end mt-4 mb-2">
            <button
              onClick={openAdd}
              className="bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              {c.add}
            </button>
          </div>

          {clients.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">{c.empty}</p>
          ) : (
            <Table className="mt-2">
              <TableContent aria-label={c.title}>
                <TableHeader>
                  <TableColumn isRowHeader className="text-xs text-zinc-400 font-medium uppercase">
                    {c.columns.id}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {c.columns.fullName}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {c.columns.phone}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {c.columns.email}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {c.columns.city}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase w-16" />
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} id={client.id}>
                      <TableCell className="text-xs font-mono text-zinc-500">{client.id}</TableCell>
                      <TableCell className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        {client.full_name}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">{client.phone}</TableCell>
                      <TableCell className="text-xs text-zinc-500">{client.email || '—'}</TableCell>
                      <TableCell className="text-xs text-zinc-500">{client.city || '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(client)}
                            className="text-zinc-400 hover:text-violet-500 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
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
                            onClick={() => setDeleteId(client.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableContent>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                {editClient ? c.modal.titleEdit : c.modal.titleAdd}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {c.modal.fullName} *
                </label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder={c.modal.fullNamePlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {c.modal.phone} *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={c.modal.phonePlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {c.modal.email}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={c.modal.emailPlaceholder}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {c.modal.city}
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder={c.modal.cityPlaceholder}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {c.modal.cancel}
                </button>
                <button
                  type="submit"
                  className="text-sm px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
                >
                  {c.modal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          message="Ви впевнені, що хочете видалити цього клієнта?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
