class Order {
  constructor({ id, items, delivery, total, status = 'pending', createdAt = new Date() }) {
    this.id = id
    this.items = items
    this.delivery = delivery
    this.total = total
    this.status = status
    this.createdAt = createdAt
  }
}

module.exports = Order
