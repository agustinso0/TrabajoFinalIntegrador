import { useState } from 'react'
import toast from 'react-hot-toast'

const mockUsers = [
  { id: '1', nombre: 'Juan Pérez', email: 'juan.perez@email.com', estado: 'Activo' },
  { id: '2', nombre: 'María García', email: 'maria.garcia@email.com', estado: 'Activo' },
  { id: '3', nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', estado: 'Inactivo' },
  { id: '4', nombre: 'Ana Martínez', email: 'ana.martinez@email.com', estado: 'Activo' },
  { id: '5', nombre: 'Luis González', email: 'luis.gonzalez@email.com', estado: 'Activo' },
]

export function Users() {
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({ nombre: '', email: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validación básica
      if (!newUser.nombre.trim() || !newUser.email.trim()) {
        toast.error('Por favor complete todos los campos')
        return
      }
      
      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newUser.email)) {
        toast.error('Por favor ingrese un email válido')
        return
      }
      
      // Aquí iría la lógica para crear el usuario
      console.log('Nuevo usuario:', newUser)
      
      // Simular creación exitosa
      toast.success('Usuario creado correctamente')
      
      // Cerrar modal y limpiar formulario
      setShowModal(false)
      setNewUser({ nombre: '', email: '' })
      
    } catch (error) {
      console.error('Error al crear usuario:', error)
      toast.error('Error al crear el usuario. Por favor intente nuevamente.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con título y contador */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="page-title">Usuarios</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: <span className="font-semibold">{mockUsers.length} usuarios</span>
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-soft hover-lift transition-modern">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* Tabla con cabecera sticky y zebra striping */}
      <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((usuario, index) => (
                <tr key={usuario.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{usuario.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.estado === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-soft hover-lift transition-modern text-sm flex items-center">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-soft hover-lift transition-modern text-sm flex items-center">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estado vacío (para cuando no hay usuarios) */}
      {mockUsers.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
          <p className="mt-1 text-sm text-gray-500">Comience creando un nuevo usuario.</p>
          <button onClick={() => setShowModal(true)} className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-soft hover-lift transition-modern mt-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo usuario
          </button>
        </div>
      )}

      {/* Modal para nuevo usuario */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-modern bg-white">
          <div className="bg-white rounded-lg shadow-soft p-6 w-full max-w-md mx-4 animate-fade-in border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nuevo Usuario</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-modern"
                  placeholder="Ingrese el nombre"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-modern"
                  placeholder="Ingrese el email"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-modern"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-modern"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

