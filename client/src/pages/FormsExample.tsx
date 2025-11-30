export function FormsExample() {
  return (
    <div className="card">
      <h2 className="page-title">Ejemplo de formulario</h2>
      <div className="stack">
        <input className="input" placeholder="Título" />
        <textarea className="textarea" placeholder="Descripción" />
        <select className="select" defaultValue="">
          <option value="" disabled>Estado</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button className="btn btn-primary">Guardar</button>
      </div>
    </div>
  )
}

