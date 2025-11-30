export function Report() {
  const onPrint = () => {
    window.print()
  }
  return (
    <div>
      <h2 className="page-title">Reporte</h2>
      <div className="mb-4">Vista lista para impresión</div>
      <button className="btn btn-primary" onClick={onPrint}>Imprimir</button>
    </div>
  )
}

