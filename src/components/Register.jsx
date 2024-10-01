import React from 'react';
import { useForm } from 'react-hook-form';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore , doc, setDoc} from 'firebase/firestore';
import appFirebase from '../../credentials';
import { useNavigate } from "react-router-dom";
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

import userIcon from '../assets/icons/iconoUser.svg';
import uploadIcon from '../assets/icons/icono-upload.svg';

export function Register() {
    const { register, handleSubmit, setError, clearErrors } = useForm();
    const auth = getAuth(appFirebase);
    const firestore = getFirestore(appFirebase);
    const navigate = useNavigate();

    const [mensaje, setMensaje] = React.useState('');
    const [mensajeError, setMensajeError] = React.useState('');

    const enviar = async (data) => {
        const {email, password, nombreCompleto} = data;
        try {
            const infoUser = await createUserWithEmailAndPassword(auth, email, password).then((usuario)=>{
                return usuario;
            })
            const docuRef = doc(firestore, `usuarios/${infoUser.user.uid}`);
            setDoc(docuRef, {
                email: email,
                rango: "Cliente",
                nombreCompleto: nombreCompleto
            });
            
            // setMensaje('¡Registro exitoso!');
            navigate("/");

            setMensajeError('');
            clearErrors();

        } catch (error) {
            setMensaje('');
            setMensajeError('Error al registrar el usuario. Intenta de nuevo.');
            console.error("Error al registrar el usuar io: ", error);
        }
    };


    return (
        <>
        <Header />
        <section className="register">
            <div className="register-contenedor">
                <img src={userIcon} className="user-image" alt="User Icon" />
                <form id="register-form" onSubmit={handleSubmit(enviar)}>
                    <label htmlFor="email">Nombre completo</label>
                    <input type="text" id="nombreCompleto" name="nombreCompleto" required {...register("nombreCompleto")}/>

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required {...register("email")}/>
                    <label htmlFor="password">Contraseña</label>

                    <input type="password" id="password" name="password" required {...register("password")}/>
                    {mensaje && <div className="mensaje-exito">{mensaje}</div>}
                    {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
                </form>
                {/* <div className="upload-pic">
                    <img src={uploadIcon} alt="Upload Icon" />
                    <label htmlFor="profile-pic" className="custom-file-upload">Cargar foto de perfil</label>
                    <input type="file" id="profile-pic" name="profile-pic" accept="image/*" />
                </div> */}
                
                <div className="register-boton-container">
                    <input form="register-form" type="submit" value="Registrarse" className="boton-ingresar" />
                </div>
                
            </div>
            
        </section>
        <Footer />
        </>
    );
}