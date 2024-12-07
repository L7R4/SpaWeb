import { useNavigate } from 'react-router-dom';
import iconUser from 'icons/user_icon.png';
import useUsuario from '../hooks/useUsuario';
import { useState } from 'react';

export function NavBarBottom() {
    const navigate = useNavigate();
    const usuario = useUsuario();
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <nav className="navbar-bottom">
            <ul>
                <li onClick={() => navigate("/noticias")}>Noticias</li>
                {usuario && usuario.rangoUser === "Administrador" ? (
                    <li onClick={() => navigate("/solicitudes_empleo")}>Solicitudes de empleo</li>
                ) : (
                    <li onClick={() => navigate("/postularse")}>Empleo</li>
                )}

                {usuario && usuario.rangoUser === "Cliente" ? (
                    <li onClick={() => navigate("/reservas")}>Turnos</li>
                ) : (
                    usuario && usuario.rangoUser === "Administrador" ? (
                        <li onClick={() => navigate("/gestion_reservas")}>Reservas</li>
                    ) : (
                        <li onClick={() => navigate("/reservas")}>Turnos</li>
                    )
                )}

                {usuario && usuario.rangoUser === "Administrador" && (
                    <>
                        <li onClick={() => navigate("/usuarios")}>Usuarios</li>
                        <li onClick={() => navigate("/servicios")}>Servicios</li>
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
                                    <li onClick={() => navigate("/mis_reservas")}>Mis reservas</li>
                                )}
                                <li onClick={() => {/* log out function */}}>Cerrar sesión</li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <li onClick={() => navigate("/iniciar_sesion")}>Iniciar sesión</li>
                )}
            </ul>
        </nav>
    );
}



