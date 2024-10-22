import userIcon from '../assets/icons/iconoUser.svg';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

import appFirebase, { db } from '../../credentials';
import { doc, getDoc } from 'firebase/firestore';

export function Login() {
    const { register, handleSubmit } = useForm();
    const auth = getAuth(appFirebase);
    const navigate = useNavigate();

    const enviar = async (data) => {
        try {
            // Iniciar sesión con email y contraseña
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;  // Obtenemos el usuario logueado

            // Consulta a Firestore para obtener el documento del usuario por su UID
            const usuarioDocRef = doc(db, "usuarios", user.uid);
            const usuarioDoc = await getDoc(usuarioDocRef);

            if (usuarioDoc.exists()) {
                const usuarioData = usuarioDoc.data();
                // Redirigir según el rol del usuario
                if (usuarioData.rango === "Administrador") {
                    navigate("/gestion_reservas");  // Ruta para administradores
                } else if (usuarioData.rango === "Cliente") {
                    navigate("/reservas");  // Ruta para clientes
                } else if(usuarioData.rango === "Secretaria" || usuarioData.rango === "Profesional"){
                    navigate("/gestion_reservas");  // Ruta para clientes
                }

            } else {
                console.error("El documento del usuario no existe");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    return (
        <>
            <Header />
            <section className="login">
                <div className="login-contenedor">
                    <img src={userIcon} className="user-image" alt="User Icon" />
                    <form onSubmit={handleSubmit(enviar)}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required {...register("email")} />
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" required {...register("password")} />

                        <div className="register-link">
                            <p>¿No tienes cuenta?</p>
                            <a className="linkRegister" onClick={() => { navigate("/registrase"); }}>Regístrate aquí</a>
                        </div>

                        <div className="login-boton-container">
                            <input type="submit" value="Ingresar" className="boton-ingresar" />
                        </div>
                    </form>
                </div>
            </section>
            <Footer />
        </>
    );
}