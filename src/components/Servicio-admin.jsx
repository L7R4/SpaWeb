import { db } from '../../credentials';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, query, where, deleteDoc } from 'firebase/firestore'; // Para obtener y agregar datos
import Swal from 'sweetalert2';
import Sidebar  from './Sidebar/SideBar.jsx';

export function ServicioAdmin() {
    const [servicios, setServicios] = useState([]);
    const [nuevoServicio, setNuevoServicio] = useState({
        profesional: {email: '', nombre: ''},
        precio: '',
        nombre: ''
    });

    const [profesionales,setProfesionales] = useState([])

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

    // Función para obtener los usuarios desde Firestore con filtro
    const fetchProfesionales = async () => {
        try {
            // Creamos la query para filtrar los usuarios cuyo rango es 'Cliente'
            const q = query(collection(db, 'usuarios'), where('rango', '==', 'Profesional'));
            const querySnapshot = await getDocs(q);
            const profesionalesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(profesionalesList)
            setProfesionales(profesionalesList);
        } catch (error) {
            console.error('Error fetching usuarios: ', error);
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
        fetchProfesionales();
    }, []);

    
    // Manejar la selección de profesional
    const handleSelectProfesional = (e) => {
        const selectedProfesional = profesionales.find(prof => prof.id === e.target.value);
        setNuevoServicio({
            ...nuevoServicio,
            profesional: {
                email: selectedProfesional.email,
                nombre: selectedProfesional.nombreCompleto
            }
        });
    };

    // Función para agregar un nuevo servicio
    const agregarServicio = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'servicios'), nuevoServicio);
            fetchServicios(); // Volver a obtener los servicios
            setNuevoServicio({ profesional: {email: '', nombre: ''}, precio: '', nombre: '' }); // Limpiar el formulario
        } catch (error) {
            console.error('Error adding servicio: ', error);
        }
    };

    return (
        <div className='containerLoged'>
            <Sidebar />
            <div className='wrapperContentAdminServices'>
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
                        <select onChange={handleSelectProfesional} required>
                            <option value="">Seleccionar Profesional</option>
                            {profesionales.map(profesional => (
                                <option key={profesional.id} value={profesional.id}>
                                    {profesional.nombreCompleto}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Precio"
                            value={nuevoServicio.precio}
                            onChange={(e) => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
                            required
                        />

                        <button id="buttonSubmitServicio" type="submit">Agregar Servicio</button>
                    </div>

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
                                    <h3>{servicio.profesional.nombre}</h3>
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

            </div>
        </div>
    );
}