# proyecto-simpsons-api

Explorador web de **The Simpsons API**. Escribes el id numerico de un personaje y
la app consulta el API y te muestra su ficha completa con retrato.

El backend es un **proxy Express**: no guarda datos, solo traduce y reenvia las
peticiones a `thesimpsonsapi.com`.

## Puesta en marcha

Hace falta levantar dos procesos: el backend (la API) y el frontend (Vite).

```bash
npm install

# terminal 1 -> API en http://localhost:3000
npm run dev:api

# terminal 2 -> app en http://localhost:5173
npm run dev
```

Abre <http://localhost:5173>.

## Scripts

| Script | Que hace |
|---|---|
| `npm run dev` | Levanta Vite en modo desarrollo (puerto 5173) |
| `npm run dev:api` | Levanta el backend Express con nodemon (puerto 3000) |
| `npm run build` | Genera el build de produccion en `dist/` |
| `npm start` | Sirve el build de `dist/` + la API desde Express (puerto 3000) |
| `npm run lint` | ESLint |
| `npm run preview` | Previsualiza el build de `dist/` |

## Interfaz

| Ruta | Que hace |
|---|---|
| `/` | Explorador: buscador por id + ficha del personaje |
| `/buscador` | Alias de la anterior |
| `*` | Pagina 404 con enlace de vuelta |

La unica forma de consultar es **escribir el id y pulsar Buscar**. La ficha del
personaje muestra retrato, nombre, oficio, edad, genero, estado, descripcion,
frases iconiccas, primera aparicion (con su imagen de episodio) y primer short.

Los campos de la ficha son datos crudos del API:

| Campo en pantalla | Campo del API |
|---|---|
| Nombre | `name` |
| Oficio | `occupation` |
| Edad | `age` |
| Genero | `gender` |
| Estado | `status` |
| Descripcion | `description` |
| Frases iconiccas | `phrases` |
| Primera aparicion | `first_appearance_ep` |
| Primer short | `first_appearance_sh` |
| Retrato | `portrait_path` (el backend lo convierte en URL absoluta) |

## API

Endpoint principal:

```
GET /api/personaje/:id
```

Ejemplo:

```bash
curl http://localhost:3000/api/personaje/1
```

```json
{
  "id": 1,
  "name": "Homer Simpson",
  "occupation": "Safety Inspector",
  "age": 39,
  "gender": "Male",
  "status": "Alive",
  "description": "Homer Jay Simpson (born May 12, 1956) is a man from Springfield ...",
  "phrases": ["Doh!", "Woo-hoo!", "..."],
  "portrait_path": "/character/1.webp",
  "imagen": "https://cdn.thesimpsonsapi.com/500/character/1.webp",
  "episodioImagen": "https://cdn.thesimpsonsapi.com/500/episode/1.webp",
  "first_appearance_ep": { "name": "Simpsons Roasting on an Open Fire", "season": 1, "episode_number": 1 },
  "first_appearance_sh": { "name": "Good Night", "airdate": "1987-04-19" }
}
```

Rutas disponibles:

| Ruta | Descripcion |
|---|---|
| `GET /api` o `GET /api/salud` | Health check |
| `GET /api/personaje/:id` | Personaje por id |
| `GET /personaje/:id` | Alias del anterior |

Errores:

| Codigo | Cuando |
|---|---|
| `400` | El id no es un numero entero positivo |
| `404` | No existe ningun personaje con ese id |
| `502` | La API de The Simpsons no responde o no se pudo conectar |

### Que hace el backend por ti

El API original devuelve `portrait_path: "/character/1.webp"`, una **ruta
relativa que da 404** si la pintas tal cual. Las imagenes reales estan en
`https://cdn.thesimpsonsapi.com/500{portrait_path}`. El backend anade esas URLs
absolutas (`imagen`, `episodioImagen`, `shortImagen`), valida el id y traduce los
errores del API externo a mensajes claros.

## Probar la API con Thunder Client

Thunder Client es la extension de VS Code que permite lanzar peticiones HTTP
(como Postman o Insomnia) sin salir del editor. Aqui se usa para probar los
endpoints del backend a pelo, sin pasar por la interfaz.

En `api.http` hay las peticiones ya escritas. Abre ese archivo en VS Code y
pulsa **Send Request** encima de cualquier bloque (o **Send All** para todas).
Hace falta el backend arriba: `npm run dev:api`.

Tambien puedes probarlo desde la terminal:

```bash
curl http://localhost:3000/api/personaje/1
```

## Como se conecta el front con la API

En desarrollo, Vite hace de proxy: el front llama a `/api/personaje/:id` y Vite lo
reenvia al Express del puerto 3000 (ver `vite.config.js`).

En produccion, Express sirve el build (`dist/`) y la API desde el mismo origen,
asi que no hace falta proxy.

## Estructura

```
app.js                     backend Express (proxy)
api.http                   peticiones de ejemplo para Thunder Client
vite.config.js             proxy /api -> localhost:3000 en desarrollo
src/
  main.jsx
  Pages/
    App.jsx                rutas
    Explorador.jsx         pagina principal del explorador
    NotFound.jsx
  Componentes/
    Explorador/
      TarjetaPersonaje.jsx  ficha del personaje
      Cargando.jsx          esqueleto de carga
  Style/
    Global.css             estilos base y fondo de cielo
    Explorador.css
    NotFound.css
  img/
    cielo.svg              cielo con nubes planas (fondo)
```

## Stack

React 19 + Vite 8 + React Router 7 para el front, Express 5 para el back.
Sin base de datos: nada se persiste, cada consulta va contra el API externo.
