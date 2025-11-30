import { Link as RouterLink } from 'react-router-dom'

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="header-title">Sistema TFI</h1>
        <nav className="nav">
          <RouterLink className="nav-link" to="/home">Home</RouterLink>
          <RouterLink className="nav-link" to="/records">Registros</RouterLink>
          <RouterLink className="nav-link" to="/users">Usuarios</RouterLink>
          <RouterLink className="nav-link" to="/report">Reporte</RouterLink>
        </nav>
      </div>
    </header>
  )
}
