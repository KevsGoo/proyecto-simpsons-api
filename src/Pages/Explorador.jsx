import { useState } from 'react'
import '../Style/Explorador.css'
import TarjetaPersonaje from '../Componentes/Explorador/TarjetaPersonaje.jsx'
import Cargando from '../Componentes/Explorador/Cargando.jsx'

const TOTAL_PERSONAJES = 1182

export default function Explorador() {
    const [id, setId] = useState('')
    const [personaje, setPersonaje] = useState(null)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const consultar = async (numero) => {
        setCargando(true)
        setError('')

        try {
            const respuesta = await fetch('/api/personaje/' + numero)
            const datos = await respuesta.json()

            if (!respuesta.ok) {
                throw new Error(datos.error || 'No se pudo obtener el personaje.')
            }

            setPersonaje(datos)
            setId(String(numero))
        } catch (err) {
            setPersonaje(null)
            setError(
                err instanceof TypeError
                    ? 'No hay conexion con el servidor de la API. Levanta el backend con "npm run dev:api" en otra terminal.'
                    : err.message
            )
        }

        setCargando(false)
    }

    const buscar = (e) => {
        e.preventDefault()
        const numero = Number(String(id).trim())

        if (!Number.isInteger(numero) || numero < 1) {
            setError('Escribe un numero valido, por ejemplo 1.')
            setPersonaje(null)
            return
        }

        consultar(numero)
    }

    return (
        <div className="Explorador">
            <main className="ExploradorMain">
                <section className="Hero">
                    <p className="HeroKicker">The Simpsons API</p>
                    <h1 className="HeroTitulo">Explora Springfield</h1>
                    <p className="HeroTexto">
                        Escribe el id numerico de un personaje y consulta la API.
                        Hay {TOTAL_PERSONAJES} personajes disponibles, de Homer a Apu.
                    </p>

                    <form className="Buscador" onSubmit={buscar} noValidate>
                        <label className="BuscadorEtiqueta" htmlFor="personaje-id">
                            Id del personaje
                        </label>
                        <div className="BuscadorFila">
                            <input
                                id="personaje-id"
                                name="personaje-id"
                                className="BuscadorInput"
                                type="number"
                                min="1"
                                step="1"
                                inputMode="numeric"
                                placeholder="1"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                aria-label="Id del personaje"
                            />
                            <button type="submit" className="BuscadorBoton" disabled={cargando}>
                                {cargando ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                    </form>
                </section>

                {error && (
                    <p className="Error" role="alert">
                        {error}
                    </p>
                )}

                {cargando && <Cargando />}

                {!cargando && personaje && (
                    <TarjetaPersonaje personaje={personaje} />
                )}

                {!cargando && !personaje && !error && (
                    <p className="Pista">
                        Todavia no has consultado a nadie. Escribe un id y dale a Buscar.
                    </p>
                )}
            </main>
        </div>
    )
}
