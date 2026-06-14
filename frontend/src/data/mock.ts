import type { Client, Car, Service, Booking, Review } from '../types'

export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Олексій Петренко', phone: '+38 (067) 123-45-67', email: 'petrenk@gmail.com', initials: 'ОП' },
  { id: 'c2', name: 'Марія Коваленко', phone: '+38 (050) 987-65-43', email: 'm.kovalenko@ukr.net', initials: 'МК' },
  { id: 'c3', name: 'Дмитро Сидоренко', phone: '+38 (073) 456-78-90', email: 'dsydorenko@gmail.com', initials: 'ДС' },
  { id: 'c4', name: 'Анна Мельник', phone: '+38 (063) 321-09-87', email: 'anna.melnyk@ukr.net', initials: 'АМ' },
  { id: 'c5', name: 'Ігор Бондаренко', phone: '+38 (096) 654-32-10', email: 'bondar.igor@gmail.com', initials: 'ІБ' },
  { id: 'c6', name: 'Тетяна Шевченко', phone: '+38 (068) 789-01-23', email: 'tshevchenko@gmail.com', initials: 'ТШ' },
]

export const CARS: Car[] = [
  { id: 'v1', clientId: 'c1', brand: 'BMW', model: 'X5', year: 2022, color: 'Чорний', plate: 'AA 1234 BB' },
  { id: 'v2', clientId: 'c2', brand: 'Mercedes-Benz', model: 'C200', year: 2021, color: 'Срібний', plate: 'KA 5678 CD' },
  { id: 'v3', clientId: 'c3', brand: 'Toyota', model: 'Camry', year: 2020, color: 'Білий', plate: 'AX 9012 EF' },
  { id: 'v4', clientId: 'c4', brand: 'Audi', model: 'A6', year: 2023, color: 'Синій', plate: 'KX 3456 GH' },
  { id: 'v5', clientId: 'c5', brand: 'Porsche', model: 'Cayenne', year: 2022, color: 'Сірий', plate: 'AA 7890 IJ' },
  { id: 'v6', clientId: 'c6', brand: 'Volvo', model: 'XC90', year: 2021, color: 'Білий', plate: 'KA 2345 KL' },
]

export const SERVICES: Service[] = [
  {
    id: 's1', name: 'Комплексна мийка', category: 'wash',
    description: 'Зовнішня мийка кузова, чищення дисків та арок, сушіння та поліролення скла.',
    duration: 90, price: 20, priceLabel: '20$', gradient: 'from-sky-500 to-cyan-500', icon: '💧', active: true,
  },
  {
    id: 's2', name: 'Хімчистка салону', category: 'dry-cleaning',
    description: 'Глибоке очищення всіх поверхонь салону: сидінь, килимів, стелі, дверних карт.',
    duration: 240, price: 80, priceLabel: '80-150$', gradient: 'from-purple-500 to-violet-600', icon: '🧹', active: true,
  },
  {
    id: 's3', name: 'Полірування кузова', category: 'polish',
    description: 'Усунення подряпин, вихрів та оксидації. Відновлення блиску лакофарбового покриття.',
    duration: 480, price: 170, priceLabel: '170-250$', gradient: 'from-amber-400 to-orange-500', icon: '✨', active: true,
  },
  {
    id: 's4', name: 'Керамічне покриття', category: 'ceramic',
    description: 'Нанесення керамічного захисного покриття. Захист від хімічних впливів і UV-випромінювання.',
    duration: 600, price: 350, priceLabel: '350$', gradient: 'from-blue-500 to-indigo-600', icon: '🔷', active: true,
  },
  {
    id: 's5', name: 'Мийка двигуна', category: 'wash',
    description: 'Безпечне очищення підкапотного простору з використанням спеціальних засобів.',
    duration: 60, price: 20, priceLabel: '20$', gradient: 'from-teal-500 to-emerald-500', icon: '⚙️', active: true,
  },
  {
    id: 's6', name: 'Преміум детейлінг', category: 'detailing',
    description: 'Повний цикл відновлення та захисту: мийка, полірування, керамічне покриття, хімчистка.',
    duration: 720, price: 400, priceLabel: '400$', gradient: 'from-rose-500 to-pink-600', icon: '🏆', active: true,
  },
  {
    id: 's7', name: 'Відновлення оптики', category: 'polish',
    description: 'Полірування та відновлення фар: усунення помутніння, жовтизни та подряпин. Повертаємо прозорість і яскравість світла.',
    duration: 120, price: 30, priceLabel: '30$', gradient: 'from-indigo-500 to-blue-600', icon: '💡', active: true,
  },
  {
    id: 's8', name: 'Хімчистка сидінь', category: 'dry-cleaning',
    description: 'Видалення плям, запахів та бактерій. Шкіра, тканина, алькантара.',
    duration: 180, price: 50, priceLabel: '50$', gradient: 'from-fuchsia-500 to-purple-600', icon: '🪑', active: true,
  },
]

export const BOOKINGS: Booking[] = [
  { id: 'b1',  clientId: 'c1', carId: 'v1', serviceId: 's4', date: '2026-05-02', time: '09:00', status: 'completed', price: 15000, createdAt: '2026-04-28T10:00:00Z' },
  { id: 'b2',  clientId: 'c2', carId: 'v2', serviceId: 's2', date: '2026-05-03', time: '10:00', status: 'completed', price: 3500,  createdAt: '2026-04-30T11:00:00Z' },
  { id: 'b3',  clientId: 'c3', carId: 'v3', serviceId: 's1', date: '2026-05-05', time: '09:30', status: 'confirmed', price: 800,   createdAt: '2026-05-01T09:00:00Z' },
  { id: 'b4',  clientId: 'c4', carId: 'v4', serviceId: 's3', date: '2026-05-05', time: '11:00', status: 'in-progress', price: 6000, createdAt: '2026-05-02T14:00:00Z' },
  { id: 'b5',  clientId: 'c5', carId: 'v5', serviceId: 's6', date: '2026-05-06', time: '09:00', status: 'confirmed', price: 22000, createdAt: '2026-05-03T08:00:00Z' },
  { id: 'b6',  clientId: 'c6', carId: 'v6', serviceId: 's1', date: '2026-05-06', time: '14:00', status: 'pending',   price: 800,   createdAt: '2026-05-04T16:00:00Z' },
  { id: 'b7',  clientId: 'c1', carId: 'v1', serviceId: 's5', date: '2026-05-07', time: '10:00', status: 'pending',   price: 600,   createdAt: '2026-05-04T17:00:00Z' },
  { id: 'b8',  clientId: 'c2', carId: 'v2', serviceId: 's7', date: '2026-05-08', time: '09:00', status: 'confirmed', price: 12000, createdAt: '2026-05-04T18:00:00Z' },
  { id: 'b9',  clientId: 'c3', carId: 'v3', serviceId: 's8', date: '2026-05-09', time: '11:00', status: 'confirmed', price: 2500,  createdAt: '2026-05-05T09:00:00Z' },
  { id: 'b10', clientId: 'c4', carId: 'v4', serviceId: 's2', date: '2026-05-10', time: '10:00', status: 'pending',   price: 3500,  createdAt: '2026-05-05T10:00:00Z' },
  { id: 'b11', clientId: 'c5', carId: 'v5', serviceId: 's3', date: '2026-05-12', time: '09:00', status: 'confirmed', price: 6000,  createdAt: '2026-05-05T11:00:00Z' },
  { id: 'b12', clientId: 'c6', carId: 'v6', serviceId: 's4', date: '2026-05-14', time: '09:00', status: 'confirmed', price: 15000, createdAt: '2026-05-05T12:00:00Z' },
  { id: 'b13', clientId: 'c1', carId: 'v1', serviceId: 's1', date: '2026-04-28', time: '10:00', status: 'completed', price: 800,   createdAt: '2026-04-25T09:00:00Z', notes: 'Прохання бути особливо уважним до дисків' },
  { id: 'b14', clientId: 'c2', carId: 'v2', serviceId: 's6', date: '2026-04-20', time: '09:00', status: 'completed', price: 22000, createdAt: '2026-04-15T10:00:00Z' },
  { id: 'b15', clientId: 'c3', carId: 'v3', serviceId: 's3', date: '2026-04-15', time: '10:00', status: 'cancelled', price: 6000,  createdAt: '2026-04-10T11:00:00Z', notes: 'Скасовано клієнтом' },
]

export const REVIEWS: Review[] = [
  { id: 'r1', clientId: 'c1', bookingId: 'b1',  rating: 5, text: 'Керамічне покриття нанесли ідеально! BMW виглядає як нова. Блиск тримається вже 3 місяці — жодної подряпини. Дуже задоволений результатом.',        createdAt: '2026-05-03T10:00:00Z', reply: 'Дякуємо, Олексію! Раді, що ви задоволені результатом. Чекаємо вас знову!' },
  { id: 'r2', clientId: 'c2', bookingId: 'b2',  rating: 5, text: 'Хімчистка салону перевершила всі очікування. Виводили плями, яким вже 2 роки — всі зникли. Запах свіжості — неймовірний. Рекомендую всім!',            createdAt: '2026-05-04T14:00:00Z' },
  { id: 'r3', clientId: 'c3', bookingId: 'b13', rating: 4, text: 'Мийка якісна, диски виблискують. Трохи довше чекав ніж очікував, але результат того вартий. Обов\'язково приїду ще.',                                     createdAt: '2026-04-29T11:00:00Z', reply: 'Дякуємо за відгук! Працюємо над прискоренням процесу.' },
  { id: 'r4', clientId: 'c4', bookingId: 'b4',  rating: 5, text: 'Полірування кузова — top! Audi виглядає краще, ніж коли я її купив. Майстри — справжні профі. Вже записався на керамічне покриття.',                         createdAt: '2026-05-05T09:00:00Z' },
  { id: 'r5', clientId: 'c5', bookingId: 'b14', rating: 5, text: 'Преміум детейлінг — це інший рівень. Порш виглядає як зі салону. Кожна деталь опрацьована бездоганно. Однозначно найкраща студія в місті!',                   createdAt: '2026-04-22T15:00:00Z', reply: 'Ігорю, дуже приємно це чути! Завжди раді бачити вас у нас.' },
  { id: 'r6', clientId: 'c6', bookingId: 'b12', rating: 4, text: 'Перший раз у цій студії — дуже приємне враження. Ввічливий персонал, чисто, акуратно. XC90 блищить. Повернусь на хімчистку.',                                 createdAt: '2026-05-05T16:00:00Z' },
  { id: 'r7', clientId: 'c2', bookingId: 'b8',  rating: 5, text: 'Відновлення оптики — супер! Фари були мутні й жовті, стали як нові, світло яскравіше. Майстри пояснили весь процес. Дуже професійний підхід.',                              createdAt: '2026-05-09T12:00:00Z' },
  { id: 'r8', clientId: 'c1', bookingId: 'b7',  rating: 3, text: 'Мийка двигуна зроблена добре, але хотілось би більш детального підходу до важкодоступних місць. Загалом задоволений, але є куди рости.',                         createdAt: '2026-05-08T10:00:00Z', reply: 'Дякуємо за чесний відгук! Врахуємо ваші побажання.' },
]
