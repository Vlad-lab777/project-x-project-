const en = {
  // Sidebar
  nav: {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    orders: 'Orders',
    customers: 'Customers',
    products: 'Products',
    settings: 'Settings',
  },

  // Header
  header: {
    title: 'Dashboard',
    welcome: 'Welcome back, Admin',
    search: '🔍 Search...',
    newOrder: '+ New Order',
  },

  // Stat Cards
  stats: {
    vsLastMonth: 'since last month',
    totalRevenue: 'Total Revenue',
    activeUsers: 'Active Users',
    orders: 'Orders',
    conversion: 'Conversion',
  },

  // Activity actions
  activityActions: {
    upgradedToPro: 'upgraded to Pro Plan',
    backupCompleted: 'backup completed successfully',
    submittedTicket: 'submitted a support ticket',
    renewedLicense: 'renewed Enterprise license',
    paymentFailed: 'payment failed — retry needed',
  },

  // Revenue Chart
  revenueChart: {
    title: 'Weekly Revenue',
    subtitle: 'Last 7 days',
    badge: 'This week',
    total: 'Total: $48,295',
    growth: '▲ 12.5% from last week',
  },

  // Orders Table
  ordersTable: {
    title: 'Recent Orders',
    subtitle: 'Latest 5 transactions',
    viewAll: 'View all →',
    columns: {
      order: 'Order',
      customer: 'Customer',
      product: 'Product',
      amount: 'Amount',
      status: 'Status',
    },
    status: {
      paid: 'paid',
      pending: 'pending',
      failed: 'failed',
    },
  },

  // Top Products
  topProducts: {
    title: 'Top Products',
    subtitle: 'By revenue share',
    salesUnit: 'sales',
  },

  // Activity Feed
  activityFeed: {
    title: 'Activity',
    subtitle: 'Recent events',
  },

  // Products
  products: {
    tabs: {
      list: 'Products',
      create: 'Create',
    },
    list: {
      title: 'All Products',
      subtitle: 'Manage your product catalog',
      total: 'items',
    },
    create: {
      hint: 'Add a new product to your catalog',
      button: '+ Create Product',
    },
    columns: {
      id: 'ID',
      name: 'Name',
      category: 'Category',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
    },
    status: {
      active: 'active',
      low_stock: 'low stock',
      out_of_stock: 'out of stock',
    },
    modal: {
      title: 'Create Product',
      name: 'Product Name',
      namePlaceholder: 'e.g. Wireless Headphones',
      category: 'Category',
      categoryPlaceholder: 'Select category',
      price: 'Price ($)',
      stock: 'Stock',
      description: 'Description',
      descriptionPlaceholder: 'Optional description...',
      submit: 'Create',
      cancel: 'Cancel',
    },
    categories: ['Electronics', 'Sports', 'Kitchen', 'Clothing', 'Books', 'Other'],
  },

  // Order
  order: {
    title: 'New Order',
    subtitle: 'Select products and fill in delivery details',
    products: {
      title: 'Products',
      subtitle: 'Select products for your order',
      selected: 'Selected',
      total: 'Total',
      noSelected: 'Please select at least one product',
    },
    form: {
      title: 'Delivery Details',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Last First Middle name',
      phone: 'Phone Number',
      phonePlaceholder: '+38 (0XX) XXX-XX-XX',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      optional: 'optional',
      city: 'City',
      cityPlaceholder: 'e.g. Kyiv',
      postBranch: 'Post Office Branch',
      postBranchPlaceholder: 'e.g. Nova Poshta #1',
      required: 'Required field',
      invalidPhone: 'Enter a valid phone number',
      invalidEmail: 'Enter a valid email',
      invalidFullName: 'Enter last name and first name',
      submit: 'Place Order',
      success: 'Order placed!',
      successMessage: 'We will contact you shortly.',
      newOrder: 'New Order',
    },
  },

  // Settings
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account and preferences',
    save: 'Save changes',
    saved: 'Saved!',
    profile: {
      title: 'Profile',
      subtitle: 'Your personal information',
      name: 'Full name',
      email: 'Email address',
      initials: 'Avatar initials',
      initialsHint: 'Shown in sidebar (2 chars max)',
      changePassword: 'Change password',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      updatePassword: 'Update password',
      cancel: 'Cancel',
    },
    appearance: {
      title: 'Appearance',
      subtitle: 'Theme preferences',
      light: '☀️ Light',
      dark: '🌙 Dark',
    },
    language: {
      title: 'Language',
      subtitle: 'Display language',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Customize your dashboard',
      widgetsLabel: 'Widgets & order',
      chartRangeLabel: 'Default chart range',
      rangeWeek: 'Week',
      rangeMonth: 'Month',
      rangeYear: 'Year',
      widgets: {
        stats: 'Statistics cards',
        revenueChart: 'Revenue chart',
        topProducts: 'Top products',
        ordersTable: 'Recent orders',
        activityFeed: 'Activity feed',
      },
    },
  },
}

export default en
