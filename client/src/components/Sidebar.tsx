import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faUsers, faFileAlt, faClipboardList, faPrint, faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

export function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const isActive = (path: string) => location.pathname === path
  
  const navSections = [
    {
      title: 'Principal',
      items: [
        { path: '/home', label: 'Inicio', icon: faHome, description: 'Panel principal' },
        { path: '/profile', label: 'Perfil', icon: faUser, description: 'Mi cuenta' }
      ]
    },
    {
      title: 'Gestión',
      items: [
        { path: '/users', label: 'Usuarios', icon: faUsers, description: 'Administrar usuarios' },
        { path: '/abm', label: 'Formularios', icon: faFileAlt, description: 'ABM de datos' },
        { path: '/records', label: 'Registros', icon: faClipboardList, description: 'Ver registros' }
      ]
    },
    {
      title: 'Reportes',
      items: [
        { path: '/report', label: 'Imprimir Reporte', icon: faPrint, description: 'Generar reportes' },
        { path: '/query-report', label: 'Consulta + Reporte', icon: faSearch, description: 'Consultas avanzadas' }
      ]
    }
  ]

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white/60 backdrop-blur-lg border-r border-white/20 shadow-soft-xl transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-16`} role="complementary" aria-label="Navegación lateral">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">TFI</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Menú</h2>
                <p className="text-xs text-slate-500">Navegación</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/50 transition-modern text-slate-600 hover:text-slate-800"
            aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            <FontAwesomeIcon icon={isCollapsed ? faBars : faTimes} className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-4 space-y-6" role="navigation" aria-label="Menú principal">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {!isCollapsed && (
              <h3 className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <RouterLink
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-modern ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50 shadow-inner border border-blue-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  title={isCollapsed ? item.description : ''}
                >
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-modern ${
                    isActive(item.path)
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:text-blue-600'
                  }`}>
                    <FontAwesomeIcon icon={item.icon} className="text-base" />
                  </div>

                  {/* Label and Description */}
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {isActive(item.path) && (
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate group-hover:text-slate-600 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-modern ${
                    isActive(item.path) ? 'opacity-0' : ''
                  }`}></div>

                  {/* Active Glow */}
                  {isActive(item.path) && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl blur-sm"></div>
                  )}
                </RouterLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/20">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-800">Sistema</p>
                  <p className="text-xs text-green-600">Operativo</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </>
          ) : (
            <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </aside>
  )
}