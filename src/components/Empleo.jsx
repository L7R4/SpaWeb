import uploadIcon from '../assets/icons/icono-upload.svg';
import logoVersion3 from '../assets/icons/logoVersion3.svg';
import { useForm } from 'react-hook-form';
import { db, storage } from '../../credentials';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import useUsuario from '../hooks/useUsuario.js';
import  Sidebar  from './Sidebar/SideBar.jsx';


export function Empleo() {
    const usuario = useUsuario();

    const { register, handleSubmit, setValue } = useForm();
    const [mensaje, setMensaje] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const enviar = async (data) => {
        try {
            // Validar que haya un archivo cargado
            const cvFile = data.cv[0];
            if (!cvFile) {
                throw new Error('Debe adjuntar un archivo PDF.');
            }

            // Validar tipo de archivo
            if (cvFile.type !== 'application/pdf') {
                throw new Error('Solo se permiten archivos en formato PDF.');
            }

            // Opcional: validar tamaño del archivo (ej. máx. 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (cvFile.size > maxSize) {
                throw new Error('El archivo es demasiado grande. Tamaño máximo: 2MB.');
            }

            // Subir el archivo a Firebase Storage con nombre único
            const uniqueFileName = `${Date.now()}_${cvFile.name}`;
            const storageRef = ref(storage, `cvs/${uniqueFileName}`);
            const snapshot = await uploadBytes(storageRef, cvFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Añadir la URL del CV a los datos antes de guardarlos en Firestore
            const formDataWithCV = {
                date: new Date().toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                name: data.name,
                email: data.email,
                message: data.message,
                cvURL: downloadURL,
            };

            // Guardar en Firestore
            const solicitudesRef = collection(db, "solicitudesEmpleo");
            await addDoc(solicitudesRef, formDataWithCV);

            setMensaje('¡Solicitud enviada correctamente!');
            setMensajeError('');

            // Limpiar el formulario
            setValue('name', '');
            setValue('email', '');
            setValue('message', '');
            setValue('cv', '');

        } catch (error) {
            setMensaje('');
            setMensajeError(`Error: ${error.message}`);
            console.error("Error al enviar la solicitud: ", error);
        }
    };

    return (
        <div className={usuario ? 'containerLoged' : ''}>
            {/* Mostrar Sidebar si está logueado, si no, el Header */}
            {usuario ? <Sidebar /> : <Header />}

            {/* Aplicar clase condicionalmente */}
                <section className="empleo wrapperContent">
                    <h2>¡Trabajá con nosotros!</h2>
                    <div className="empleo-contenedor">
                        <form id="empleo-form" onSubmit={handleSubmit(enviar)}>
                            <label htmlFor="name">Nombre</label>
                            <input className="empleo-inputs" type="text" id="name" name="name" required {...register("name")} />

                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required className="empleo-inputs" {...register("email")} />

                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea className="empleo-inputs" id="mensaje" name="mensaje" rows="4" cols="50" placeholder="Escribe tu mensaje aquí..." {...register("message")}></textarea>

                            <div className="upload-cv">
                                <img src={uploadIcon} alt="Upload Icon" />
                                <label htmlFor="cv-pic" className="file-upload-cv">Adjunta tu CV (.pdf)</label>
                                <input type="file" id="cv-pic" name="cv-pic" accept="application/pdf" required {...register("cv")} />
                            </div>
                        </form>

                        <img src={logoVersion3} alt="Company Logo" />

                        <div className="enviar-boton-container">
                            <input type="submit" value="Enviar" className="boton-enviar" form="empleo-form" />
                        </div>
                        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
                        {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
                    </div>
                </section>

            {/* Mostrar Footer solo si no está logueado */}
            {!usuario && <Footer />}
        </div>
    );
}