import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUsers, faFileAlt, faChartBar, faSearch, faBell, faUser, faCog, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export function Header() {
  const location = useLocation()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const isActive = (path: string) => location.pathname === path
  
  const navItems = [
    { path: '/home', label: 'Inicio', icon: faHome },
    { path: '/records', label: 'Registros', icon: faFileAlt },
    { path: '/users', label: 'Usuarios', icon: faUsers },
    { path: '/report', label: 'Reportes', icon: faChartBar }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-soft" role="banner">
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="group relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-modern">
                <span className="text-white font-bold text-lg">TFI</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-modern"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Sistema TFI
              </h1>
              <p className="text-xs text-slate-500 font-medium">Gestión Integral</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-2" role="navigation" aria-label="Navegación principal">
            {navItems.map((item) => (
              <RouterLink
                key={item.path}
                to={item.path}
                className={`relative group px-4 py-2 rounded-xl text-sm font-medium transition-modern ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50 shadow-inner'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={item.icon} className="text-base" />
                  <span>{item.label}</span>
                </div>
                
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
                
                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-modern`}></div>
              </RouterLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative group hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-modern"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-modern">
              <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-1 rounded-xl hover:bg-slate-100/50 transition-modern"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">JD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-800">Juan Pérez</p>
                  <p className="text-xs text-slate-500">Administrador</p>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-2xl shadow-soft-xl border border-white/20 py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800">Juan Pérez</p>
                    <p className="text-xs text-slate-500">Administrador</p>
                  </div>
                  <RouterLink to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/50 hover:text-slate-900 transition-modern">
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Mi Perfil
                  </RouterLink>
                  <RouterLink to="/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/50 hover:text-slate-900 transition-modern">
                    <FontAwesomeIcon icon={faCog} className="mr-2" /> Configuración
                  </RouterLink>
                  <hr className="my-2 border-slate-100" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-modern">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex justify-center space-x-1 py-2 border-t border-slate-100">
          {navItems.map((item) => (
            <RouterLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-modern ${
                isActive(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <FontAwesomeIcon icon={item.icon} className="text-sm mb-1" />
              <span>{item.label}</span>
            </RouterLink>
          ))}
        </div>
      </div>
    </header>
  )
}