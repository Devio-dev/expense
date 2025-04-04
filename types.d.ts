interface Person {
  id: string
  name: string
  totalLoaned: number
  totalPaid: number
  balance: number
  status: "Pagado" | "Pendiente"
}

interface Transaction {
  id: string
  personId: string
  type: "Préstamo" | "Pago"
  amount: number
  description: string
  date: string
}

