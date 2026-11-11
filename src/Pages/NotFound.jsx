import { Link } from 'react-router-dom'
import '../Style/NotFound.css'

export default function NotFound() {
    return (
        <div className="NoEncontrado">
            <p className="NoEncontradoKicker">Error 404</p>
            <h1 className="NoEncontradoCodigo">No encontrado</h1>
            <p className="NoEncontradoTexto">
                Esa ruta no existe en el explorador. Vuelve al buscador para
                consultar un personaje.
            </p>
            <Link to="/" className="NoEncontradoBoton">
                Volver al buscador
            </Link>
        </div>
    )
}
