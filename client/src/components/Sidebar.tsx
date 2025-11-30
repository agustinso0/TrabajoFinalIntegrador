import { Link as RouterLink } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-links">
        <RouterLink className="sidebar-link" to="/home">Inicio</RouterLink>
        <RouterLink className="sidebar-link" to="/profile">Perfil</RouterLink>
        <RouterLink className="sidebar-link" to="/users">Usuarios</RouterLink>
        <RouterLink className="sidebar-link" to="/abm">Formularios</RouterLink>
        <RouterLink className="sidebar-link" to="/records">Registros</RouterLink>
        <RouterLink className="sidebar-link" to="/report">Imprimir reporte</RouterLink>
        <RouterLink className="sidebar-link" to="/query-report">Consulta + Reporte</RouterLink>
      </div>
    </aside>
  )
}

