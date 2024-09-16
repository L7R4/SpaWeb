import { db } from '../../credentials'; // Asegúrate de importar Firestore correctamente
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Importar SweetAlert
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function UsuarioAdmin() {
    const [usuarios, setUsuarios] = useState([]);
    const [rangoEditado, setRangoEditado] = useState({});

    // Función para obtener los usuarios desde Firestore
    const fetchUsuarios = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'usuarios'));
            const usuariosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsuarios(usuariosList);
        } catch (error) {
            console.error('Error fetching usuarios: ', error);
        }
    };

    // Función para manejar el cambio de rango en el select
    const handleRangoChange = (userId, nuevoRango) => {
        setRangoEditado({
            ...rangoEditado,
            [userId]: nuevoRango
        });
    };

    // Función para guardar los cambios en Firestore
    const guardarCambios = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se guardarán los cambios de los rangos",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar cambios'
        });

        if (result.isConfirmed) {
            const promises = Object.keys(rangoEditado).map(async (userId) => {
                const nuevoRango = rangoEditado[userId];
                const userDoc = doc(db, 'usuarios', userId);
                await updateDoc(userDoc, { rango: nuevoRango });

                // Actualizar localmente el rango del usuario modificado
                setUsuarios((prevUsuarios) => prevUsuarios.map((usuario) =>
                    usuario.id === userId ? { ...usuario, rango: nuevoRango } : usuario
                ));
            });

            try {
                await Promise.all(promises);
                Swal.fire('¡Guardado!', 'Los rangos han sido actualizados.', 'success');
                setRangoEditado({}); // Limpiar el estado después de guardar
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al actualizar los rangos.', 'error');
            }
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <>
            <Header />
            <div className="usuario-admin">
                <h1>Administración de Usuarios</h1>
                <table className="usuario-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Rango Actual</th>
                            <th>Editar Rango</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.email}</td>
                                <td>{usuario.rango}</td>
                                <td>
                                    <select
                                        value={rangoEditado[usuario.id] || usuario.rango}
                                        onChange={(e) => handleRangoChange(usuario.id, e.target.value)}
                                    >
                                        <option value="Cliente">Cliente</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {Object.keys(rangoEditado).length > 0 && (
                    <button className="guardar-cambios-btn" onClick={guardarCambios}>
                        Guardar cambios
                    </button>
                )}
            </div>
            <Footer />
        </>
    );
}