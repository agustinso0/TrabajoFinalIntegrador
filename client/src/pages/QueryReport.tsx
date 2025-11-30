export function QueryReport() {
  return (
    <div className="card">
      <h2 className="page-title">Consulta + Reporte</h2>
      <div className="stack mb-4">
        <input className="input" placeholder="Buscar" />
        <select className="select" defaultValue="todos">
          <option value="todos">Todos</option>
        </select>
        <button className="btn btn-primary">Consultar</button>
      </div>
      <div>Resultados y opciones de reporte</div>
    </div>
  )
}

