"use client"

import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [modal, setModal] = useState<null | { type: 'error' | 'success'; title: string; message: string }>(null)
  const navigate = useNavigate()

  const closeModal = () => setModal(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validación hardcodeada
    if (email === "test@test.com" && password === "1234") {
      setModal({ type: 'success', title: 'Login exitoso', message: 'Redirigiendo al panel principal...' })
      setTimeout(() => {
        closeModal()
        console.log('Navegando a /home...')
        navigate('/home', { replace: true })
      }, 1500)
    } else {
      setModal({ type: 'error', title: 'Credenciales incorrectas', message: 'Por favor, verifica tu email y contraseña.' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          </div>

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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {/* Mensaje de confirmación / error inline */}
            {modal && (
              <div className={`p-4 rounded-lg border ${
                modal.type === 'error' 
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${
                      modal.type === 'error' ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {modal.title}
                    </h3>
                    <p className="mt-1 text-sm">{modal.message}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className={`ml-4 px-3 py-1 text-xs rounded`}
                  >
            
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/lost-password" className="text-sm text-primary hover:text-blue-700 font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link to="/signup" className="text-primary hover:text-blue-700 font-semibold">
                Registrarme
              </Link>
            </p>
          </div>

          {/* Helper Text */}
          {!modal && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                 <strong>Credenciales de prueba:</strong>
                <br />
                Email: test@test.com
                <br />
                Contraseña: 1234
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
