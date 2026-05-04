const uk = {
  // Sidebar
  nav: {
    dashboard: 'Панель',
    analytics: 'Аналітика',
    orders: 'Замовлення',
    customers: 'Клієнти',
    products: 'Продукти',
    settings: 'Налаштування',
  },

  // Header
  header: {
    title: 'Панель керування',
    welcome: 'Ласкаво просимо, Адмін',
    search: '🔍 Пошук...',
    newOrder: '+ Нове замовлення',
  },

  // Stat Cards
  stats: {
    vsLastMonth: 'від минулого місяця',
    totalRevenue: 'Загальний дохід',
    activeUsers: 'Активні користувачі',
    orders: 'Замовлення',
    conversion: 'Конверсія',
  },

  // Activity actions
  activityActions: {
    upgradedToPro: 'перейшов на Pro Plan',
    backupCompleted: 'резервне копіювання завершено',
    submittedTicket: 'відправив запит до підтримки',
    renewedLicense: 'оновив ліцензію Enterprise',
    paymentFailed: 'помилка оплати — потрібна повторна спроба',
    placedOrder: 'оформив замовлення',
  },

  // Revenue Chart
  revenueChart: {
    title: 'Тижневий дохід',
    subtitle: 'Останні 7 днів',
    badge: 'Цей тиждень',
    total: 'Всього: $48,295',
    growth: '▲ 12.5% порівняно з минулим тижнем',
  },

  // Orders Table
  ordersTable: {
    title: 'Останні замовлення',
    subtitle: 'Останні 5 транзакцій',
    viewAll: 'Переглянути всі →',
    columns: {
      order: 'Замовлення',
      customer: 'Клієнт',
      product: 'Продукт',
      amount: 'Сума',
      status: 'Статус',
    },
    status: {
      paid: 'сплачено',
      pending: 'очікує',
      failed: 'помилка',
    },
  },

  // Top Products
  topProducts: {
    title: 'Топ продукти',
    subtitle: 'За часткою доходу',
    salesUnit: 'продажів',
  },

  // Activity Feed
  activityFeed: {
    title: 'Активність',
    subtitle: 'Останні події',
  },

  // Products
  products: {
    tabs: {
      list: 'Продукти',
      create: 'Створити',
    },
    list: {
      title: 'Всі продукти',
      subtitle: 'Управління каталогом продуктів',
      total: 'позицій',
    },
    create: {
      hint: 'Додайте новий продукт до каталогу',
      button: '+ Створити продукт',
    },
    columns: {
      id: 'ID',
      name: 'Назва',
      category: 'Категорія',
      price: 'Ціна',
      stock: 'Запас',
      status: 'Статус',
    },
    status: {
      active: 'активний',
      low_stock: 'мало',
      out_of_stock: 'немає',
    },
    modal: {
      title: 'Створити продукт',
      name: 'Назва продукту',
      namePlaceholder: 'напр. Бездротові навушники',
      category: 'Категорія',
      categoryPlaceholder: 'Оберіть категорію',
      price: 'Ціна ($)',
      stock: 'Кількість',
      description: 'Опис',
      descriptionPlaceholder: 'Необовʼязковий опис...',
      submit: 'Створити',
      cancel: 'Скасувати',
    },
    categories: ['Електроніка', 'Спорт', 'Кухня', 'Одяг', 'Книги', 'Інше'],
  },

  // Order
  order: {
    title: 'Нове замовлення',
    subtitle: 'Оберіть товари та вкажіть дані доставки',
    products: {
      title: 'Товари',
      subtitle: 'Оберіть товари для замовлення',
      selected: 'Обрано',
      total: 'Сума',
      noSelected: 'Оберіть хоча б один товар',
    },
    form: {
      title: 'Дані доставки',
      fullName: 'ПІБ',
      fullNamePlaceholder: 'Прізвище Імʼя По-батькові',
      phone: 'Номер телефону',
      phonePlaceholder: '+38 (0XX) XXX-XX-XX',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      optional: 'необовʼязково',
      city: 'Місто',
      cityPlaceholder: 'напр. Київ',
      postBranch: 'Відділення пошти',
      postBranchPlaceholder: 'напр. Нова Пошта №1',
      required: 'Обовʼязкове поле',
      invalidPhone: 'Введіть коректний номер телефону',
      invalidEmail: 'Введіть коректний email',
      invalidFullName: 'Введіть прізвище та імʼя',
      submit: 'Оформити замовлення',
      success: 'Замовлення прийнято!',
      successMessage: 'Ми звʼяжемося з вами найближчим часом.',
      newOrder: 'Нове замовлення',
    },
  },

  // Clients
  clients: {
    title: 'Клієнти',
    subtitle: 'Управління базою клієнтів',
    total: 'клієнтів',
    add: '+ Додати клієнта',
    empty: 'Клієнтів ще немає',
    columns: {
      id: 'ID',
      fullName: 'ПІБ',
      phone: 'Телефон',
      email: 'Email',
      city: 'Місто',
    },
    modal: {
      titleAdd: 'Додати клієнта',
      titleEdit: 'Редагувати клієнта',
      fullName: 'ПІБ',
      fullNamePlaceholder: 'Прізвище Імʼя По-батькові',
      phone: 'Телефон',
      phonePlaceholder: '+38 (0XX) XXX-XX-XX',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      city: 'Місто',
      cityPlaceholder: 'напр. Київ',
      submit: 'Зберегти',
      cancel: 'Скасувати',
    },
  },

  // Login
  login: {
    title: 'Вхід',
    subtitle: 'Увійдіть до панелі керування',
    email: 'Email',
    emailPlaceholder: 'example@email.com',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    submit: 'Увійти',
    invalid: 'Невірний email або пароль',
    emailRequired: "Email обов'язковий",
    passwordRequired: "Пароль обов'язковий",
  },

  // Settings
  settings: {
    title: 'Налаштування',
    subtitle: 'Керуйте обліковим записом та вподобаннями',
    save: 'Зберегти зміни',
    saved: 'Збережено!',
    tabs: {
      general: 'Загальні',
      staff: 'Персонал',
    },
    staff: {
      title: 'Управління персоналом',
      subtitle: 'Додавайте, редагуйте та видаляйте співробітників',
      total: 'співробітників',
      add: '+ Додати співробітника',
      empty: 'Співробітників ще немає',
      columns: {
        fullName: 'ПІБ',
        role: 'Роль',
        phone: 'Телефон',
        email: 'Email',
        status: 'Статус',
      },
      roles: {
        seller: 'Продавець',
        manager: 'Менеджер',
        admin: 'Адмін',
      },
      status: {
        active: 'Активний',
        inactive: 'Неактивний',
      },
      modal: {
        titleAdd: 'Додати співробітника',
        titleEdit: 'Редагувати співробітника',
        fullName: 'ПІБ',
        fullNamePlaceholder: 'Прізвище Імʼя По-батькові',
        role: 'Роль',
        phone: 'Телефон',
        phonePlaceholder: '+38 (0XX) XXX-XX-XX',
        email: 'Email',
        emailPlaceholder: 'example@email.com',
        status: 'Статус',
        avatar: 'Фото',
        avatarHint: 'JPG, PNG до 2 МБ',
        password: 'Пароль',
        passwordPlaceholder: '••••••••',
        confirmPassword: 'Підтвердження пароля',
        confirmPasswordPlaceholder: '••••••••',
        passwordHint: 'Залиште порожнім, щоб не змінювати',
        submit: 'Зберегти',
        cancel: 'Скасувати',
      },
      errors: {
        fullNameRequired: "ПІБ обов'язкове поле",
        fullNameMin: "Введіть мінімум прізвище та ім'я",
        fullNameInvalid: 'ПІБ може містити лише літери, пробіли та дефіс',
        phoneRequired: "Телефон обов'язкове поле",
        phoneInvalid: 'Введіть коректний номер телефону',
        emailRequired: "Email обов'язковий",
        emailInvalid: 'Введіть коректний email',
        passwordRequired: "Пароль обов'язковий при створенні",
        passwordMin: 'Пароль мінімум 6 символів',
        passwordMismatch: 'Паролі не співпадають',
      },
      deleteConfirm: 'Ви впевнені, що хочете видалити цього співробітника?',
    },
    profile: {
      title: 'Профіль',
      subtitle: 'Ваша особиста інформація',
      name: "Повне ім'я",
      email: 'Email адреса',
      initials: 'Ініціали аватара',
      initialsHint: 'Відображається в сайдбарі (макс. 2 символи)',
      changePassword: 'Змінити пароль',
      currentPassword: 'Поточний пароль',
      newPassword: 'Новий пароль',
      confirmPassword: 'Підтвердіть пароль',
      updatePassword: 'Оновити пароль',
      cancel: 'Скасувати',
    },
    appearance: {
      title: 'Зовнішній вигляд',
      subtitle: 'Налаштування теми',
      light: '☀️ Світла',
      dark: '🌙 Темна',
    },
    language: {
      title: 'Мова',
      subtitle: 'Мова інтерфейсу',
    },
    dashboard: {
      title: 'Дашборд',
      subtitle: 'Налаштуйте дашборд',
      widgetsLabel: 'Віджети та порядок',
      chartRangeLabel: 'Діапазон графіку за замовчуванням',
      rangeWeek: 'Тиждень',
      rangeMonth: 'Місяць',
      rangeYear: 'Рік',
      widgets: {
        stats: 'Картки статистики',
        revenueChart: 'Графік доходу',
        topProducts: 'Топ продукти',
        ordersTable: 'Останні замовлення',
        activityFeed: 'Стрічка активності',
      },
    },
  },
}

export default uk
