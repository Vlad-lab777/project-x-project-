class Client {
  constructor({ id, full_name, phone, email = '', city = '', created_at }) {
    this.id = id
    this.fullName = full_name
    this.phone = phone
    this.email = email
    this.city = city
    this.createdAt = created_at
  }
}

module.exports = Client
