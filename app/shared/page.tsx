"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Link, Plus } from "lucide-react"
import { SharedLinksTable } from "@/components/shared-links-table"
import { useAuth } from "@/contexts/auth-context"

interface SharedLink {
  id: string
  personId: string
  personName: string
  url: string
  createdAt: string
  expiresAt: string
  includesTransactions: boolean
  includesPersonalInfo: boolean
  isPasswordProtected: boolean
  views: number
}

// Datos de ejemplo para enlaces compartidos
const exampleSharedLinks: SharedLink[] = [
  {
    id: "1",
    personId: "4",
    personName: "Jose Castillo",
    url: "https://example.com/shared/abc123",
    createdAt: "2024-03-15T10:30:00.000Z",
    expiresAt: "2024-04-15T10:30:00.000Z",
    includesTransactions: true,
    includesPersonalInfo: false,
    isPasswordProtected: true,
    views: 3,
  },
  {
    id: "2",
    personId: "5",
    personName: "Barbara",
    url: "https://example.com/shared/def456",
    createdAt: "2024-03-20T14:45:00.000Z",
    expiresAt: "2024-03-27T14:45:00.000Z",
    includesTransactions: true,
    includesPersonalInfo: true,
    isPasswordProtected: false,
    views: 1,
  },
  {
    id: "3",
    personId: "8",
    personName: "Pedro",
    url: "https://example.com/shared/ghi789",
    createdAt: "2024-03-25T09:15:00.000Z",
    expiresAt: "2024-04-25T09:15:00.000Z",
    includesTransactions: false,
    includesPersonalInfo: false,
    isPasswordProtected: false,
    views: 0,
  },
]

export default function SharedLinksPage() {
  const router = useRouter()
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // En una implementación real, cargaríamos los enlaces desde localStorage o una API
    // Por ahora, usamos datos de ejemplo
    const savedLinks = localStorage.getItem("loanTracker_sharedLinks")
    if (savedLinks) {
      setSharedLinks(JSON.parse(savedLinks))
    } else {
      setSharedLinks(exampleSharedLinks)
      localStorage.setItem("loanTracker_sharedLinks", JSON.stringify(exampleSharedLinks))
    }
  }, [])

  const deleteSharedLink = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este enlace compartido?")) {
      const updatedLinks = sharedLinks.filter((link) => link.id !== id)
      setSharedLinks(updatedLinks)
      localStorage.setItem("loanTracker_sharedLinks", JSON.stringify(updatedLinks))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(isAuthenticated ? "/" : "/login")}
          className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800/50 -ml-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm">{isAuthenticated ? "Volver al Inicio" : "Iniciar Sesión"}</span>
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Enlaces Compartidos</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona los enlaces para compartir información de préstamos</p>
          </div>
          {isAuthenticated && (
            <Button
              onClick={() => router.push("/")}
              className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Enlace
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-5 border border-blue-800/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Enlaces Activos</h3>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Link className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-white">
              {sharedLinks.filter((link) => new Date(link.expiresAt) > new Date()).length}
            </p>
            <p className="text-xs text-blue-400 mt-2">Enlaces que aún no han expirado</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-5 border border-green-800/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Total de Vistas</h3>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xs">👁️</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-white">
              {sharedLinks.reduce((total, link) => total + link.views, 0)}
            </p>
            <p className="text-xs text-green-400 mt-2">Veces que se han visto tus enlaces</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-xl p-5 border border-amber-800/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Enlaces Expirados</h3>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 text-xs">⏱️</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-white">
              {sharedLinks.filter((link) => new Date(link.expiresAt) <= new Date()).length}
            </p>
            <p className="text-xs text-amber-400 mt-2">Enlaces que ya han expirado</p>
          </div>
        </div>

        <SharedLinksTable links={sharedLinks} onDelete={deleteSharedLink} />
      </div>
    </div>
  )
}

