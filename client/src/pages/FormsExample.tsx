import { useState } from 'react'
import toast from 'react-hot-toast'

export function FormsExample() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: '',
    fecha: '',
    cantidad: '',
    email: '',
    categoria: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validación básica
      if (!formData.titulo.trim()) {
        toast.error('Por favor ingrese un título')
        return
      }
      
      if (!formData.descripcion.trim()) {
        toast.error('Por favor ingrese una descripción')
        return
      }
      
      if (!formData.estado) {
        toast.error('Por favor seleccione un estado')
        return
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Por favor ingrese un email válido')
        return
      }
      
      // Simular envío exitoso
      console.log('Formulario enviado:', formData)
      toast.success('Formulario enviado correctamente')
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        descripcion: '',
        estado: '',
        fecha: '',
        cantidad: '',
        email: '',
        categoria: ''
      })
      
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      toast.error('Error al enviar el formulario. Por favor intente nuevamente.')
    }
  }

  const handleSubmitExtended = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validaciones para el formulario extendido
      if (!formData.cantidad.trim()) {
        toast.error('Por favor ingrese una cantidad')
        return
      }
      
      if (formData.cantidad && (parseInt(formData.cantidad) < 0 || parseInt(formData.cantidad) > 999)) {
        toast.error('La cantidad debe estar entre 0 y 999')
        return
      }
      
      if (!formData.email.trim()) {
        toast.error('Por favor ingrese un correo electrónico')
        return
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Por favor ingrese un email válido')
        return
      }
      
      if (!formData.categoria.trim()) {
        toast.error('Por favor ingrese una categoría')
        return
      }
      
      // Simular envío exitoso
      console.log('Formulario extendido enviado:', formData)
      toast.success('Formulario extendido enviado correctamente')
      
      // Resetear campos del formulario extendido
      setFormData(prev => ({
        ...prev,
        cantidad: '',
        email: '',
        categoria: ''
      }))
      
    } catch (error) {
      console.error('Error al enviar formulario extendido:', error)
      toast.error('Error al enviar el formulario. Por favor intente nuevamente.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Formulario</h1>
      </div>
      
      <div className="card shadow-soft-xl hover-lift transition-modern">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Formulario</h3>
          <p className="text-sm text-gray-500 mt-1">Complete todos los campos requeridos</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Campo de texto con label y placeholder descriptivos */}
          <div className="form-group">
            <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-3">
              Título del registro
            </label>
            <input 
              id="titulo"
              type="text" 
              className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              placeholder="Ingrese un título descriptivo para el registro"
              aria-describedby="titulo-help"
              value={formData.titulo}
              onChange={handleInputChange}
            />
            <p id="titulo-help" className="mt-2 text-sm text-gray-500">
              El título debe ser claro y descriptivo, máximo 100 caracteres.
            </p>
          </div>

          {/* Campo textarea con label y placeholder */}
          <div className="form-group">
            <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-3">
              Descripción
            </label>
            <textarea 
              id="descripcion"
              className="textarea w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              rows={4}
              placeholder="Proporcione una descripción detallada del registro..."
              aria-describedby="descripcion-help"
              value={formData.descripcion}
              onChange={handleInputChange}
            />
            <p id="descripcion-help" className="mt-2 text-sm text-gray-500">
              Incluya todos los detalles relevantes. Mínimo 10 caracteres, máximo 500.
            </p>
          </div>

          {/* Campo select con label */}
          <div className="form-group">
            <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-3">
              Estado del registro
            </label>
            <select 
              id="estado"
              className="select w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              aria-describedby="estado-help"
              value={formData.estado}
              onChange={handleInputChange}
            >
              <option value="" disabled>Seleccione un estado</option>
              <option value="activo">Activo - El registro está disponible</option>
              <option value="inactivo">Inactivo - El registro está deshabilitado</option>
              <option value="pendiente">Pendiente - Requiere revisión</option>
            </select>
            <p id="estado-help" className="mt-2 text-sm text-gray-500">
              Seleccione el estado inicial del registro.
            </p>
          </div>

          {/* Campo de fecha como ejemplo adicional */}
          <div className="form-group">
            <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700 mb-3">
              Fecha de creación
            </label>
            <input 
              id="fecha"
              type="date" 
              className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              aria-describedby="fecha-help"
              value={formData.fecha}
              onChange={handleInputChange}
            />
            <p id="fecha-help" className="mt-2 text-sm text-gray-500">
              Fecha en la que se crea el registro.
            </p>
          </div>

          {/* Botones con jerarquía clara */}
          <div className="flex space-x-3 pt-6 border-t border-gray-100">
            <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-soft hover-lift transition-modern flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar registro
            </button>
            <button type="button" className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium shadow-soft hover-lift transition-modern flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar formulario
            </button>
            <button type="button" className="btn text-gray-500 hover:text-gray-700 px-6 py-3 rounded-lg font-medium transition-modern">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Ejemplo de formulario con diferentes tipos de campos */}
      <div className="card shadow-soft-xl hover-lift transition-modern">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Campos adicionales</h3>
          <p className="text-sm text-gray-500 mt-1">Formulario con diferentes tipos de campos</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmitExtended}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo numérico */}
            <div className="form-group">
              <label htmlFor="cantidad" className="block text-sm font-semibold text-gray-700 mb-3">
                Cantidad
              </label>
              <input 
                id="cantidad"
                type="number" 
                className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
                placeholder="0"
                min="0"
                max="999"
                value={formData.cantidad}
                onChange={handleInputChange}
              />
            </div>

            {/* Campo de correo */}
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Correo electrónico
              </label>
              <input 
                id="email"
                type="email" 
                className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Campo de búsqueda con autocompletado */}
          <div className="form-group">
            <label htmlFor="categoria" className="block text-sm font-semibold text-gray-700 mb-3">
              Categoría
            </label>
            <input 
              id="categoria"
              type="text" 
              className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              placeholder="Escriba para buscar categorías..."
              list="categorias-list"
              value={formData.categoria}
              onChange={handleInputChange}
            />
            <datalist id="categorias-list">
              <option value="Tecnología" />
              <option value="Salud" />
              <option value="Educación" />
              <option value="Finanzas" />
              <option value="Otro" />
            </datalist>
          </div>

          <div className="flex space-x-3 pt-6 border-t border-gray-100">
            <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-soft hover-lift transition-modern">
              Guardar cambios
            </button>
            <button type="reset" className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium shadow-soft hover-lift transition-modern">
              Restablecer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}