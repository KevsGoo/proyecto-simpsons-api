export default function Cargando() {
    return (
        <div className="Cargando" role="status" aria-live="polite">
            <div className="CargandoRetrato" />
            <div className="CargandoCuerpo">
                <div className="CargandoLinea CargandoLineaGrande" />
                <div className="CargandoLinea CargandoLineaMedia" />
                <div className="CargandoLinea CargandoLineaCorta" />
                <span className="CargandoTexto">Consultando la API...</span>
            </div>
        </div>
    )
}
