import React, { useState, useEffect } from "react";
// Componentes
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';

import { DateCalendarMultipleSelect } from "./Calendar.jsx";
import { HorarioSelect } from "./HorarioSelect.jsx";

// Firebase imports
import { collection, addDoc, getDocs, where, query, doc, getDoc } from 'firebase/firestore';
import appFirebase, { db } from '../../../credentials.js';
import { getAuth } from "firebase/auth";

// Imports de terceros
import Swal from 'sweetalert2'

// Import the icons files
import deleteIcon from "icons/delete_icon.png";

let horariosOptions = [
    { value: '08:00', label: '08:00' },
    { value: '10:00', label: '10:00' },
    { value: '12:00', label: '12:00' },
    { value: '14:00', label: '14:00' },
    { value: '16:00', label: '16:00' },
    { value: '18:00', label: '18:00' },
    { value: '20:00', label: '20:00' },
    { value: '22:00', label: '22:00' },

]

const fetchReservasByFecha = async (fecha) => {
    const reservasRef = collection(db, "reservasServicios");
    const q = query(reservasRef, where("fecha", "==", fecha));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
};
const fetchServicios = async () => {
    const serviciosRef = collection(db, "servicios");
    const querySnapshot = await getDocs(serviciosRef);
    return querySnapshot.docs.map(doc => doc.data());
};




export function Turnos() {
    // Verificar si hay un usuario logueado
    const auth = getAuth(appFirebase);
    const user = auth.currentUser;
    // console.log(user);

    const [servicios, setServicios] = useState([]); // Manejar los servicios
    const [services, setServices] = useState([]); // Manejar los servicios seleccionados

    const [horariosDisponibles, setHorariosDisponibles] = useState(horariosOptions);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null); // Manejar el horario seleccionado
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null); // Manejar la fecha seleccionada
    const [clearHorario, setClearHorario] = useState(false);
    const [clearDate, setClearDate] = useState(false);

    useEffect(() => {
        const getServicios = async () => {
            const serviciosData = await fetchServicios();
            setServicios(serviciosData);
        };

        getServicios();
    }, []);

    const handleDateChange = async (fecha) => {
        setHorarioSeleccionado(null);
        setClearHorario(true);
        setTimeout(() => setClearHorario(false), 100);
        const reservas = await fetchReservasByFecha(fecha);
        const horariosReservados = reservas.map(reserva => reserva.horario);

        const updatedHorariosOptions = horariosOptions.map((option) => ({
            ...option,
            isDisabled: horariosReservados.includes(option.value),
        }));

        setHorariosDisponibles(updatedHorariosOptions);
        setFechaSeleccionada(fecha);  // Actualizar la fecha seleccionada
    };

    const addService = (service) => {
        console.log(service)
        const serviceExists = services.some((s) => s.nombre === service.nombre);
        if (serviceExists) {
            const updatedServices = services.filter((s) => s.nombre !== service.nombre);

            setServices(updatedServices);
        } else {

            setServices([...services, { ...service, isSelected: true }]);
        }
        console.log(services)
    }

    const totalCost = services.reduce((acc, service) => acc + parseInt(service.precio), 0);

    const deleteService = (serviceKey) => {
        const newServices = services.filter(s => s.nombre !== serviceKey);
        setServices(newServices);
    }

    const showLoading = () => {
        Swal.fire({
            title: 'Reservando...',
            text: 'Estamos enviando tu reserva, por favor espera un momento',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    const enviar = async (event) => {
        event.preventDefault();
        if (!user) {
            Swal.fire({
                title: 'Error',
                text: 'Primero debes registrarte o iniciar sesión',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            return;
        }

        if (!horarioSeleccionado || !fechaSeleccionada || services.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor selecciona todos los campos',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            return;
        }

        setClearDate(true);
        setClearHorario(true);

        try {
            showLoading();
            // Buscar el usuario en la colección "usuarios" por su UID  
            const userDocRef = doc(db, "usuarios", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            // Obtener el campo "nombreCompleto" del documento del usuario  
            const usuarioFound = userDocSnap.data();
            const solicitudesRef = collection(db, "reservasServicios");

            const data = {
                horario: horarioSeleccionado,
                fecha: fechaSeleccionada,
                services: services,
                costoTotal: totalCost,
                cliente: {
                    uid: user.uid, // ID del usuario  
                    email: usuarioFound.email, // Email del usuario  
                    nombreCompleto: usuarioFound.nombreCompleto // Nombre del usuario, si está disponible  
                }
            };
            console.log(data)

            await addDoc(solicitudesRef, data);
            Swal.close();

            Swal.fire({
                title: 'Enviado!',
                text: 'Tu reserva ha sido enviada con éxito',
                icon: 'success',
                confirmButtonText: 'Cerrar',
                allowOutsideClick: false,
            });

            // Limpiar después de enviar la reserva  
            setHorarioSeleccionado(null);
            setFechaSeleccionada(null);
            setServices([]); // Limpiar servicios seleccionados  
            setHorariosDisponibles(horariosOptions); // Reiniciar horarios a los originales  

        } catch (error) {
            console.error("Error al enviar la reserva: ", error);
            Swal.close();

            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al enviar tu reserva. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
        }
    };

    const isFormComplete = services.length > 0 && horarioSeleccionado && fechaSeleccionada;

    return (
        <>
            <Header />
            <div className="wrapper">
                <div className="listServiciosContainer">
                    <h1 className="seccionTittle">Servicios</h1>
                    <ul>
                        {servicios.map(sv =>
                            <Servicio key={sv.nombre} isSelected={services.some(s => s.nombre === sv.nombre)} profesional={sv.profesional} nombre={sv.nombre} precio={sv.precio} addServiceEvent={addService} />
                        )}
                    </ul>
                </div>

                <div className="turnosSideManagementContainer">
                    <form id="formRequestServicios" onSubmit={enviar}>
                        <h1 className="seccionTittle">Turnos</h1>
                        {services.length > 0 && (
                            <div className="leyendaServiciosSelccionadosWrapper">
                                <h3>Servicios seleccionados</h3>
                            </div>
                        )}
                        <ul>
                            {services.map(sv =>
                                <ServicioSelected key={sv.nombre} profesional={sv.profesional} nombre={sv.nombre} precio={sv.precio} deleteServiceEvent={() => deleteService(sv.nombre)} />
                            )}

                            {services.length === 0 ? (
                                <h2 className="warningMessage">Aun no tiene servicios seleccionados</h2>
                            ) : (
                                <li className="totalServiciosContainer">
                                    <h2>Total</h2>
                                    <h3>${totalCost}</h3>
                                </li>
                            )}
                        </ul>
                        <div className="selectHorarioFechaWrapper">
                            <div className="leyendaCalendarioWrapper">
                                <h3>Seleccioná el día y horario</h3>
                            </div>

                            <div className="calendarioWrapper">
                                <DateCalendarMultipleSelect onDateChange={handleDateChange} clearValue={clearDate} />
                            </div>
                            <div className="horarioWrapper">
                                <HorarioSelect
                                    options={horariosDisponibles}
                                    clearValue={clearHorario}
                                    onHorarioChange={setHorarioSeleccionado}  // Manejar cambio de horario
                                />
                            </div>
                        </div>
                        <div className="wrapperSubmitForm">
                            <input id="buttonSubmitForm" type="submit" value="Realizar reserva" disabled={!isFormComplete} />
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

function Servicio({ nombre, precio, profesional, isSelected, addServiceEvent }) {
    return (
        <li className={`serviceItem ${isSelected ? "selected" : ""}`}>
            {/* <h2>{isSelected}</h2> */}
            <div className="coreInfoContainer">
                <div className="containerInfo">
                    <h2>Servicio</h2>
                    <h3>{nombre}</h3>
                </div>
                <div className="containerInfo">
                    <h2>Precio</h2>
                    <h3>${precio}</h3>
                </div>
                <div className="containerInfo">
                    <h2>Profesional</h2>
                    <h3>{profesional}</h3>
                </div>
            </div>
            <button className="buttonAdd" onClick={() => addServiceEvent({ profesional, nombre, precio, isSelected })}>{isSelected ? "Quitar" : "Agregar"}</button>
        </li>
    )
}

function ServicioSelected({ nombre, precio, deleteServiceEvent }) {
    return (
        <li className="serviceItemSelected">
            <div className="infoItemSelected">
                <h2>{nombre}</h2>
                <h3>{precio}</h3>
            </div>
            <img src={deleteIcon} alt="delete icon" onClick={deleteServiceEvent} />
        </li>
    )
}
