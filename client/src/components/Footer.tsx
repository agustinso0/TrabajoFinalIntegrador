import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faUsers } from '@fortawesome/free-solid-svg-icons'

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const teamMembers = [
    { name: 'Tordini Bautista', role: 'Frontend Developer' },
    { name: 'Juan Ignacio Martinez', role: 'Backend Developer' },
    { name: 'Agustin Loss', role: 'UI/UX Designer' },
    { name: 'Darian Savenia', role: 'Project Manager' }
  ]

  const socialLinks = [
    { name: 'GitHub', icon: faGithub, url: '#' },
    { name: 'LinkedIn', icon: faLinkedin, url: '#' },
    { name: 'Email', icon: faEnvelope, url: '#' }
  ]

  return (
    <footer className="bg-white/60 backdrop-blur-lg border-t border-white/20 shadow-soft" role="contentinfo">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="group relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-modern">
                    <span className="text-white font-bold text-lg">TFI</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-modern"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Sistema TFI
                  </h3>
                  <p className="text-sm text-slate-500">Trabajo Final Integrador</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                Sistema integral de gestión desarrollado como Trabajo Final Integrador. 
                Diseñado con tecnologías modernas para ofrecer una experiencia intuitiva y eficiente.
              </p>
            </div>

            {/* Team Section */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs mr-2 p-1" />
                Equipo de Desarrollo
              </h4>
              <div className="space-y-2">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-modern group">
                    <div className="w-6 h-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-xs group-hover:from-blue-100 group-hover:to-blue-200 transition-modern">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links & Info */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                <span className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs mr-2">i</span>
                Información
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <span className="text-sm text-green-800 font-medium">Estado del Sistema</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-semibold">Operativo</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium mb-1">Versión del Sistema</p>
                  <p className="text-sm font-mono text-blue-600">v1.0.0-prototype</p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <p className="text-xs text-purple-800 font-medium mb-1">Última Actualización</p>
                  <p className="text-xs text-purple-600">
                    {currentTime.toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20"></div>

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-sm text-slate-600">
                © {currentYear} <span className="font-medium text-slate-800">Sistema TFI</span>. Todos los derechos reservados.
              </p>
              <div className="hidden md:flex items-center space-x-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm hover:from-blue-100 hover:to-blue-200 hover:text-blue-600 transition-modern group"
                    title={link.name}
                  >
                    <FontAwesomeIcon icon={link.icon} className="group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Sistema Operativo</span>
              </div>
              <div className="hidden md:block">
                <span className="font-mono">Node.js v20+</span>
              </div>
              <div className="hidden md:block">
                <span>Powered by React + TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}