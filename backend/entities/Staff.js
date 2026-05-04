class Staff {
  constructor({ id, full_name, role, phone, email = '', status, created_at }) {
    this.id = id
    this.full_name = full_name
    this.role = role
    this.phone = phone
    this.email = email
    this.status = status
    this.createdAt = created_at
  }
}

module.exports = Staff
