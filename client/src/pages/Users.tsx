const mockUsers = [
  { id: '1', nombre: 'Usuario 1', email: 'u1@email.com' },
  { id: '2', nombre: 'Usuario 2', email: 'u2@email.com' },
]

export function Users() {
  return (
    <div>
      <h2 className="page-title">Usuarios</h2>
      <button className="btn btn-green mb-4">Nuevo usuario</button>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(u => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
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

