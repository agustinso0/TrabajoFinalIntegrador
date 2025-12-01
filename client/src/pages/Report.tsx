export function Report() {
  const onPrint = () => {
    window.print()
  }
  
  const currentDate = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const mockReportData = [
    { id: 1, concepto: 'Registro de usuarios nuevos', cantidad: 45, monto: 1250.00, estado: 'Completado' },
    { id: 2, concepto: 'Actualizaciones de perfil', cantidad: 128, monto: 0.00, estado: 'Completado' },
    { id: 3, concepto: 'Solicitudes de soporte', cantidad: 23, monto: 450.00, estado: 'Pendiente' },
    { id: 4, concepto: 'Renovaciones de suscripción', cantidad: 67, monto: 3450.00, estado: 'Completado' },
    { id: 5, concepto: 'Cancelaciones de servicio', cantidad: 12, monto: -890.00, estado: 'Completado' },
    { id: 6, concepto: 'Actualizaciones de sistema', cantidad: 8, monto: 0.00, estado: 'En proceso' },
    { id: 7, concepto: 'Capacitaciones realizadas', cantidad: 34, monto: 1200.00, estado: 'Completado' },
    { id: 8, concepto: 'Consultas de información', cantidad: 89, monto: 0.00, estado: 'Completado' }
  ]

  const totalMonto = mockReportData.reduce((sum, item) => sum + item.monto, 0)
  const totalCantidad = mockReportData.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <div className="space-y-6">
      {/* Controles de impresión - se ocultan en impresión */}
      <div className="no-print">
        <h2 className="page-title">Reporte de Actividades</h2>
        <div className="card">
          <h3 className="section-title">Opciones de impresión</h3>
          <p className="text-gray-600 mb-4">
            Este reporte está optimizado para impresión en formato A4. 
            Haga clic en el botón para generar una versión imprimible.
          </p>
          <button className="btn btn-primary" onClick={onPrint}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir reporte
          </button>
        </div>
      </div>

      {/* Contenido del reporte - formato A4 */}
      <div className="print-container bg-white p-8 shadow-soft print:shadow-none print:border-0">
        {/* Encabezado del reporte */}
        <div className="mb-8 border-b border-gray-300 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reporte de Actividades del Sistema</h1>
              <p className="text-lg text-gray-600">Resumen de operaciones y métricas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Fecha de generación:</p>
              <p className="text-lg font-semibold text-gray-900">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Resumen del reporte */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen Ejecutivo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total de Operaciones</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalCantidad}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Monto Total</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalMonto.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Operaciones Completadas</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockReportData.filter(item => item.estado === 'Completado').length}</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Este reporte presenta un análisis detallado de las actividades realizadas en el sistema durante el período actual. 
            Los datos incluyen información sobre usuarios, operaciones financieras, y estado de los procesos.
          </p>
        </div>

        {/* Tabla de datos */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detalle de Operaciones</h2>
          <div className="overflow-hidden border border-gray-300 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Concepto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cantidad</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Monto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockReportData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.concepto}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">${item.monto.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                        item.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 font-semibold">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900" colSpan={2}>TOTALES</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{totalCantidad}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">${totalMonto.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notas y observaciones */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Observaciones</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Importante:</strong> Este reporte contiene información confidencial y debe ser manejado 
                  de acuerdo con las políticas de privacidad de la organización.
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Los montos presentados son valores estimados y pueden estar sujetos a ajustes. 
            Para más información o aclaraciones, contacte al departamento de soporte técnico.
          </p>
        </div>

        {/* Pie de página del reporte */}
        <div className="border-t border-gray-300 pt-4 text-center">
          <p className="text-xs text-gray-500">
            Reporte generado automáticamente por el sistema - No requiere firma
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Página 1 de 1 - {currentDate}
          </p>
        </div>
      </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            background: white !important;
            box-shadow: none !important;
          }
          
          body {
            background: white !important;
          }
          
          /* Evitar saltos de página dentro de elementos importantes */
          table {
            page-break-inside: avoid;
          }
          
          h1, h2 {
            page-break-after: avoid;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  )
}

