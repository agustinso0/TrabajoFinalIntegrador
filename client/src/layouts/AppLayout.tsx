import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import { useState, useEffect } from 'react'

export function AppLayout() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowContent(true), 100)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
              <span className="text-white font-bold text-xl">TFI</span>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Cargando Sistema
            </h2>
            <p className="text-slate-600 text-sm">Preparando tu experiencia...</p>
            <div className="mt-4 w-32 h-1 bg-slate-200 rounded-full mx-auto">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-medium rounded-br-lg transition-all duration-300 transform -translate-y-full focus:translate-y-0 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Saltar al contenido principal
      </a>

      {/* Main Layout */}
      <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <Header />
        
        {/* Main Content Area */}
        <div className="flex flex-1 pt-16">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Content Area */}
          <main 
            id="main-content" 
            className="flex-1 p-4 lg:p-6 overflow-auto min-h-screen"
            role="main"
            aria-label="Contenido principal"
          >
            {/* Content Container with Glass Effect */}
            <div className="mx-auto">
              <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-soft-xl border border-white/20 p-4 lg:p-6 animate-fade-in-up">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="group relative">
          <button className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-soft-xl flex items-center justify-center text-white hover:shadow-soft-2xl hover-lift transition-modern group">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
              Acción Rápida
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  )
}