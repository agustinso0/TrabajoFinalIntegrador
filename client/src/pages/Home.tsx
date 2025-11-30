export function Home() {
  return (
    <div>
      <h2 className="page-title">Panel principal</h2>
      <div className="grid3">
        <div className="card">
          <div className="stat">
            <div className="stat-label">Usuarios</div>
            <div className="stat-value">0</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-label">Reservas</div>
            <div className="stat-value">0</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-label">Ingresos</div>
            <div className="stat-value">$0</div>
          </div>
        </div>
      </div>
    </div>
  )
}
