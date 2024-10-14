import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from 'icons/logo.svg';
import menuIcon from 'icons/icons8-menu.svg';
import closeIcon from 'icons/icons8-close.svg';
import iconUser from 'icons/user_icon.png';
import useUsuario from '../../hooks/useUsuario';
import appFirebase from '../../../credentials';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

// Iconos para las secciones
import IconEmpleo from 'icons/icons_empleo.svg';
import IconNoticias from 'icons/icons_noticias.svg';
import IconInicioSesion from 'icons/icons_user.svg';

const Nav = styled.div`
  background: #EDDED2;
  height: 8rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SideBarNav = styled.nav`
  background: #00584A;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SideBarWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 2rem; 
  font-size: 2rem;
  color: #EDDED2;
  padding-left: 3rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 3rem;

  img {
    margin-right: 1rem;
    width: 24px;
    height: 24px;
  }
`;

const Sidebar = () => {
  const auth = getAuth(appFirebase);
  const usuario = useUsuario();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSignOut = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se cerrará tu sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth);
      }
    });
  };

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <Nav>
        <NavIcon to="#">
          <img src={menuIcon} onClick={showSidebar} alt="Menu Icon" />
        </NavIcon>
        <div className="wrapperLinkLogo" onClick={() => { navigate("/"); }}>
          <div className="logo-title">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Sentirse Bien</h1>
          </div>
        </div>
      </Nav>
      <SideBarNav sidebar={sidebar}>
        <SideBarWrap>
          <NavIcon to="#">
            <img src={closeIcon} onClick={showSidebar} alt="Close Icon" />
          </NavIcon>
          <ul>
            <ListItem onClick={() => { navigate("/noticias"); }}>
              <img src={IconNoticias} alt="Icon Noticias" />
              Noticias
            </ListItem>

            {usuario && usuario.rangoUser === "Administrador" ? (
              <ListItem onClick={() => { navigate("/solicitudes_empleo"); }}>
                <img src={IconEmpleo} alt="Icon Empleo" />
                Solicitudes de empleo
              </ListItem>
            ) : (
              <ListItem onClick={() => { navigate("/postularse"); }}>
                <img src={IconEmpleo} alt="Icon Empleo" />
                Empleo
              </ListItem>
            )}

            {usuario && usuario.rangoUser === "Cliente" ? (
              <ListItem onClick={() => { navigate("/reservas"); }}>
                <img src={IconEmpleo} alt="Icon Turnos" />
                Turnos
              </ListItem>
            ) : (
              usuario && usuario.rangoUser === "Administrador" ? (
                <ListItem onClick={() => { navigate("/gestion_reservas"); }}>
                  <img src={IconEmpleo} alt="Icon Reservas" />
                  Reservas
                </ListItem>
              ) : (
                <ListItem onClick={() => { navigate("/reservas"); }}>
                  <img src={IconEmpleo} alt="Icon Turnos" />
                  Turnos
                </ListItem>
              )
            )}

            {usuario && usuario.rangoUser === "Administrador" && (
              <>
                <ListItem onClick={() => { navigate("/usuarios"); }}>
                  <img src={IconEmpleo} alt="Icon Usuarios" />
                  Usuarios
                </ListItem>
                <ListItem onClick={() => { navigate("/servicios"); }}>
                  <img src={IconEmpleo} alt="Icon Servicios" />
                  Servicios
                </ListItem>
              </>
            )}

            {usuario ? (
              <div className="user-profile">
                <div className="user-icon" onClick={toggleMenu}>
                  <img src={iconUser} alt="User Icon" className="user-icon-img" />
                </div>
                {showMenu && (
                  <ul className="user-menu">
                    {usuario.rangoUser === "Cliente" && (
                      <ListItem onClick={() => { navigate("/mis_reservas"); }}>
                        Mis reservas
                      </ListItem>
                    )}
                    <ListItem>
                      <button id="buttonLogout" onClick={() => handleSignOut()}>
                        Cerrar sesión
                      </button>
                    </ListItem>
                  </ul>
                )}
              </div>
            ) : (
              <ListItem id="itemLogin" onClick={() => { navigate("/iniciar_sesion"); }}>
                <img src={IconInicioSesion} alt="Icon Iniciar Sesión" />
                Iniciar sesión
              </ListItem>
            )}
          </ul>
        </SideBarWrap>
      </SideBarNav>
    </>
  );
};

export default Sidebar;
