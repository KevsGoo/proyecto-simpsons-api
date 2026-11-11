const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

const PUERTO = process.env.PORT || 3000
const API_SIMPSONS = 'https://thesimpsonsapi.com/api/characters'
const CDN = 'https://cdn.thesimpsonsapi.com/500'

app.use(cors())

// las imagenes del API vienen como rutas relativas ("/character/1.webp")
const urlImagen = (ruta) => {
    if (!ruta) return null
    return CDN + ruta
}

const salud = (req, res) => {
    res.json({
        ok: true,
        mensaje: 'API corriendo',
        rutas: {
            personaje: '/personaje/:id',
            api: '/api/personaje/:id'
        }
    })
}

const buscarPersonaje = async (req, res) => {
    const id = String(req.params.id).trim()

    if (!/^\d+$/.test(id) || Number(id) < 1) {
        return res.status(400).json({
            error: 'El id debe ser un numero entero positivo.'
        })
    }

    try {
        const response = await fetch(API_SIMPSONS + '/' + id)

        if (response.status === 404) {
            return res.status(404).json({
                error: 'No existe ningun personaje con el id ' + id + '.'
            })
        }

        if (!response.ok) {
            return res.status(502).json({
                error: 'La API de The Simpsons no respondio correctamente.'
            })
        }

        const data = await response.json()

        res.status(200).json({
            ...data,
            imagen: urlImagen(data.portrait_path),
            episodioImagen: urlImagen(data.first_appearance_ep?.image_path),
            shortImagen: urlImagen(data.first_appearance_sh?.image_path)
        })
    } catch (error) {
        console.error('Error consultando la API de The Simpsons:', error.message)
        res.status(502).json({
            error: 'No se pudo conectar con la API de The Simpsons.'
        })
    }
}

// health check de la API (la raiz "/" la sirve la SPA)
app.get('/api', salud)
app.get('/api/salud', salud)

app.get('/personaje/:id', buscarPersonaje)
app.get('/api/personaje/:id', buscarPersonaje)

// sirve el build de produccion
app.use(express.static(path.join(__dirname, 'dist')))

// fallback de la SPA (React Router)
app.use((req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.path.startsWith('/api') || req.path.startsWith('/personaje')) return next()
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PUERTO, () => {
    console.log('API corriendo en http://localhost:' + PUERTO)
})
