"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

interface Person {
  id: string
  name: string
  totalLoaned: number
  totalPaid: number
  balance: number
  status: string
}

interface Transaction {
  id: string
  type: "Préstamo" | "Pago"
  amount: number
  date: string
  description: string
}

// Datos de ejemplo para cuando se accede desde otro dispositivo
const examplePersonData: Record<string, Person> = {
  "1": {
    id: "1",
    name: "Carlos Rodríguez",
    totalLoaned: 150000,
    totalPaid: 50000,
    balance: 100000,
    status: "Pendiente",
  },
  "2": {
    id: "2",
    name: "María González",
    totalLoaned: 75000,
    totalPaid: 75000,
    balance: 0,
    status: "Pagado",
  },
  "3": {
    id: "3",
    name: "Juan Pérez",
    totalLoaned: 200000,
    totalPaid: 50000,
    balance: 150000,
    status: "Pendiente",
  },
  "4": {
    id: "4",
    name: "Jose Castillo",
    totalLoaned: 496460,
    totalPaid: 198584,
    balance: 297876,
    status: "Pendiente",
  },
  "5": {
    id: "5",
    name: "Barbara",
    totalLoaned: 30000,
    totalPaid: 0,
    balance: 30000,
    status: "Pendiente",
  },
  "6": {
    id: "6",
    name: "Jose",
    totalLoaned: 381480,
    totalPaid: 0,
    balance: 381480,
    status: "Pendiente",
  },
  "7": {
    id: "7",
    name: "Keiber",
    totalLoaned: 278222,
    totalPaid: 0,
    balance: 278222,
    status: "Pendiente",
  },
  "8": {
    id: "8",
    name: "Pedro",
    totalLoaned: 240000,
    totalPaid: 40000,
    balance: 200000,
    status: "Pendiente",
  },
}

// Datos de transacciones de ejemplo
const exampleTransactionsData: Record<string, Transaction[]> = {
  "1": [
    {
      id: "101",
      type: "Préstamo",
      amount: 100000,
      description: "Préstamo para reparación de auto",
      date: "2023-12-15T00:00:00.000Z",
    },
    {
      id: "102",
      type: "Préstamo",
      amount: 50000,
      description: "Préstamo para gastos médicos",
      date: "2024-01-20T00:00:00.000Z",
    },
    {
      id: "103",
      type: "Pago",
      amount: 50000,
      description: "Primer pago",
      date: "2024-02-10T00:00:00.000Z",
    },
  ],
  "2": [
    {
      id: "201",
      type: "Préstamo",
      amount: 75000,
      description: "Préstamo para compra de laptop",
      date: "2023-11-05T00:00:00.000Z",
    },
    {
      id: "202",
      type: "Pago",
      amount: 25000,
      description: "Primer pago",
      date: "2023-12-05T00:00:00.000Z",
    },
    {
      id: "203",
      type: "Pago",
      amount: 25000,
      description: "Segundo pago",
      date: "2024-01-05T00:00:00.000Z",
    },
    {
      id: "204",
      type: "Pago",
      amount: 25000,
      description: "Pago final",
      date: "2024-02-05T00:00:00.000Z",
    },
  ],
  "3": [
    {
      id: "301",
      type: "Préstamo",
      amount: 200000,
      description: "Préstamo para matrícula universitaria",
      date: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "302",
      type: "Pago",
      amount: 50000,
      description: "Primer pago",
      date: "2024-02-10T00:00:00.000Z",
    },
  ],
  "4": [
    {
      id: "401",
      type: "Préstamo",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2023-12-01T00:00:00.000Z",
    },
    {
      id: "402",
      type: "Préstamo",
      amount: 49646,
      description: "Monto de la Cuota",
      date: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "403",
      type: "Pago",
      amount: 49646,
      description: "Pago",
      date: "2023-12-15T00:00:00.000Z",
    },
  ],
  "5": [
    {
      id: "501",
      type: "Préstamo",
      amount: 30000,
      description: "Préstamo personal",
      date: "2024-03-15T00:00:00.000Z",
    },
  ],
  "6": [
    {
      id: "601",
      type: "Préstamo",
      amount: 381480,
      description: "Préstamo personal",
      date: "2024-03-20T00:00:00.000Z",
    },
  ],
  "7": [
    {
      id: "701",
      type: "Préstamo",
      amount: 30000,
      description: "Préstamo personal",
      date: "2024-03-01T00:00:00.000Z",
    },
    {
      id: "702",
      type: "Préstamo",
      amount: 130000,
      description: "Préstamo para televisor",
      date: "2024-03-10T00:00:00.000Z",
    },
    {
      id: "703",
      type: "Préstamo",
      amount: 118222,
      description: "Préstamo para mouse",
      date: "2024-03-15T00:00:00.000Z",
    },
  ],
  "8": [
    {
      id: "801",
      type: "Préstamo",
      amount: 240000,
      description: "Préstamo para moto - 6 cuotas de $40.000",
      date: "2024-03-01T00:00:00.000Z",
    },
    {
      id: "802",
      type: "Pago",
      amount: 40000,
      description: "Cuota 1/6",
      date: "2024-04-01T00:00:00.000Z",
    },
  ],
}

export default function SharedLinkPage({ params }: { params: { shareId: string } }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [person, setPerson] = useState<Person | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [includeTransactions, setIncludeTransactions] = useState(false)
  const [includePersonalInfo, setIncludePersonalInfo] = useState(false)

  useEffect(() => {
    // En una implementación real, verificaríamos el enlace compartido con una API
    // Por ahora, simulamos la carga y verificación

    // Simulamos la obtención de parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const personId = urlParams.get("pid") || ""
    const expiryTimestamp = urlParams.get("exp") || "0"
    const includeTx = urlParams.get("tx") === "1"
    const includePI = urlParams.get("pi") === "1"

    // Verificar si el enlace ha expirado
    const expiryDate = new Date(Number.parseInt(expiryTimestamp))
    const isLinkExpired = expiryDate < new Date()
    setIsExpired(isLinkExpired)

    if (!isLinkExpired) {
      // Simulamos que algunos enlaces están protegidos con contraseña
      const isProtected = params.shareId.startsWith("abc")
      setIsPasswordProtected(isProtected)

      // Configurar opciones de visualización
      setIncludeTransactions(includeTx)
      setIncludePersonalInfo(includePI)

      // Intentar cargar datos de la persona desde localStorage
      const savedPeople = localStorage.getItem("loanTracker_people")
      let foundPerson: Person | null = null

      if (savedPeople) {
        const people: Person[] = JSON.parse(savedPeople)
        foundPerson = people.find((p) => p.id === personId) || null
      }

      // Si no se encuentra en localStorage, usar datos de ejemplo
      if (!foundPerson && personId && examplePersonData[personId]) {
        foundPerson = examplePersonData[personId]
      }

      if (foundPerson) {
        setPerson(foundPerson)

        // Cargar transacciones si es necesario
        if (includeTx) {
          // Intentar cargar desde localStorage primero
          const savedTransactions = localStorage.getItem(`loanTracker_transactions_${personId}`)
          if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions))
          }
          // Si no hay en localStorage, usar datos de ejemplo
          else if (exampleTransactionsData[personId]) {
            setTransactions(exampleTransactionsData[personId])
          }
        }
      }

      // Registrar vista (en una implementación real)
      try {
        const sharedLinks = localStorage.getItem("loanTracker_sharedLinks")
        if (sharedLinks) {
          const links = JSON.parse(sharedLinks)
          const updatedLinks = links.map((link: any) => {
            if (link.id === params.shareId || link.url.includes(params.shareId)) {
              return { ...link, views: link.views + 1 }
            }
            return link
          })
          localStorage.setItem("loanTracker_sharedLinks", JSON.stringify(updatedLinks))
        }
      } catch (error) {
        // Ignorar errores de localStorage en caso de que no esté disponible
        console.log("Error al actualizar vistas:", error)
      }
    }

    setIsLoading(false)
  }, [params.shareId])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // En una implementación real, verificaríamos la contraseña con una API
    // Por ahora, simulamos la verificación
    if (password === "1234") {
      setIsPasswordProtected(false)
    } else {
      setIsPasswordError(true)
    }
  }

  const handleClose = () => {
    if (isAuthenticated) {
      router.push("/")
    } else {
      window.close()
      // Si window.close() no funciona (por políticas del navegador), redirigir a la página compartida
      setTimeout(() => {
        router.push("/shared")
      }, 300)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Cargando información compartida...</p>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300 p-4">
        <div className="bg-gray-900/70 border border-gray-800/50 rounded-xl p-8 max-w-md text-center backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Enlace Expirado</h2>
          <p className="text-gray-400 mb-6">
            Este enlace ha expirado y ya no está disponible. Por favor, solicita un nuevo enlace para acceder a esta
            información.
          </p>
          <Button
            onClick={() => router.push("/shared")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  if (isPasswordProtected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300 p-4">
        <div className="bg-gray-900/70 border border-gray-800/50 rounded-xl p-8 max-w-md backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Lock className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 text-center">Contenido Protegido</h2>
          <p className="text-gray-400 mb-6 text-center">
            Este contenido está protegido con contraseña. Introduce la contraseña para acceder.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setIsPasswordError(false)
                }}
                placeholder="Contraseña"
                className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
              />
              {isPasswordError && (
                <p className="text-xs text-red-400 mt-1">Contraseña incorrecta. Inténtalo de nuevo.</p>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/shared")}
                className="text-gray-400 hover:text-white hover:bg-gray-800/70"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Acceder
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300 p-4">
        <div className="bg-gray-900/70 border border-gray-800/50 rounded-xl p-8 max-w-md text-center backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Información no encontrada</h2>
          <p className="text-gray-400 mb-6">
            No se pudo encontrar la información solicitada. Es posible que el enlace sea inválido o que los datos hayan
            sido eliminados.
          </p>
          <Button
            onClick={() => router.push("/shared")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Información de Préstamo</h1>
            <p className="text-sm text-gray-500 mt-1">Información compartida de forma segura</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Volver</span>
          </Button>
        </div>

        <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-medium text-base mr-4">
              {person.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{person.name}</h2>
              <span className={`text-xs font-medium ${person.balance > 0 ? "text-amber-400" : "text-green-400"}`}>
                {person.balance > 0 ? "Pendiente" : "Pagado"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-4 border border-blue-800/20 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-1">Total Prestado</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(person.totalLoaned)}</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-4 border border-green-800/20 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-1">Total Pagado</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(person.totalPaid)}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-4 border border-amber-800/20 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-1">Saldo Pendiente</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(Math.abs(person.balance))}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">Progreso de pago</p>
              <p className="text-xs font-medium text-blue-400">
                {person.totalLoaned > 0 ? Math.min(100, Math.round((person.totalPaid / person.totalLoaned) * 100)) : 0}%
              </p>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${person.status === "Pagado" ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-blue-600 to-blue-400"}`}
                style={{
                  width: `${person.totalLoaned > 0 ? Math.min(100, Math.round((person.totalPaid / person.totalLoaned) * 100)) : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {includePersonalInfo && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm p-6 mb-6">
            <h3 className="text-base font-medium text-white mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Correo Electrónico</p>
                <p className="text-sm text-white">ejemplo@correo.com</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                <p className="text-sm text-white">+56 9 1234 5678</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Dirección</p>
                <p className="text-sm text-white">Av. Ejemplo 123, Santiago, Chile</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Notas</p>
                <p className="text-sm text-white">Cliente frecuente con buen historial de pagos.</p>
              </div>
            </div>
          </div>
        )}

        {includeTransactions && transactions.length > 0 && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-gray-800/50">
              <h3 className="text-base font-medium text-white">Historial de Movimientos</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                              transaction.type === "Préstamo"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-green-500/20 text-green-400 border-green-500/30"
                            }`}
                          >
                            {transaction.type}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(transaction.date).toLocaleDateString("es-CL")}
                          </span>
                        </div>
                        <p className="text-sm text-white mt-1">{transaction.description}</p>
                      </div>
                      <p
                        className={`text-sm font-medium ${
                          transaction.type === "Préstamo" ? "text-blue-400" : "text-green-400"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

