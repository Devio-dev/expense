"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowDown, ArrowUp } from "lucide-react"

interface Transaction {
  id: string
  personId: string
  type: "Préstamo" | "Pago"
  amount: number
  description: string
  date: string
}

interface AddTransactionFormProps {
  personId: string
  onSubmit: (transaction: Omit<Transaction, "id">) => void
  onCancel: () => void
}

export function AddTransactionForm({ personId, onSubmit, onCancel }: AddTransactionFormProps) {
  const [type, setType] = useState<"Préstamo" | "Pago">("Préstamo")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProgrammed, setIsProgrammed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!amount) {
      newErrors.amount = "El monto es obligatorio"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "El monto debe ser un número positivo"
    }

    if (!date) {
      newErrors.date = "La fecha es obligatoria"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    let finalDescription = description
    if (isProgrammed && type === "Pago") {
      finalDescription = description ? `${description} (Programada)` : "Pago programado"
    }

    onSubmit({
      personId,
      type,
      amount: Number(amount),
      description: finalDescription,
      date: new Date(date).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <Label className="text-sm text-gray-300">Tipo de Movimiento</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={type === "Préstamo" ? "default" : "outline"}
            onClick={() => setType("Préstamo")}
            className={`flex items-center justify-center h-16 ${
              type === "Préstamo"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-blue-900/20"
                : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="flex flex-col items-center">
              <ArrowDown className={`h-5 w-5 mb-1 ${type === "Préstamo" ? "text-white" : "text-blue-400"}`} />
              <span>Préstamo</span>
            </div>
          </Button>
          <Button
            type="button"
            variant={type === "Pago" ? "default" : "outline"}
            onClick={() => setType("Pago")}
            className={`flex items-center justify-center h-16 ${
              type === "Pago"
                ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white border-0 shadow-lg shadow-green-900/20"
                : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="flex flex-col items-center">
              <ArrowUp className={`h-5 w-5 mb-1 ${type === "Pago" ? "text-white" : "text-green-400"}`} />
              <span>Pago</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm text-gray-300">
          Monto
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setErrors({ ...errors, amount: "" })
          }}
          placeholder="0.00"
          className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
        />
        {errors.amount && <p className="text-xs text-red-400">{errors.amount}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm text-gray-300">
          Descripción
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del movimiento"
          className="bg-gray-800/70 border-gray-700/50 text-white min-h-[80px] focus:border-blue-500/50 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm text-gray-300">
          Fecha
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setErrors({ ...errors, date: "" })

            // Verificar si la fecha es futura
            const selectedDate = new Date(e.target.value)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            setIsProgrammed(selectedDate > today)
          }}
          className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
        />
        {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}

        {isProgrammed && type === "Pago" && (
          <p className="text-xs text-amber-400 flex items-center mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
            Este pago quedará registrado como programado
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-gray-400 hover:text-white hover:bg-gray-800/70"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className={`${
            type === "Préstamo"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          } text-white border-0 shadow-lg shadow-blue-900/20`}
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}

