class OrderItem {
  constructor({ productId, name, price, quantity }) {
    this.productId = productId
    this.name = name
    this.price = price
    this.quantity = quantity
    this.subtotal = price * quantity
  }
}

module.exports = OrderItem
