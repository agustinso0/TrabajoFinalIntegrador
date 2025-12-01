export function QueryReport() {
  const mockResults = [
    { id: 1, titulo: 'Solicitud de soporte técnico', categoria: 'Soporte', estado: 'Abierto', prioridad: 'Alta', fecha: '2024-01-15', responsable: 'Juan Pérez', monto: 0.00 },
    { id: 2, titulo: 'Actualización de sistema CRM', categoria: 'Desarrollo', estado: 'En proceso', prioridad: 'Media', fecha: '2024-01-14', responsable: 'María García', monto: 2500.00 },
    { id: 3, titulo: 'Capacitación de personal', categoria: 'Capacitación', estado: 'Completado', prioridad: 'Baja', fecha: '2024-01-13', responsable: 'Carlos López', monto: 1200.00 },
    { id: 4, titulo: 'Renovación de licencias', categoria: 'Licencias', estado: 'Pendiente', prioridad: 'Alta', fecha: '2024-01-12', responsable: 'Ana Martínez', monto: 5000.00 },
    { id: 5, titulo: 'Mantenimiento de servidores', categoria: 'Infraestructura', estado: 'Programado', prioridad: 'Media', fecha: '2024-01-11', responsable: 'Roberto Sánchez', monto: 800.00 },
    { id: 6, titulo: 'Desarrollo de nuevo módulo', categoria: 'Desarrollo', estado: 'En proceso', prioridad: 'Alta', fecha: '2024-01-10', responsable: 'Laura Fernández', monto: 3500.00 },
    { id: 7, titulo: 'Auditoría de seguridad', categoria: 'Seguridad', estado: 'Completado', prioridad: 'Alta', fecha: '2024-01-09', responsable: 'Diego Rodríguez', monto: 1500.00 },
    { id: 8, titulo: 'Soporte a usuarios finales', categoria: 'Soporte', estado: 'Abierto', prioridad: 'Baja', fecha: '2024-01-08', responsable: 'Sofía Torres', monto: 0.00 }
  ]

  const totalMonto = mockResults.reduce((sum, item) => sum + item.monto, 0)
  const resultadosTotales = mockResults.length
  const resultadosFiltrados = mockResults.length // En una implementación real, esto variaría según los filtros

  return (
    <div className="space-y-6">
      <h2 className="page-title">Consulta Avanzada y Reportes</h2>
      
      {/* Panel de búsqueda y filtros */}
      <div className="card shadow-soft-xl hover-lift transition-modern">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Criterios de búsqueda</h3>
          <p className="text-sm text-gray-500 mt-1">Configure los filtros para obtener resultados más precisos</p>
        </div>
        
        {/* Búsqueda principal */}
        <div className="mb-8">
          <label htmlFor="busqueda-general" className="block text-sm font-semibold text-gray-700 mb-3">
            Término de búsqueda
          </label>
          <div className="flex gap-4">
            <input 
              id="busqueda-general"
              type="text" 
              className="input flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              placeholder="Buscar por título, descripción, responsable..."
              aria-describedby="busqueda-help"
            />
            <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-soft hover-lift transition-modern flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
          </div>
          <p id="busqueda-help" className="mt-2 text-sm text-gray-500">
            Puede buscar por cualquier palabra clave relacionada con el registro
          </p>
        </div>

        {/* Filtros avanzados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <label htmlFor="categoria" className="block text-sm font-semibold text-gray-700 mb-3">
              Categoría
            </label>
            <select id="categoria" className="select w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft">
              <option value="">Todas las categorías</option>
              <option value="soporte">Soporte</option>
              <option value="desarrollo">Desarrollo</option>
              <option value="capacitacion">Capacitación</option>
              <option value="licencias">Licencias</option>
              <option value="infraestructura">Infraestructura</option>
              <option value="seguridad">Seguridad</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-3">
              Estado
            </label>
            <select id="estado" className="select w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft">
              <option value="">Todos los estados</option>
              <option value="abierto">Abierto</option>
              <option value="en-proceso">En proceso</option>
              <option value="pendiente">Pendiente</option>
              <option value="programado">Programado</option>
              <option value="completado">Completado</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="prioridad" className="block text-sm font-semibold text-gray-700 mb-3">
              Prioridad
            </label>
            <select id="prioridad" className="select w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft">
              <option value="">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="fecha-desde" className="block text-sm font-semibold text-gray-700 mb-3">
              Fecha desde
            </label>
            <input 
              id="fecha-desde"
              type="date" 
              className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft"
              defaultValue="2024-01-01"
            />
          </div>
        </div>

        {/* Filtros adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="responsable" className="block text-sm font-semibold text-gray-700 mb-3">
              Responsable
            </label>
            <input 
              id="responsable"
              type="text" 
              className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              placeholder="Nombre del responsable"
            />
          </div>
          
          <div>
            <label htmlFor="monto-minimo" className="block text-sm font-semibold text-gray-700 mb-3">
              Monto mínimo ($)
            </label>
            <input 
              id="monto-minimo"
              type="number" 
              className="input w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft" 
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
          <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-soft hover-lift transition-modern flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Aplicar filtros
          </button>
          
          <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium shadow-soft hover-lift transition-modern flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Resultados y opciones de exportación */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="section-title">Resultados de la búsqueda</h3>
            <p className="text-sm text-gray-600 mt-1">
              Mostrando {resultadosFiltrados} de {resultadosTotales} resultados encontrados
            </p>
          </div>
          
          {/* Opciones de exportación */}
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="btn btn-outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar PDF
            </button>
            
            <button className="btn btn-outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Exportar Excel
            </button>
            
            <button className="btn btn-outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Imprimir
            </button>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockResults.map((result, index) => (
                <tr key={result.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="font-medium">{result.titulo}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {result.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                      result.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                      result.estado === 'Pendiente' ? 'bg-orange-100 text-orange-800' :
                      result.estado === 'Programado' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                      result.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {result.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.fecha}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.responsable}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${result.monto.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-1">
                      <button className="text-blue-600 hover:text-blue-900 p-1" title="Ver detalle">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen de resultados */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{resultadosFiltrados}</div>
              <div className="text-sm text-gray-600">Resultados encontrados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">${totalMonto.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Monto total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockResults.filter(r => r.estado === 'Completado').length}
              </div>
              <div className="text-sm text-gray-600">Completados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

