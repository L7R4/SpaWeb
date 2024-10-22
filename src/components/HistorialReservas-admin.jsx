
import { db } from '../../credentials.js'; 
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Sidebar  from './Sidebar/SideBar.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUsuario from '../hooks/useUsuario';

import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar el plugin de tablas para jsPDF

export function ReservasAdmin() {
    const [reservas, setReservas] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState(null); // Filtro por fecha
    const [servicioFiltro, setServicioFiltro] = useState(''); // Filtro por servicio
    const [profesionalFiltro, setProfesionalFiltro] = useState(''); // Filtro por profesional
    const [servicios, setServicios] = useState([]); // Lista de servicios disponibles
    const [profesionales, setProfesionales] = useState([]); // Lista de profesionales disponibles
    let usuario = useUsuario()
    
    // Función para obtener las reservas de Firebase
    const fetchReservas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'reservasServicios'));
            const reservasList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Si el usuario tiene el rol de "Profesional", filtrar sus reservas

            if (usuario && usuario.rangoUser === 'Profesional') {
                const reservasFiltradas = reservasList.filter(reserva => 
                    reserva.services.some(servicio => 
                        servicio.profesional.nombre === usuario.displayName
                    )
                ).map(reserva => {
                    const serviciosFiltrados = reserva.services.filter(servicio => 
                        servicio.profesional.nombre === usuario.displayName
                    );
    
                    // Calcular el costo total basado en los servicios filtrados
                    const costoTotal = serviciosFiltrados.reduce((total, servicio) => total + servicio.precio, 0);
    
                    return {
                        ...reserva,
                        services: serviciosFiltrados,
                        costoTotal // Agregar el costo total calculado a la reserva
                    };
                });
                setReservas(reservasFiltradas);
            } else {
                // Para usuarios no profesionales, puedes mantener el cálculo normal
                const reservasConCostos = reservasList.map(reserva => {
                    const costoTotal = reserva.services.reduce((total, servicio) => total + servicio.precio, 0);
                    return {
                        ...reserva,
                        costoTotal
                    };
                });
                setReservas(reservasConCostos);
            }
        } catch (error) {
            console.error('Error fetching reservas: ', error);
        }
    };

    // Función para obtener servicios desde la colección "servicios"
    const fetchServicios = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'servicios'));
            const serviciosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Si el usuario es profesional, mostrar solo los servicios que ofrece
            if (usuario && usuario.rangoUser === 'Profesional') {
                const serviciosFiltrados = serviciosList.filter(servicio => 
                    servicio.profesional.nombre === usuario.displayName
                );
                setServicios(serviciosFiltrados);
            } else {
                setServicios(serviciosList); // Si no es profesional, mostrar todos los servicios
            }
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
        if(usuario){
            fetchReservas();
        }
        fetchServicios();
        fetchProfesionales();
    }, [usuario]);

   

    // Función para filtrar las reservas
    const filtrarReservas = () => {
        return reservas.filter(reserva => {
            const fechaValida = fechaFiltro ? reserva.fecha === formatearFecha(fechaFiltro) : true; // Comparar formato "dd/MM/yyyy"
            const servicioValido = servicioFiltro ? reserva.services.some(servicio => servicio.nombre === servicioFiltro) : true;
            const profesionalValido = profesionalFiltro ? reserva.services.some(servicio => servicio.profesional.nombre === profesionalFiltro) : true;
            return fechaValida && servicioValido && profesionalValido;
        });
    };


    const exportarPDF = () => {
        const doc = new jsPDF();

        doc.text('Listado de Reservas', 14, 10);
        const reservasFiltradas = filtrarReservas();

        if (reservasFiltradas.length > 0) {
            // Crear la tabla con las reservas filtradas
            const tablaDatos = reservasFiltradas.map(reserva => [
                reserva.fecha, 
                reserva.horario, 
                reserva.services.map(servicio => `${servicio.nombre} (${servicio.profesional.nombre})`).join(', '), 
                `$${reserva.costoTotal}`
            ]);

            // Crear la tabla en el PDF usando autoTable
            doc.autoTable({
                head: [['Fecha', 'Horario', 'Servicios', 'Costo Total']],
                body: tablaDatos,
            });

            doc.save('reservas.pdf');
        } else {
            alert('No hay reservas para exportar.');
        }
    };

    return (
        <div className='containerLoged'>
            <Sidebar />
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
                    {usuario && usuario.rangoUser === "Administrador" && (
                       <div>
                            <label>Filtrar por Profesional:</label>
                            <select value={profesionalFiltro} onChange={(e) => setProfesionalFiltro(e.target.value)}>
                                <option value="">Todos los profesionales</option>
                                {profesionales.map(profesional => (
                                    <option key={profesional.id} value={profesional.nombreCompleto}>{profesional.nombreCompleto}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                {/* Botón para exportar PDF */}
                <button id="buttonExportData" onClick={exportarPDF}>Exportar Datos</button>
                </div>

                {/* Tabla de reservas */}
                <table className='tableDataReservas'>
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
                                                <li key={servicio.nombre}>{servicio.nombre} - ${servicio.precio} por {servicio.profesional.nombre} </li>
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
        </div>
    );
}