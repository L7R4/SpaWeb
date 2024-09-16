import { db, storage } from '../../credentials.js'; // Asegúrate de que estos importes son correctos
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// import { ref, getDownloadURL } from 'firebase/storage';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function ReservasAdmin() {
    const [reservas, setReservas] = useState([]);

    // Función para obtener las reservas de empleo desde Firebase
    const fetchReservas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'reservasServicios'));
            const reservasList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReservas(reservasList);
        } catch (error) {
            console.error('Error fetching reservas: ', error);
        }
    };

    // Obtener los datos cuando el componente se monta
    useEffect(() => {
        fetchReservas();
    }, []);


    return (
        <>
            <Header />
            <div className="empleo-admin">
                <h1>Reservas</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Horario</th>
                            <th>Servicios</th>
                            <th>Costo total</th>


                        </tr>
                    </thead>
                    <tbody>
                        {reservas.length > 0 ? (
                            reservas.map((reserva) => (
                                <tr key={reserva.fecha + " " + reserva.horario}>
                                    <td>{reserva.fecha}</td>
                                    <td>{reserva.horario}</td>
                                    <td>
                                        <ul>
                                            {reserva.services.map((servicio) => (
                                                <li key={servicio.nombre}>{servicio.nombre} - ${servicio.precio} </li>
                                            ))}
                                        </ul>
                                    </td>

                                    <td>${reserva.costoTotal}</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No hay reservas de empleo disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>

    );
}