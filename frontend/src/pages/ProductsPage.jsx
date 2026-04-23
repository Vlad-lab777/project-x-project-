import { useState } from 'react'
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
  Chip,
  Button,
} from '@heroui/react'
import { useI18n } from '../i18n/context'

const INITIAL_PRODUCTS = [
  {
    id: 'PRD-001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: '$149.99',
    stock: 45,
    status: 'active',
  },
  {
    id: 'PRD-002',
    name: 'Running Shoes',
    category: 'Sports',
    price: '$89.99',
    stock: 128,
    status: 'active',
  },
  {
    id: 'PRD-003',
    name: 'Coffee Maker',
    category: 'Kitchen',
    price: '$59.99',
    stock: 12,
    status: 'low_stock',
  },
  {
    id: 'PRD-004',
    name: 'Yoga Mat',
    category: 'Sports',
    price: '$34.99',
    stock: 0,
    status: 'out_of_stock',
  },
  {
    id: 'PRD-005',
    name: 'Smart Watch',
    category: 'Electronics',
    price: '$299.99',
    stock: 67,
    status: 'active',
  },
]

const EMPTY_FORM = { name: '', category: '', price: '', stock: '', description: '' }

const statusColor = {
  active: 'success',
  low_stock: 'warning',
  out_of_stock: 'danger',
}

export default function ProductsPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('list')
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function handleSubmit(e) {
    e.preventDefault()
    const stock = parseInt(form.stock, 10)
    const status = stock === 0 ? 'out_of_stock' : stock < 15 ? 'low_stock' : 'active'
    setProducts([
      ...products,
      {
        id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
        name: form.name,
        category: form.category,
        price: `$${parseFloat(form.price).toFixed(2)}`,
        stock,
        status,
      },
    ])
    setForm(EMPTY_FORM)
    setShowModal(false)
    setActiveTab('list')
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-800">
        {['list', 'create'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-violet-600 text-violet-700 dark:text-violet-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {t.products.tabs[tab]}
          </button>
        ))}
      </div>

      {/* Tab: List */}
      {activeTab === 'list' && (
        <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <CardHeader className="px-5 pt-6 pb-0 flex flex-col items-center text-center gap-1">
            <p className="text-base font-semibold text-zinc-900 dark:text-white">
              {t.products.list.title}
            </p>
            <p className="text-xs text-zinc-400">{t.products.list.subtitle}</p>
            <span className="text-xs text-zinc-400">
              {products.length} {t.products.list.total}
            </span>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <Table className="mt-2">
              <TableContent aria-label={t.products.list.title}>
                <TableHeader>
                  <TableColumn isRowHeader className="text-xs text-zinc-400 font-medium uppercase">
                    {t.products.columns.id}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {t.products.columns.name}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {t.products.columns.category}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {t.products.columns.price}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {t.products.columns.stock}
                  </TableColumn>
                  <TableColumn className="text-xs text-zinc-400 font-medium uppercase">
                    {t.products.columns.status}
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id} id={p.id}>
                      <TableCell className="text-xs font-mono text-zinc-500">{p.id}</TableCell>
                      <TableCell className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        {p.name}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">{p.category}</TableCell>
                      <TableCell className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {p.price}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">{p.stock}</TableCell>
                      <TableCell>
                        <Chip size="sm" color={statusColor[p.status]} variant="flat">
                          {t.products.status[p.status]}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableContent>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tab: Create */}
      {activeTab === 'create' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-5xl">📦</div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.products.create.hint}</p>
          <Button
            onPress={() => setShowModal(true)}
            className="bg-violet-600 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            {t.products.create.button}
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                {t.products.modal.title}
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
                  {t.products.modal.name} *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t.products.modal.namePlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {t.products.modal.category} *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="">{t.products.modal.categoryPlaceholder}</option>
                  {t.products.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {t.products.modal.price} *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    {t.products.modal.stock} *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {t.products.modal.description}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder={t.products.modal.descriptionPlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {t.products.modal.cancel}
                </button>
                <button
                  type="submit"
                  className="text-sm px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
                >
                  {t.products.modal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
