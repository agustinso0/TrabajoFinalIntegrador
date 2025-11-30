export function Profile() {
  return (
    <div className="card">
      <h2 className="page-title">Perfil del usuario</h2>
      <div className="stack">
        <input className="input" placeholder="Nombre" />
        <input className="input" placeholder="Apellido" />
        <input className="input" placeholder="Teléfono" />
        <button className="btn btn-primary">Guardar cambios</button>
      </div>

      <h3 className="section-title">Cambiar contraseña</h3>
      <div className="stack">
        <input className="input" placeholder="Contraseña actual" type="password" />
        <input className="input" placeholder="Nueva contraseña" type="password" />
        <button className="btn">Actualizar contraseña</button>
      </div>
    </div>
  )
}

