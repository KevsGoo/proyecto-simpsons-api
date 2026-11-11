import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Explorador from './Explorador.jsx'
import NotFound from './NotFound.jsx'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Explorador />} />
                <Route path="/buscador" element={<Explorador />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}
