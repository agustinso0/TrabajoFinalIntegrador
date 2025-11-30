import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faCalendarCheck, faDollarSign, faChartLine, faUserPlus, faCalendarPlus, faChartBar, faFileExport, faCog, faBell, faEye, faPlus, faDownload, faPrint } from '@fortawesome/free-solid-svg-icons'

export function Home() {
  const [animatedValues, setAnimatedValues] = useState({ users: 0, reservations: 0, income: 0 })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const animateValue = (key: keyof typeof animatedValues, target: number, duration: number) => {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setAnimatedValues(prev => ({ ...prev, [key]: target }))
          clearInterval(timer)
        } else {
          setAnimatedValues(prev => ({ ...prev, [key]: Math.floor(start) }))
        }
      }, 16)
    }

    // Simular carga de datos
    setTimeout(() => {
      animateValue('users', 1247, 2000)
      animateValue('reservations', 892, 2500)
      animateValue('income', 45680, 3000)
    }, 500)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const metrics = [
    {
      title: 'Usuarios Activos',
      value: animatedValues.users.toLocaleString(),
      icon: faUsers,
      gradient: 'from-blue-500 to-purple-600',
      description: 'Usuarios registrados en el sistema',
      trend: '+12%',
      trendColor: 'text-green-500'
    },
    {
      title: 'Reservas',
      value: animatedValues.reservations.toLocaleString(),
      icon: faCalendarCheck,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Reservas realizadas este mes',
      trend: '+8%',
      trendColor: 'text-green-500'
    },
    {
      title: 'Ingresos',
      value: formatCurrency(animatedValues.income),
      icon: faDollarSign,
      gradient: 'from-amber-500 to-orange-600',
      description: 'Ingresos totales del mes',
      trend: '+15%',
      trendColor: 'text-green-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Panel Principal
            </h1>
            <p className="text-slate-600 text-lg">
              Bienvenido de vuelta, gestiona tu sistema con facilidad
            </p>
          </div>
          <div className="mt-4 lg:mt-0 glass rounded-2xl p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium">
                {currentTime.toLocaleString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="group relative bg-white/40 backdrop-blur-lg rounded-3xl p-6 shadow-soft-xl border border-white/20 hover-lift transition-modern cursor-pointer"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Background Gradient Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={metric.icon} />
                  </div>
                  <div>
                    <h3 className="text-slate-700 font-semibold text-sm">{metric.title}</h3>
                    <p className={`text-xs ${metric.trendColor} font-medium`}>{metric.trend}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Value */}
              <div className="mb-3">
                <div className="text-3xl font-bold text-slate-800 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {metric.value}
                </div>
                <p className="text-slate-600 text-sm">{metric.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                <div 
                  className={`bg-gradient-to-r ${metric.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(parseFloat(metric.value.replace(/[^0-9]/g, '')) / 1000 * 100, 100)}%` }}
                ></div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-2 px-4 rounded-xl bg-gradient-to-r ${metric.gradient} text-white font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-6 shadow-soft-xl border border-white/20 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white mr-3">⚡</span>
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            {[
              { icon: faUserPlus, title: 'Nuevo Usuario', desc: 'Agregar usuario al sistema' },
              { icon: faCalendarPlus, title: 'Nueva Reserva', desc: 'Crear reserva para cliente' },
              { icon: faChartBar, title: 'Generar Reporte', desc: 'Ver estadísticas del mes' }
            ].map((action, index) => (
              <div key={index} className="flex items-center p-3 rounded-xl hover:bg-white/50 transition-modern cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-lg mr-3 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={action.icon} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{action.title}</h4>
                  <p className="text-sm text-slate-600">{action.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-6 shadow-soft-xl border border-white/20 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white mr-3">
              <FontAwesomeIcon icon={faChartLine} />
            </span>
            Estado del Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-green-800 font-medium">Servidor Principal</span>
              </div>
              <span className="text-green-600 text-sm font-semibold">Activo</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800 font-medium">Base de Datos</span>
              </div>
              <span className="text-blue-600 text-sm font-semibold">Conectada</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-purple-800 font-medium">API Externa</span>
              </div>
              <span className="text-purple-600 text-sm font-semibold">Operativa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}