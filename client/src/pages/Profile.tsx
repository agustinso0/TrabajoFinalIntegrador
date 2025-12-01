import { useState } from 'react'

export function Profile() {
  const [toast, setToast] = useState({ type: '', message: '', visible: false })

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message, visible: true })
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setToast({ type: '', message: '', visible: false })
    }, 5000)
  }

  const hideToast = () => {
    setToast({ type: '', message: '', visible: false })
  }

  const validateForm = (formData: FormData) => {
    const nombre = formData.get('nombre')
    const apellido = formData.get('apellido')
    const telefono = formData.get('telefono')
    
    if (!nombre || !apellido || !telefono) {
      return false
    }
    
    // Validación básica de teléfono
    if (telefono.toString().length < 8) {
      return false
    }
    
    return true
  }

  const getMissingFields = (formData: FormData) => {
    const nombre = formData.get('nombre')
    const apellido = formData.get('apellido')
    const telefono = formData.get('telefono')
    const missing = []
    
    if (!nombre) missing.push('nombre')
    if (!apellido) missing.push('apellido')
    if (!telefono) missing.push('teléfono')
    
    return missing
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nombre = formData.get('nombre')
    const apellido = formData.get('apellido')
    const telefono = formData.get('telefono')
    
    // Verificar si todos los campos están vacíos
    const isFormEmpty = !nombre && !apellido && !telefono
    
    if (isFormEmpty) {
      // No mostrar ningún toast si el formulario está completamente vacío
      return
    }
    
    if (validateForm(formData)) {
      showToast('success', '¡Perfil actualizado exitosamente!')
    } else {
      const missingFields = getMissingFields(formData)
      if (missingFields.length > 0) {
        const fieldsText = missingFields.join(', ')
        showToast('error', `Por favor, completa los siguientes campos: ${fieldsText}.`)
      } else if (telefono && telefono.toString().length < 8) {
        showToast('error', 'El teléfono debe tener al menos 8 caracteres.')
      }
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const passwordActual = formData.get('password-actual')
    const passwordNueva = formData.get('password-nueva')
    
    // Verificar si todos los campos están vacíos
    const isFormEmpty = !passwordActual && !passwordNueva
    
    if (isFormEmpty) {
      // No mostrar ningún toast si el formulario está completamente vacío
      return
    }
    
    if (!passwordActual || !passwordNueva) {
      const missingFields = []
      if (!passwordActual) missingFields.push('contraseña actual')
      if (!passwordNueva) missingFields.push('nueva contraseña')
      const fieldsText = missingFields.join(' y ')
      showToast('error', `Por favor, completa: ${fieldsText}.`)
      return
    }
    
    if (passwordNueva.toString().length < 8) {
      showToast('error', 'La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    
    showToast('success', '¡Contraseña actualizada exitosamente!')
  }

  return (
    <div className="space-y-6">
      <h2 className="page-title">Perfil del usuario</h2>
      
      {/* Toast de éxito dinámico */}
      {toast.visible && toast.type === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-soft animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {toast.message}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {toast.type === 'success' && toast.message.includes('Perfil') 
                  ? 'Tus cambios han sido guardados correctamente.' 
                  : 'Tu contraseña ha sido actualizada exitosamente.'}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={hideToast} className="inline-flex text-green-400 hover:text-green-600 transition-modern">
                <span className="sr-only">Cerrar</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de error dinámico */}
      {toast.visible && toast.type === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-soft animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Error al actualizar el perfil
              </p>
              <p className="text-sm text-red-600 mt-1">
                {toast.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={hideToast} className="inline-flex text-red-400 hover:text-red-600 transition-modern">
                <span className="sr-only">Cerrar</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Datos personales - Card principal */}

      <div className="card hover-lift transition-modern">
        <h3 className="section-title">Datos personales</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 inline mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Nombre
              </label>
              <div className="relative">
                <input 
                id="nombre"
                name="nombre"
                type="text" 
                className="input w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-modern" 
                placeholder="Ingrese su nombre"
                aria-describedby="nombre-help"
              />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p id="nombre-help" className="mt-2 text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ingrese su nombre completo como aparece en su documento
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 inline mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Apellido
              </label>
              <div className="relative">
                <input 
                id="apellido"
                name="apellido"
                type="text" 
                className="input w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-modern" 
                placeholder="Ingrese su apellido"
                aria-describedby="apellido-help"
              />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p id="apellido-help" className="mt-2 text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ingrese sus apellidos completos
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-3">
              <svg className="w-4 h-4 inline mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Teléfono
            </label>
            <div className="relative">
              <input 
                id="telefono"
                name="telefono"
                type="tel" 
                className="input w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-modern" 
                placeholder="Ingrese su número de teléfono"
                aria-describedby="telefono-help"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <p id="telefono-help" className="mt-2 text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Formato: +54 9 11 1234-5678
            </p>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-soft hover-lift transition-modern">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar cambios
            </button>
            <button type="button" className="ml-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-modern shadow-soft hover-lift">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Cambiar contraseña - Sección separada */}
      <div className="card hover-lift transition-modern">
        <h3 className="section-title">Cambiar contraseña</h3>
        <form className="space-y-6" onSubmit={handlePasswordSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="password-actual" className="block text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 inline mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Contraseña actual
              </label>
              <div className="relative">
                <input 
                  id="password-actual"
                  name="password-actual"
                  type="password" 
                  className="input w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-modern" 
                  placeholder="Ingrese su contraseña actual"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-modern" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password-nueva" className="block text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 inline mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2v4a2 2 0 01-2 2h-1m-6 0a2 2 0 002 2h1a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                Nueva contraseña
              </label>
              <div className="relative">
                <input 
                  id="password-nueva"
                  name="password-nueva"
                  type="password" 
                  className="input w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-modern" 
                  placeholder="Ingrese su nueva contraseña"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2v4a2 2 0 01-2 2h-1m-6 0a2 2 0 002 2h1a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                  </svg>
                </div>
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-modern" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Mínimo 8 caracteres</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Incluir mayúsculas y minúsculas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-soft hover-lift transition-modern">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2v4a2 2 0 01-2 2h-1m-6 0a2 2 0 002 2h1a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
              </svg>
              Actualizar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

