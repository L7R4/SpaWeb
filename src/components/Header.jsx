// import 'css/header_footer.css';
import logo from 'icons/logo.svg';
import iconUser from 'icons/user_icon.png';
import useUsuario from '../hooks/useUsuario';
import appFirebase from '../../credentials';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Swal from 'sweetalert2';

export function Header() {
    const auth = getAuth(appFirebase);
    const usuario = useUsuario();
    const navigate = useNavigate();

    // Estado para manejar la visibilidad del menú desplegable
    const [showMenu, setShowMenu] = useState(false);

    // Función para alternar la visibilidad del menú
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


    return (
        <header>
            <div className="wrapperLinkLogo" onClick={() => { navigate("/"); }}>
                <div className="logo-title">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1>Sentirse Bien</h1>
                </div>
            </div>

            <nav>
                <ul>
                    <li onClick={() => { navigate("/noticias"); }}>Noticias</li>
                    {usuario && usuario.rangoUser === "Administrador" ? (
                        <li onClick={() => { navigate("/solicitudes_empleo"); }}>Solicitudes de empleo</li>
                    ) : (
                        <li onClick={() => { navigate("/postularse"); }}>Empleo</li>
                    )}

                    {usuario && usuario.rangoUser === "Cliente" ? (
                        <li onClick={() => { navigate("/reservas"); }}>Turnos</li>
                    ) : (
                        usuario && usuario.rangoUser === "Administrador" ? (
                            <li onClick={() => { navigate("/gestion_reservas"); }}>Reservas</li>
                        ) : (
                            <li onClick={() => { navigate("/reservas"); }}>Turnos</li>
                        )
                    )}


                    {usuario && usuario.rangoUser === "Administrador" && (
                        <>
                            <li onClick={() => { navigate("/usuarios"); }}>Usuarios</li>
                            <li onClick={() => { navigate("/servicios"); }}>Servicios</li>
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
                                        <li onClick={() => { navigate("/mis_reservas"); }}>Mis reservas</li>
                                    )}
                                    <li>
                                        <button id="buttonLogout" onClick={() => handleSignOut()}>Cerrar sesión</button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <li id="itemLogin" onClick={() => { navigate("/iniciar_sesion"); }}>Iniciar sesión</li>
                    )}
                </ul>
            </nav>
        </header >
    );
}