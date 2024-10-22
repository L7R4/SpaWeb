import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from 'icons/logo.svg';
import menuIcon from 'icons/icons8-menu.svg';
import closeIcon from 'icons/icons8-close.svg';
import iconUser from 'icons/user_icon.png';
import useUsuario from '../../hooks/useUsuario';
import appFirebase from '../../../credentials';
import { getAuth, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

import IconEmpleo from 'icons/icons_empleo.svg';
import IconNoticias from 'icons/icons_noticias.svg';
import IconInicioSesion from 'icons/icons_user.svg';
import IconUsuarios from 'icons/usuarios_icon.svg';
import IconServicios from 'icons/icon_servicios.svg';
import IconListadoPagos from 'icons/icon_listadoPagos.svg';
import IconReservas from 'icons/reservas_icon.svg';
import IconCalendario from 'icons/icon_calendario.svg';






const Sidebar = () => {
  const auth = getAuth(appFirebase);
  const usuario = useUsuario();
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);

 

  const showSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleSignOut = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se cerrará tu sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut(auth);
        navigate("/");
      }
    });
  };

  return (
    <>
      <aside>
        <button id="buttonShowSideBar" onClick={showSidebar}>
          <img src={menuIcon} alt="Menu Icon" />
        </button>

        <nav className={`sidebar-nav ${sidebar ? 'active' : ''}`}>
          <div className="sidebar-wrap">
            <button id="buttonHiddenSideBar" onClick={showSidebar}>
              <img src={closeIcon} alt="Close Icon" />
            </button>
            <ul>
            {usuario && (usuario.rangoUser === "Cliente" || usuario.rangoUser === "Administrador") && (
              <li className="list-item" onClick={() => navigate("/noticias")}>
                <img src={IconNoticias} alt="Icon Noticias" />
                Noticias
              </li>
            )}

              {usuario && (
                usuario.rangoUser === "Administrador" ? (
                  <li className="list-item" onClick={() => navigate("/solicitudes_empleo")}>
                    <img src={IconEmpleo} alt="Icon Empleo" />
                    Solicitudes de empleo
                  </li>
                ) : usuario.rangoUser === "Cliente" ? (
                  <li className="list-item" onClick={() => navigate("/postularse")}>
                    <img src={IconEmpleo} alt="Icon Empleo" />
                    Empleo
                  </li>
                ) : null // No mostrar nada si no es ni Administrador ni Cliente
              )}

              {usuario && usuario.rangoUser === "Cliente" ? (
                <li className="list-item" onClick={() => navigate("/reservas")}>
                  <img src={IconCalendario} alt="Icon Turnos" />
                  Turnos
                </li>
              ) : (
                  <li className="list-item" onClick={() => navigate("/gestion_reservas")}>
                    <img src={IconReservas} alt="Icon Reservas" />
                    Reservas
                  </li>
              )}

              {usuario && (usuario.rangoUser === "Secretaria" || usuario.rangoUser === "Administrador") && (
                <>
                  <li className="list-item" onClick={() => navigate("/listado_pagos")}>
                    <img src={IconListadoPagos} alt="Icon Reservas" />
                    Listado pagos
                  </li>
                </>
              )}

              {usuario && usuario.rangoUser === "Administrador" && (
                <>
                  <li className="list-item" onClick={() => navigate("/usuarios")}>
                    <img src={IconUsuarios} alt="Icon Usuarios" />
                    Usuarios
                  </li>
                  <li className="list-item" onClick={() => navigate("/servicios")}>
                    <img src={IconServicios} alt="Icon Servicios" />
                    Servicios
                  </li>
                </>
              )}

              {usuario && usuario.rangoUser === "Cliente" && (
                <>
                  <li className="list-item" onClick={() => navigate("/mis_reservas")}>
                    <img src={IconReservas} alt="Icon Servicios" />
                    Mis reservas
                  </li>
                </>
              )}

            </ul>
            <div className="user-profile-sideBar">
                <ul className="user-menu-sideBar">
                  <li className="list-item--sideBar">
                    <button id="buttonLogout-sideBar" onClick={handleSignOut}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
            </div>
          </div>
        </nav>

    </aside>
      
      
    </>
  );
};

export default Sidebar;
