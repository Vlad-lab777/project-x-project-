class Product {
  constructor({ id, name, category, price, stock, description = '' }) {
    this.id = id
    this.name = name
    this.category = category
    this.price = price
    this.stock = stock
    this.description = description
    this.status = Product.resolveStatus(stock)
  }

  static resolveStatus(stock) {
    if (stock === 0) return 'out_of_stock'
    if (stock < 15) return 'low_stock'
    return 'active'
  }
}

module.exports = Product
