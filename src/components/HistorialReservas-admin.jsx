// import { db, storage } from '../../credentials.js'; // Asegúrate de que estos importes son correctos
// import React, { useState, useEffect } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// // import { ref, getDownloadURL } from 'firebase/storage';
// import { Header } from './Header.jsx';
// import { Footer } from './Footer.jsx';

// export function ReservasAdmin() {
//     const [reservas, setReservas] = useState([]);

//     // Función para obtener las reservas de empleo desde Firebase
//     const fetchReservas = async () => {
//         try {
//             const querySnapshot = await getDocs(collection(db, 'reservasServicios'));
//             const reservasList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setReservas(reservasList);
//         } catch (error) {
//             console.error('Error fetching reservas: ', error);
//         }
//     };

//     // Obtener los datos cuando el componente se monta
//     useEffect(() => {
//         fetchReservas();
//     }, []);


//     return (
//         <>
//             <Header />
//             <div className="empleo-admin">
//                 <h1>Reservas</h1>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Fecha</th>
//                             <th>Horario</th>
//                             <th>Servicios</th>

//                             <th>Costo total</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {reservas.length > 0 ? (
//                             reservas.map((reserva) => (
//                                 <tr key={reserva.fecha + " " + reserva.horario}>
//                                     <td>{reserva.fecha}</td>
//                                     <td>{reserva.horario}</td>
//                                     <td>
//                                         <ul>
//                                             {reserva.services.map((servicio) => (
//                                                 <li key={servicio.nombre}>{servicio.nombre} - ${servicio.precio} por {servicio.profesional} </li>
//                                             ))}
//                                         </ul>
//                                     </td>

//                                     <td>${reserva.costoTotal}</td>

//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="3">No hay reservas de empleo disponibles.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             <Footer />
//         </>

//     );
// }

import { db } from '../../credentials.js'; 
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function ReservasAdmin() {
    const [reservas, setReservas] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState(null); // Filtro por fecha
    const [servicioFiltro, setServicioFiltro] = useState(''); // Filtro por servicio
    const [profesionalFiltro, setProfesionalFiltro] = useState(''); // Filtro por profesional
    const [servicios, setServicios] = useState([]); // Lista de servicios disponibles
    const [profesionales, setProfesionales] = useState([]); // Lista de profesionales disponibles

    // Función para obtener las reservas de Firebase
    const fetchReservas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'reservasServicios'));
            const reservasList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReservas(reservasList);
        } catch (error) {
            console.error('Error fetching reservas: ', error);
        }
    };

    // Función para obtener servicios desde la colección "servicios"
    const fetchServicios = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'servicios'));
            const serviciosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServicios(serviciosList); // Guardamos la lista de servicios
        } catch (error) {
            console.error('Error fetching servicios: ', error);
        }
    };

    // Función para obtener profesionales desde la colección "usuarios", filtrando por rango "Profesional"
    const fetchProfesionales = async () => {
        try {
            const q = query(collection(db, 'usuarios'), where('rango', '==', 'Profesional'));
            const querySnapshot = await getDocs(q);
            const profesionalesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProfesionales(profesionalesList); // Guardamos la lista de profesionales
        } catch (error) {
            console.error('Error fetching profesionales: ', error);
        }
    };

    // Formatear fecha al formato "dd/MM/yyyy"
    const formatearFecha = (fecha) => {
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    // Obtener los datos cuando el componente se monta
    useEffect(() => {
        fetchReservas();
        fetchServicios();
        fetchProfesionales();
    }, []);

   

    // Función para filtrar las reservas
    const filtrarReservas = () => {
        return reservas.filter(reserva => {
            const fechaValida = fechaFiltro ? reserva.fecha === formatearFecha(fechaFiltro) : true; // Comparar formato "dd/MM/yyyy"
            const servicioValido = servicioFiltro ? reserva.services.some(servicio => servicio.nombre === servicioFiltro) : true;
            const profesionalValido = profesionalFiltro ? reserva.services.some(servicio => servicio.profesional === profesionalFiltro) : true;
            return fechaValida && servicioValido && profesionalValido;
        });
    };

    return (
        <>
            <Header />
            <div className="reservas-admin">
                <h1>Reservas</h1>

                {/* Filtros */}
                <div className="filtros">
                    {/* Filtro por fecha */}
                    <div>
                        <label>Filtrar por Fecha:</label>
                        <DatePicker
                            selected={fechaFiltro}
                            onChange={(date) => setFechaFiltro(date)}
                            dateFormat="dd/MM/yyyy"
                            isClearable
                        />
                    </div>

                    {/* Filtro por servicio */}
                    <div>
                        <label>Filtrar por Servicio:</label>
                        <select value={servicioFiltro} onChange={(e) => setServicioFiltro(e.target.value)}>
                            <option value="">Todos los servicios</option>
                            {servicios.map(servicio => (
                                <option key={servicio.id} value={servicio.nombre}>{servicio.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por profesional */}
                    <div>
                        <label>Filtrar por Profesional:</label>
                        <select value={profesionalFiltro} onChange={(e) => setProfesionalFiltro(e.target.value)}>
                            <option value="">Todos los profesionales</option>
                            {profesionales.map(profesional => (
                                <option key={profesional.id} value={profesional.nombre}>{profesional.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tabla de reservas */}
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
                        {filtrarReservas().length > 0 ? (
                            filtrarReservas().map((reserva) => (
                                <tr key={reserva.id}>
                                    <td>{reserva.fecha}</td>
                                    <td>{reserva.horario}</td>
                                    <td>
                                        <ul>
                                            {reserva.services.map((servicio) => (
                                                <li key={servicio.nombre}>{servicio.nombre} - ${servicio.precio} por {servicio.profesional} </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>${reserva.costoTotal}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No hay reservas disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
}