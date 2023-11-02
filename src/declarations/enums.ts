enum PaymentMethod {
  CASH = 'cash',
  BANK_CARD = 'bank-card',
}

enum OrderType {
  TAKEAWAY = 'takeaway',
  DELIVERY = 'delivery',
}

enum OrderStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  COOKING = 'cooking',
  DELIVERING = 'delivering',
  WAITING = 'waiting',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export { PaymentMethod, OrderType, OrderStatus };