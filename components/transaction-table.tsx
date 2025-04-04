"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowDown, ArrowUp, Calendar } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Transaction {
  id: string
  date: string
  type: string
  amount: number
  description: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction
    direction: "ascending" | "descending"
  }>({
    key: "date",
    direction: "descending",
  })

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: keyof Transaction) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getTypeColor = (type: string) => {
    return type === "Préstamo"
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : "bg-green-500/20 text-green-400 border-green-500/30"
  }

  const getTypeIcon = (type: string) => {
    return type === "Préstamo" ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />
  }

  const isProgrammed = (transaction: Transaction) => {
    return transaction.description.toLowerCase().includes("programada") && new Date(transaction.date) > new Date()
  }

  return (
    <div>
      <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
        <h3 className="text-base font-medium text-white">Historial de Movimientos</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => requestSort("date")}
            className="h-8 text-xs bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Fecha
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-900/70">
            <TableRow className="border-b border-gray-800/50 hover:bg-transparent">
              <TableHead
                className="cursor-pointer text-xs text-gray-400 hover:text-white"
                onClick={() => requestSort("date")}
              >
                Fecha {sortConfig.key === "date" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-xs text-gray-400 hover:text-white"
                onClick={() => requestSort("type")}
              >
                Tipo
              </TableHead>
              <TableHead
                className="cursor-pointer text-xs text-gray-400 hover:text-white"
                onClick={() => requestSort("amount")}
              >
                Monto
              </TableHead>
              <TableHead className="text-xs text-gray-400">Descripción</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className={`border-b border-gray-800/30 hover:bg-gray-800/30 ${
                  isProgrammed(transaction) ? "bg-gray-800/10 opacity-70" : ""
                }`}
              >
                <TableCell className="text-xs text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1.5 text-gray-500" />
                    {formatDate(transaction.date)}
                    {isProgrammed(transaction) && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded text-[10px]">
                        Programado
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getTypeColor(transaction.type)}`}
                  >
                    {getTypeIcon(transaction.type)}
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {transaction.type === "Préstamo" ? (
                    <span className="text-blue-400">{formatCurrency(transaction.amount)}</span>
                  ) : (
                    <span className="text-green-400">{formatCurrency(transaction.amount)}</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-gray-300 max-w-[200px] truncate">
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

