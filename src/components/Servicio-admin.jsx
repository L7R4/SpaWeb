import { db } from '../../credentials';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, deleteDoc } from 'firebase/firestore'; // Para obtener y agregar datos
import Swal from 'sweetalert2';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function ServicioAdmin() {
    const [servicios, setServicios] = useState([]);
    const [nuevoServicio, setNuevoServicio] = useState({
        profesional: '',
        precio: '',
        nombre: ''
    });

    // Función para obtener los servicios desde Firebase
    const fetchServicios = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'servicios'));
            const serviciosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServicios(serviciosList);
        } catch (error) {
            console.error('Error fetching servicios: ', error);
        }
    };

    // Función para eliminar un servicio
    const eliminarServicio = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo'
        });

        if (resultado.isConfirmed) {
            try {
                await deleteDoc(doc(db, 'servicios', id));
                fetchServicios(); // Actualizar la lista después de eliminar
                Swal.fire('¡Eliminado!', 'El servicio ha sido eliminado.', 'success');
            } catch (error) {
                console.error('Error deleting servicio: ', error);
            }
        }
    };

    // Obtener los datos cuando el componente se monta
    useEffect(() => {
        fetchServicios();
    }, []);

    // Manejar el cambio en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoServicio({
            ...nuevoServicio,
            [name]: value
        });
    };

    // Función para agregar un nuevo servicio
    const agregarServicio = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'servicios'), nuevoServicio);
            fetchServicios(); // Volver a obtener los servicios
            setNuevoServicio({ profesional: '', precio: '', nombre: '' }); // Limpiar el formulario
        } catch (error) {
            console.error('Error adding servicio: ', error);
        }
    };

    return (
        <>
            <Header />
            <h1>Administración de Servicios</h1>
            <form onSubmit={agregarServicio}>
                <div className="inputsWrapper">
                    <input
                        type="text"
                        placeholder="Nombre del servicio"
                        value={nuevoServicio.nombre}
                        onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Profesional"
                        value={nuevoServicio.profesional}
                        onChange={(e) => setNuevoServicio({ ...nuevoServicio, profesional: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Precio"
                        value={nuevoServicio.precio}
                        onChange={(e) => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
                        required
                    />

                </div>

                <button id="buttonSubmitServicio" type="submit">Agregar Servicio</button>
            </form>


            <ul className="wrapperListServices">
                {servicios.map(servicio => (
                    <li key={servicio.id}>
                        <div className="coreInfoContainer">
                            <div className="containerInfo">
                                <h2>Servicio</h2>
                                <h3>{servicio.nombre}</h3>
                            </div>
                            <div className="containerInfo">
                                <h2>Profesional</h2>
                                <h3>{servicio.profesional}</h3>
                            </div>
                            <div className="containerInfo">
                                <h2>Precio</h2>
                                <h3>${servicio.precio}</h3>
                            </div>
                        </div>
                        <button onClick={() => eliminarServicio(servicio.id)}>Eliminar</button>
                    </li>
                ))}

            </ul>
            <Footer />
        </>
    );
}