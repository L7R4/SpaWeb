import { db, storage } from '../../credentials.js'; // Asegúrate de que estos importes son correctos
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// import { ref, getDownloadURL } from 'firebase/storage';
import Sidebar  from './Sidebar/SideBar.jsx';

export function EmpleoAdmin() {
    const [solicitudes, setSolicitudes] = useState([]);

    // Función para obtener las solicitudes de empleo desde Firebase
    const fetchSolicitudes = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'solicitudesEmpleo'));
            const solicitudesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSolicitudes(solicitudesList);
        } catch (error) {
            console.error('Error fetching solicitudes: ', error);
        }
    };

    // Obtener los datos cuando el componente se monta
    useEffect(() => {
        fetchSolicitudes();
    }, []);

    // Función para descargar el CV
    const handleDownloadCV = async (cvURL) => {
        try {
            if (!cvURL) {
                throw new Error("No se encontró la URL del CV.");
            }
            window.open(cvURL, '_blank'); // Abre el CV en una nueva pestaña para descargar
        } catch (error) {
            console.error('Error downloading CV: ', error);
        }
    };

    return (
        <div className='containerLoged'>
            <Sidebar />
            <div className="empleo-admin">
                <h1>Solicitudes de Empleo</h1>
                <table className='tableDataEmpleos'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>CV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.length > 0 ? (
                            solicitudes.map((solicitud) => (
                                <tr key={solicitud.id}>
                                    <td>{solicitud.name}</td>
                                    <td>{solicitud.email}</td>
                                    <td>
                                        <button onClick={() => handleDownloadCV(solicitud.cvURL)}>
                                            Descargar CV
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No hay solicitudes de empleo disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}