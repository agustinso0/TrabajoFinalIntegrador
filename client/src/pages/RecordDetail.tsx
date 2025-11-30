import { useParams } from 'react-router-dom'

export function RecordDetail() {
  const { id } = useParams()
  return (
    <div>
      <h2 className="page-title">Detalle de registro</h2>
      <div className="mb-4">ID: {id}</div>
      <div className="hstack">
        <button className="btn btn-primary">Editar</button>
        <button className="btn btn-danger">Eliminar</button>
      </div>
    </div>
  )
}

