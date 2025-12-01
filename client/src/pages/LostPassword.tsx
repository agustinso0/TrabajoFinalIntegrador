"use client"

import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

export default function LostPassword() {
  const [email, setEmail] = useState("")
  const [messageSent, setMessageSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Simulación hardcodeada
    setMessageSent(true)

    // Reset después de 5 segundos
    setTimeout(() => {
      setMessageSent(false)
      setEmail("")
    }, 5000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
            <p className="text-gray-600">Te enviaremos un enlace para restablecer tu contraseña</p>
          </div>

          {/* Success Message */}
          {messageSent ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Enlace enviado</h3>
                    <p className="mt-2 text-sm text-green-700">
                      Si el email existe en nuestro sistema, te enviamos un enlace de recuperación. Por favor, revisa tu
                      bandeja de entrada.
                    </p>
                  </div>
                </div>
              </div>

            
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                >
                  Enviar Enlace de Recuperación
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-6 text-center">
                <Link to="/login" className="text-primary hover:text-blue-700 font-semibold">
                   Volver al Login
                </Link>
              </div>
            </>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Nota:</strong> Esta es una simulación. No se envía ningún email real.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
