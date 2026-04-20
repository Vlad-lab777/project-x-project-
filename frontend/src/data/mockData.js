export const stats = [
  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', trend: 'up', icon: '💰' },
  { label: 'Active Users', value: '3,842', change: '+8.1%', trend: 'up', icon: '👥' },
  { label: 'Orders', value: '1,257', change: '-2.4%', trend: 'down', icon: '📦' },
  { label: 'Conversion', value: '4.63%', change: '+0.8%', trend: 'up', icon: '📈' },
]

export const recentOrders = [
  { id: '#4821', customer: 'Alice Johnson', product: 'Pro Plan', amount: '$99', status: 'paid' },
  {
    id: '#4820',
    customer: 'Bob Martinez',
    product: 'Starter Plan',
    amount: '$29',
    status: 'pending',
  },
  { id: '#4819', customer: 'Carol White', product: 'Enterprise', amount: '$499', status: 'paid' },
  { id: '#4818', customer: 'David Lee', product: 'Pro Plan', amount: '$99', status: 'failed' },
  { id: '#4817', customer: 'Eva Brown', product: 'Starter Plan', amount: '$29', status: 'paid' },
]

export const topProducts = [
  { name: 'Pro Plan', sales: 542, revenue: '$53,658', progress: 85 },
  { name: 'Enterprise', sales: 128, revenue: '$63,872', progress: 72 },
  { name: 'Starter Plan', sales: 874, revenue: '$25,346', progress: 60 },
  { name: 'Add-ons', sales: 213, revenue: '$8,520', progress: 35 },
]

export const activityFeed = [
  { user: 'Alice J.', action: 'upgraded to Pro Plan', time: '2m ago', avatar: 'AJ' },
  { user: 'System', action: 'backup completed successfully', time: '15m ago', avatar: '🔧' },
  { user: 'Bob M.', action: 'submitted a support ticket', time: '1h ago', avatar: 'BM' },
  { user: 'Carol W.', action: 'renewed Enterprise license', time: '3h ago', avatar: 'CW' },
  { user: 'David L.', action: 'payment failed — retry needed', time: '5h ago', avatar: 'DL' },
]

export const weeklyRevenue = [18, 32, 27, 45, 38, 52, 48]
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
