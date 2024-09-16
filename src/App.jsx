import { BrowserRouter, Route, Routes } from "react-router-dom";


import { Home } from "./pages/home";
import Noticias from "./components/noticias/Noticias";
import { Login } from "./components/Login";
import { Turnos } from "./components/turnos/Turno_client";
import { ReservasAdmin } from "./components/HistorialReservas-admin";
import { MisReservas } from "./components/MisReservas-cliente";
import { EmpleoAdmin } from "./components/Empleo-admin";
import { UsuarioAdmin } from "./components/Usuario-admin";
import { ServicioAdmin } from "./components/Servicio-admin";
import { Empleo } from "./components/Empleo";





function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/iniciar_sesion" element={<Login />} />
          <Route path="/reservas" element={<Turnos />} />
          <Route path="/gestion_reservas" element={<ReservasAdmin />} />
          <Route path="/mis_reservas" element={<MisReservas />} />
          <Route path="/postularse" element={<Empleo />} />
          <Route path="/solicitudes_empleo" element={<EmpleoAdmin />} />
          <Route path="/usuarios" element={<UsuarioAdmin />} />
          <Route path="/servicios" element={<ServicioAdmin />} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App;
