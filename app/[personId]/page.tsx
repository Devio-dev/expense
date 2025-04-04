"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { TransactionTable } from "@/components/transaction-table"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { ShareModal } from "@/components/share-modal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle, Calendar, DollarSign, CreditCard, Share2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Define the Person type
interface Person {
  id: string
  name: string
  totalLoaned: number
  totalPaid: number
  balance: number
  status: string
}

// Define the Transaction type
interface Transaction {
  id: string
  type: "Préstamo" | "Pago"
  amount: number
  date: string
  description: string
}

export default function PersonDetail({ params }: { params: { personId: string } }) {
  const router = useRouter()
  const [person, setPerson] = useState<Person | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar datos de la persona y transacciones (solo una vez al inicio)
  useEffect(() => {
    try {
      // Cargar datos de la persona
      const savedPeople = localStorage.getItem("loanTracker_people")
      if (savedPeople) {
        const people: Person[] = JSON.parse(savedPeople)
        const foundPerson = people.find((p) => p.id === params.personId)
        if (foundPerson) {
          setPerson(foundPerson)
        } else {
          router.push("/")
        }
      } else {
        router.push("/")
      }

      // Cargar transacciones
      const savedTransactions = localStorage.getItem(`loanTracker_transactions_${params.personId}`)
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }

      setIsInitialized(true)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      router.push("/")
    }
  }, [params.personId, router])

  // Función para actualizar los totales y guardar cambios
  const updateTotals = useCallback(() => {
    if (!person || !isInitialized) return

    try {
      // Calcular totales
      const totalLoaned = transactions.filter((t) => t.type === "Préstamo").reduce((sum, t) => sum + t.amount, 0)
      const totalPaid = transactions.filter((t) => t.type === "Pago").reduce((sum, t) => sum + t.amount, 0)
      const balance = totalLoaned - totalPaid
      const status = balance <= 0 ? "Pagado" : "Pendiente"

      // Verificar si los totales han cambiado para evitar actualizaciones innecesarias
      if (
        person.totalLoaned === totalLoaned &&
        person.totalPaid === totalPaid &&
        person.balance === balance &&
        person.status === status
      ) {
        return // No hay cambios, salir sin actualizar
      }

      // Actualizar persona
      const updatedPerson = {
        ...person,
        totalLoaned,
        totalPaid,
        balance,
        status,
      }

      // Actualizar en localStorage
      const savedPeople = localStorage.getItem("loanTracker_people")
      if (savedPeople) {
        const people: Person[] = JSON.parse(savedPeople)
        const updatedPeople = people.map((p) => (p.id === params.personId ? updatedPerson : p))
        localStorage.setItem("loanTracker_people", JSON.stringify(updatedPeople))
      }

      // Guardar transacciones
      localStorage.setItem(`loanTracker_transactions_${params.personId}`, JSON.stringify(transactions))

      // Actualizar estado local
      setPerson(updatedPerson)
    } catch (error) {
      console.error("Error al actualizar totales:", error)
    }
  }, [transactions, person, params.personId, isInitialized])

  // Actualizar totales cuando cambian las transacciones
  useEffect(() => {
    if (isInitialized && person && transactions.length > 0) {
      updateTotals()
    }
  }, [transactions, isInitialized, updateTotals, person])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      }

      setTransactions((prev) => [...prev, newTransaction])
      setShowAddTransaction(false)
    } catch (error) {
      console.error("Error al agregar transacción:", error)
    }
  }

  const deleteTransaction = (id: string) => {
    try {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error al eliminar transacción:", error)
    }
  }

  // Calcular próximos pagos programados
  const upcomingPayments = transactions
    .filter(
      (t) => t.type === "Pago" && t.description.toLowerCase().includes("programada") && new Date(t.date) > new Date(),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  const getProgressPercent = () => {
    if (person.totalLoaned === 0) return 0
    return Math.min(100, Math.round((person.totalPaid / person.totalLoaned) * 100))
  }

  // Función para abrir el modal de compartir
  const handleOpenShareModal = () => {
    console.log("Abriendo modal de compartir")
    setShowShareModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800/50 bg-gray-950/50 backdrop-blur-sm p-5">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="mb-4 text-gray-400 hover:text-white hover:bg-gray-800/50 -ml-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Volver</span>
            </Button>

            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-medium text-base mr-3">
                {person.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">{person.name}</h1>
                <span className={`text-xs font-medium ${person.balance > 0 ? "text-amber-400" : "text-green-400"}`}>
                  {person.balance > 0 ? "Pendiente" : "Pagado"}
                </span>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500">Progreso de pago</p>
                <p className="text-xs font-medium text-blue-400">{getProgressPercent()}%</p>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${person.status === "Pagado" ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-blue-600 to-blue-400"}`}
                  style={{ width: `${getProgressPercent()}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Prestado</p>
                  <p className="text-sm font-medium text-blue-400">{formatCurrency(person.totalLoaned)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pagado</p>
                  <p className="text-sm font-medium text-green-400">{formatCurrency(person.totalPaid)}</p>
                </div>
              </div>
            </div>
          </div>

          {upcomingPayments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white mb-3">Próximos Pagos</h3>
              <div className="space-y-2">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-white">{payment.description}</p>
                      <p className="text-xs text-green-400">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(payment.date).toLocaleDateString("es-CL")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => setShowAddTransaction(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Movimiento
            </Button>

            <Button
              onClick={() => setShowShareModal(true)}
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">Movimientos</h2>
              <p className="text-sm text-gray-500">Historial de préstamos y pagos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-4 border border-blue-800/20 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Saldo Pendiente</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(Math.abs(person.balance))}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-400">
                  {person.balance > 0
                    ? `Falta por pagar ${formatCurrency(person.balance)}`
                    : person.balance < 0
                      ? `Sobrepago de ${formatCurrency(Math.abs(person.balance))}`
                      : "Préstamo completamente pagado"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-4 border border-green-800/20 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Último Pago</p>
                    <p className="text-lg font-semibold text-white">
                      {transactions.filter((t) => t.type === "Pago").length > 0
                        ? formatCurrency(
                            transactions
                              .filter((t) => t.type === "Pago" && new Date(t.date) <= new Date())
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.amount || 0,
                          )
                        : "Sin pagos"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-green-400">
                  {transactions.filter((t) => t.type === "Pago").length > 0
                    ? `Realizado el ${new Date(
                        transactions
                          .filter((t) => t.type === "Pago" && new Date(t.date) <= new Date())
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date,
                      ).toLocaleDateString("es-CL")}`
                    : "No hay pagos registrados"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-4 border border-amber-800/20 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Próximo Pago</p>
                    <p className="text-lg font-semibold text-white">
                      {upcomingPayments.length > 0
                        ? formatCurrency(upcomingPayments[0].amount)
                        : "Sin pagos programados"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-amber-400">
                  {upcomingPayments.length > 0
                    ? `Programado para el ${new Date(upcomingPayments[0].date).toLocaleDateString("es-CL")}`
                    : "No hay pagos programados"}
                </p>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/80 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No hay movimientos registrados</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Agrega un préstamo o pago para comenzar a registrar los movimientos.
                </p>
                <Button
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Agregar Movimiento
                </Button>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
                <TransactionTable transactions={transactions} onDelete={deleteTransaction} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar transacción */}
      {showAddTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddTransaction(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 w-full max-w-md shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-4 text-white">Agregar Movimiento</h2>
            <AddTransactionForm
              personId={params.personId}
              onSubmit={addTransaction}
              onCancel={() => setShowAddTransaction(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para compartir */}
      {showShareModal && (
        <ShareModal personId={params.personId} personName={person.name} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  )
}

