import { Link as RouterLink } from 'react-router-dom'

const mockRecords = Array.from({ length: 10 }).map((_, i) => ({ id: String(i + 1), nombre: `Registro ${i + 1}` }))

export function RecordsList() {
  return (
    <div>
      <h2 className="page-title">Lista de registros</h2>
      <div className="stack-row-md mb-4">
        <input className="input" placeholder="Buscar" />
        <select className="select" defaultValue="">
          <option value="" disabled>Filtro</option>
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
        </select>
        <select className="select" defaultValue="10">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <button className="btn btn-primary">Aplicar</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mockRecords.map(r => (
            <tr key={r.id}>
              <td>
                <RouterLink className="btn btn-link" to={`/records/${r.id}`}>{r.nombre}</RouterLink>
              </td>
              <td>
                <div className="hstack">
                  <button className="btn btn-sm">Editar</button>
                  <button className="btn btn-sm btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

