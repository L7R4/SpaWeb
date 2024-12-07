import { BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import { useEffect } from "react";


import { Home } from "./pages/home";
import Noticias from "./components/noticias/Noticias";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Turnos } from "./components/turnos/Turno_client";
import { ReservasAdmin } from "./components/HistorialReservas-admin";
import { MisReservas } from "./components/MisReservas-cliente";
import { EmpleoAdmin } from "./components/Empleo-admin";
import { UsuarioAdmin } from "./components/Usuario-admin";
import { ListadoClientes } from "./components/ListadoClientes";
import { ServicioAdmin } from "./components/Servicio-admin";
import { Empleo } from "./components/Empleo";
import { ListadoPagos } from "./components/ListadoPagos";





function App() {
  return (
    <>
      <BrowserRouter>
        <InitialRedirect />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/iniciar_sesion" element={<Login />} />
          <Route path="/registrase" element={<Register />} />

          <Route path="/reservas" element={<Turnos />} />
          <Route path="/gestion_reservas" element={<ReservasAdmin />} />
          <Route path="/mis_reservas" element={<MisReservas />} />
          <Route path="/postularse" element={<Empleo />} />
          <Route path="/solicitudes_empleo" element={<EmpleoAdmin />} />
          <Route path="/usuarios" element={<UsuarioAdmin />} />
          <Route path="/servicios" element={<ServicioAdmin />} />
          <Route path="/listado_clientes" element={<ListadoClientes />} />
          <Route path="/listado_pagos" element={<ListadoPagos />} />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App;

// Componente para manejar la redirección inicial
function InitialRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Detectar si la aplicación se abre desde la pantalla de inicio
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;

    if (isPWA) {
      // Redirige a "iniciar_sesion" si es una PWA
      navigate("/iniciar_sesion");
    }

    // Redirigir automáticamente al instalar la PWA
    window.addEventListener("appinstalled", () => {
      navigate("/iniciar_sesion");
    });

    return () => {
      window.removeEventListener("appinstalled", () => {});
    };
  }, [navigate]);

  return null; // No renderiza nada
}