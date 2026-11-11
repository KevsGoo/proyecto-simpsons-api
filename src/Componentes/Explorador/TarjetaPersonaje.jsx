import { useState } from 'react'

const limpiar = (texto) => {
    if (!texto) return ''
    return texto
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
}

export default function TarjetaPersonaje({ personaje }) {
    const [imagenRota, setImagenRota] = useState(false)
    const [episodioRoto, setEpisodioRoto] = useState(false)

    const {
        id,
        name,
        occupation,
        age,
        gender,
        status,
        description,
        phrases,
        imagen,
        episodioImagen,
        first_appearance_ep: episodio,
        first_appearance_sh: short
    } = personaje

    const frases = (phrases || []).map(limpiar).filter(Boolean).slice(0, 5)

    const datos = [
        occupation && { etiqueta: 'Oficio', valor: occupation },
        age != null && { etiqueta: 'Edad', valor: age + ' anos' },
        gender && { etiqueta: 'Genero', valor: gender },
        status && { etiqueta: 'Estado', valor: status }
    ].filter(Boolean)

    return (
        <article className="Tarjeta">
            <div className="TarjetaRetrato">
                {imagen && !imagenRota ? (
                    <img
                        className="TarjetaImagen"
                        src={imagen}
                        alt={name}
                        onError={() => setImagenRota(true)}
                    />
                ) : (
                    <div className="TarjetaImagen TarjetaSinImagen">Sin imagen</div>
                )}
                <span className="TarjetaId">#{id}</span>
            </div>

            <div className="TarjetaCuerpo">
                <h2 className="TarjetaNombre">{name}</h2>

                <ul className="TarjetaDatos">
                    {datos.map((dato) => (
                        <li key={dato.etiqueta}>
                            <span>{dato.etiqueta}</span>
                            {dato.valor}
                        </li>
                    ))}
                </ul>

                {description && (
                    <p className="TarjetaDescripcion">{limpiar(description)}</p>
                )}

                {frases.length > 0 && (
                    <div className="TarjetaBloque">
                        <h3 className="TarjetaSubtitulo">Frases iconiccas</h3>
                        <ul className="Frases">
                            {frases.map((frase, i) => (
                                <li key={i} className="Frase">
                                    {frase}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {episodio && (
                    <div className="TarjetaBloque">
                        <h3 className="TarjetaSubtitulo">Primera aparicion</h3>
                        <div className="Episodio">
                            {episodioImagen && !episodioRoto && (
                                <img
                                    className="EpisodioImagen"
                                    src={episodioImagen}
                                    alt={episodio.name}
                                    onError={() => setEpisodioRoto(true)}
                                />
                            )}
                            <div className="EpisodioTexto">
                                <p className="EpisodioNombre">{episodio.name}</p>
                                <p className="EpisodioMeta">
                                    Temporada {episodio.season}, episodio {episodio.episode_number}
                                    {episodio.airdate ? ' · ' + episodio.airdate : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {short && (
                    <div className="TarjetaBloque">
                        <h3 className="TarjetaSubtitulo">Primer short</h3>
                        <p className="EpisodioNombre">{short.name}</p>
                        {short.airdate && (
                            <p className="EpisodioMeta">{short.airdate}</p>
                        )}
                    </div>
                )}
            </div>
        </article>
    )
}
