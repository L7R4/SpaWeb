
import { db } from '../../credentials.js'; 
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUsuario from '../hooks/useUsuario';

import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar el plugin de tablas para jsPDF

export function ListadoPagos() {
    const [pagos, setPagos] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState(null); // Filtro por fecha
    const [metodoPagoFiltro, setMetodoPagoFiltro] = useState(''); // Filtro por metodo de pago

    let usuario = useUsuario()
    
    // Función para obtener las pagos de Firebase
    const fetchPagos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'pagos'));
            const pagosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPagos(pagosList)
        
        } catch (error) {
            console.error('Error fetching pagos: ', error);
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
            fetchPagos();
        }
    }, [usuario]);

   

    // Función para filtrar las pagos
    const filtrarPagos = () => {
        return pagos.filter(pago => {
            const fechaValida = fechaFiltro ? pago.fecha === formatearFecha(fechaFiltro) : true; // Comparar formato "dd/MM/yyyy"
            const pagoValido = metodoPagoFiltro ? pago.metodoPago === metodoPagoFiltro : true;
            return fechaValida && pagoValido
        });
    };


    const exportarPDF = () => {
        const doc = new jsPDF();

        doc.text('Listado de pagos', 14, 10);
        const pagosFiltrados = filtrarPagos();

        if (pagosFiltrados.length > 0) {
            // Crear la tabla con las pagos filtradas
            const tablaDatos = pagosFiltrados.map(pago => [
                pago.cliente.nombre, 
                pago.fecha,
                pago.metodoPago.charAt(0).toUpperCase() + pago.metodoPago.slice(1),
                pago.servicios.map(servicio => `${servicio.nombre} (${servicio.profesional.nombre}) $${servicio.precio}`),
                `$${pago.monto}`
            ]);

            // Crear la tabla en el PDF usando autoTable
            doc.autoTable({
                head: [['Cliente', 'Fecha', 'Metodo de pago', 'Servicios', 'Costo total']],
                body: tablaDatos,
            });

            doc.save('pagos.pdf');
        } else {
            alert('No hay pagos para exportar.');
        }
    };

    return (
        <div className='containerForUserLoged'>
            <Header />
            <div className="pagos-admin">
                <h1>Listado de pagos</h1>

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

                    {/* Filtro por fecha */}
                    <div>
                        <label>Metodo de pago:</label>
                        <select value={metodoPagoFiltro} onChange={(e) => setMetodoPagoFiltro(e.target.value)}>
                            <option value="">Todos los servicios</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta debito/credito</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </div>

                    
                {/* Botón para exportar PDF */}
                <button onClick={exportarPDF}>Exportar Datos</button>
                </div>

                {/* Tabla de pagos */}
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Metodo de pago</th>
                            <th>Servicios</th>
                            <th>Costo total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarPagos().length > 0 ? (
                            filtrarPagos().map((pago) => (
                                <tr key={pago.id}>
                                    <td>{pago.fecha}</td>
                                    <td>{pago.cliente.nombre}</td>
                                    <td>{pago.metodoPago.charAt(0).toUpperCase() + pago.metodoPago.slice(1)}</td>

                                    <td>
                                        <ul>
                                            {pago.servicios.map((servicio) => (
                                                <li key={servicio.nombre}>{servicio.nombre} ({servicio.profesional.nombre}) ${servicio.precio} </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>${pago.monto}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No hay pagos disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}