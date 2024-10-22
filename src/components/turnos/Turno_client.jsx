import React, { useState, useEffect } from "react";
// Componentes
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import  Sidebar  from '../Sidebar/SideBar.jsx';

import { DateCalendarMultipleSelect } from "./Calendar.jsx";
import { HorarioSelect } from "./HorarioSelect.jsx";
// import { PaymentComponent } from './PaymentComponent';
import { MetodoPago } from "./MetodoPago.jsx";

// Firebase imports
import { collection, addDoc, getDocs, where, query, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import appFirebase, { storage   ,db } from '../../../credentials.js';
import { getAuth } from "firebase/auth";
import useUsuario from '../../hooks/useUsuario.js';
import emailjs from '@emailjs/browser';


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
    // const auth = getAuth(appFirebase);
    const usuario = useUsuario();
    // const usuario = 
    // console.log(usuario)
    const [step, setStep] = useState(1);

    const [servicios, setServicios] = useState([]); // Manejar los servicios
    const [services, setServices] = useState([]); // Manejar los servicios seleccionados

    // #region Estados de Fecha y Hora
    const [horariosDisponibles, setHorariosDisponibles] = useState(horariosOptions);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null); // Manejar el horario seleccionado
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null); // Manejar la fecha seleccionada
    const [clearHorario, setClearHorario] = useState(false);
    const [clearDate, setClearDate] = useState(false);
    // #endregion

    // #region Estados Metodos de pagos
    const [metodoPago, setMetodoPago] = useState(''); // Nuevo estado para método de pago
    const [transferenciaData, setTransferenciaData] = useState({});
    const [tarjetaData, setTarjetaData] = useState({
        numero: "",
        titular: "",
        vencimiento: "",
        cvv: "",
        direccion: "",
        ciudad: "",
        pais: ""
    });

    // #endregion
    
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
        const serviceExists = services.some((s) => s.nombre === service.nombre);

        if (serviceExists) {
            const updatedServices = services.filter((s) => s.nombre !== service.nombre);

            setServices(updatedServices);
        } else {
            const profesional = {
                nombre: service.profesional.nombre,
                email: service.profesional.email
            };
            setServices([...services, { ...service, profesional,isSelected: true }]);
        }
    }

    useEffect(()=>{
        validateFormFields();
    },[services])

    
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

    const cleanInputsRadioMetodoPago = () =>{
        const form = document.getElementById("formRequestServicios");
        const inputs = form.querySelectorAll("input.inputCheck[type=radio]");
        inputs.forEach(element => {
            element.checked = false
        });
    }

    const handleFileUpload = async (file) => {
        try {
          // Referencia a donde se subirá el archivo en Firebase Storage
          const storageRef = ref(storage, `comprobantesTransferencia/${file.name}`);
      
          // Subir archivo a Firebase Storage
          const snapshot = await uploadBytes(storageRef, file);
          console.log('Archivo subido exitosamente:', snapshot);
      
          // Obtener el enlace de descarga
          const downloadURL = await getDownloadURL(snapshot.ref);
          console.log('Enlace de descarga:', downloadURL);
      
          return downloadURL;
        } catch (error) {
          console.error("Error al subir el archivo y guardar el enlace: ", error);
        }
    };

    
    const sendEmail = async (dataContext) => {
        
    
        // Pasar el formulario a EmailJS
        emailjs.send('service_fwb38j8', 'template_eb2hjms', dataContext, 'A37cZEec6qHT_dono')
            .then(
                () => {
                    console.log('SUCCESS!');
                },
                (error) => {
                    console.log('FAILED...', error);
                }
            );
    };

    

    const enviar = async (event) => {
        event.preventDefault();
        console.log(usuario)
        if (!usuario || !usuario.idUser) {
            Swal.fire({
                title: 'Error',
                text: 'Primero debes registrarte o iniciar sesión',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            return;
        }

        setClearDate(true);
        setClearHorario(true);

        try {
            showLoading();

            const solicitudesRef = collection(db, "reservasServicios");
            const pagosRef = collection(db, "pagos");

            
            const reservaData = {
                cliente: {
                    email: usuario.emailUser,
                    nombreCompleto: usuario.displayName,
                    uid: usuario.idUser,
                },
                costoTotal: totalCost,
                fecha: fechaSeleccionada,
                horario: horarioSeleccionado,
                services: services.map(service => ({
                    isSelected: true,
                    nombre: service.nombre,
                    precio: service.precio,
                    profesional: {
                        email: service.profesional.email,
                        nombre: service.profesional.nombre,
                    },
                })),
                estado: metodoPago !== "efectivo" ? "Pagado" : "Pendiente" ,

                fechaPago: new Date().toLocaleDateString(), // Fecha de la reserva (puedes ajustar esto)
                metodoPago: metodoPago, // Asumimos que guardas el método de pago en algún estado
            };

            let comprobanteTransferencia = ""
            if(metodoPago == "transferencia"){
                comprobanteTransferencia = await handleFileUpload(transferenciaData.comprobante) 
            }
            const pagoData = {
                cliente: {
                    nombre: usuario.displayName,
                    email: usuario.emailUser,
                },
                monto: totalCost,
                metodoPago: metodoPago, // Método de pago
                fecha: new Date().toLocaleDateString(), // Fecha del pago
                servicios: services.map(service => ({
                    isSelected: true,
                    nombre: service.nombre,
                    precio: service.precio,
                    profesional: {
                        email: service.profesional.email,
                        nombre: service.profesional.nombre,
                    },
                })),
                estado: metodoPago !== "efectivo" ? "Pagado" : "Pendiente" ,
                info: metodoPago == "transferencia" ?  comprobanteTransferencia : tarjetaData
            };

           
            const serviciosSolicitados = services.map(servicio => ({
                nombre: servicio.nombre,
                precio: servicio.precio,
                profesional: servicio.profesional.nombre
            }));
            

            
            const dataContextForEmail = {
                to_email_user: usuario.emailUser,
                to_name: usuario.displayName,
                serviciosSolicitados: serviciosSolicitados,
                precioTotal: totalCost,
                fecha:new Date().toLocaleString()
            };
            console.log('Datos para el correo:', dataContextForEmail);


            await addDoc(solicitudesRef, reservaData);
            await addDoc(pagosRef, pagoData);
            await sendEmail(dataContextForEmail);

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
            // setFechaSeleccionada("");
            setServices([]); // Limpiar servicios seleccionados  
            setHorariosDisponibles(horariosOptions); // Reiniciar horarios a los originales  
            setMetodoPago('');
            setTransferenciaData({});
            setTarjetaData({});
            setStep(1)
            cleanInputsRadioMetodoPago()

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


    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const validateFormFields = () => {
        const form = document.getElementById("formRequestServicios");
        const inputs = form.querySelectorAll("input.inputCheck");
        let allFieldsComplete = true; // Asumimos que todos los campos están completos inicialmente


        inputs.forEach(input => {
            if (input.type === "text" || input.type === "hidden") {
                // Verificar si el campo de texto u oculto tiene un valor
                if (input.value === "" || input.value === null ) {
                    // console.log("weps")
                    allFieldsComplete = false; // Si falta este campo, marcar como incompleto
                }
            } else if (input.type === "radio") {
                // Verificar si hay al menos un radio seleccionado en el grupo
                const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
                const oneChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!oneChecked) {
                    allFieldsComplete = false; // Si ningún radio está seleccionado, marcar como incompleto
                }
            } else if (input.type === "file") {
                // Verificar si se ha subido un archivo
                if (input.files.length === 0) {
                    allFieldsComplete = false; // Si no hay archivo, marcar como incompleto
                }
            }
        });

        // Verificar si hay servicios seleccionados
        if(services.length == 0){
            allFieldsComplete = false; // Si no hay servicios seleccionados, no habilitar boton
        }
     
        setIsButtonDisabled(!allFieldsComplete); // Deshabilitar el botón si no están completos
    };

//#region  manejo de paneles 
    const goToNextStep = () => {
        setStep(2); // Avanza al segundo panel
    };

    const goToPreviousStep = () => {
        setStep(1); // Vuelve al primer panel
    };
// #endregion
    
return (
    <div className={usuario ? 'containerLoged' : ''}>
        {/* Mostrar Sidebar si está logueado, si no, el Header */}
        {usuario ? <Sidebar /> : <Header />}
        <div className="wrapper wrapperContent">
            <div className="listServiciosContainer">
                <h1 className="seccionTittle">Servicios</h1>
                <ul>
                    {servicios.map(sv =>
                        <Servicio key={sv.nombre} 
                        isSelected={services.some(s => s.nombre === sv.nombre)} 
                        profesional={{ nombre: sv.profesional.nombre, email: sv.profesional.email }} 
                        nombre={sv.nombre} 
                        precio={sv.precio} 
                        addServiceEvent={addService} />
                    )}
                </ul>
            </div>
            <div className="turnosSideManagementContainer">
                <form id="formRequestServicios" onSubmit={enviar}>
                <div className="booking-container">
                    <div className={`panel panel-1 ${step === 1 ? 'active' : ''}`}>
                        <div>
                            <h1 className="seccionTittle">Turnos</h1>
                            {services.length > 0 && (
                                <div className="leyendaServiciosSelccionadosWrapper">
                                    <h3>Servicios seleccionados</h3>
                                </div>
                            )}
                            <ul>
                                {services.map(sv =>
                                    <ServicioSelected key={sv.nombre} 
                                    profesional={{ nombre: sv.profesional.nombre, email: sv.profesional.email }}
                                    nombre={sv.nombre} 
                                    precio={sv.precio} 
                                    deleteServiceEvent={() => deleteService(sv.nombre)} />
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
                                            <DateCalendarMultipleSelect onDateChange={handleDateChange} clearValue={clearDate} checkStatusButtonSubmit = {validateFormFields}/>
                                        </div>
                                        <div className="horarioWrapper">
                                            <HorarioSelect
                                                checkStatusButtonSubmit = {validateFormFields}
                                                options={horariosDisponibles}
                                                clearValue={clearHorario}
                                                onHorarioChange={setHorarioSeleccionado}  // Manejar cambio de horario
                                            />
                                        </div>
                                            {/* <PaymentComponent totalCost={totalCost} onPaymentSuccess={handlePaymentSuccess} cliente={usuario}/> */}
                                        </div>
                                        {/* <div className="wrapperSubmitForm">
                                        </div> */}
                                </div>
                                <div className="wrapperButton">
                                <button type="button" onClick={goToNextStep}>Continuar</button>

                                </div>
                            </div>

                            <div className={`panel panel-2 ${step === 2 ? 'active' : ''}`}>
                                {/* Contenido del Panel 2 - Método de pago */}
                                <h1 className="seccionTittle">Método de pago</h1>
                                <MetodoPago 
                                    checkStatusButtonSubmit = {validateFormFields}
                                    onMetodoChange={setMetodoPago} 
                                    onTransferenciaDataChange={setTransferenciaData}
                                    onTarjetaDataChange={setTarjetaData} 
                                />

                                <div className="wrapperButton">
                                    <button type="button" onClick={goToPreviousStep}>Atrás</button>

                                    <button id="buttonSubmitForm" type="submit" disabled={isButtonDisabled}>
                                        Realizar reserva
                                    </button>

                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                
                </div>
                {/* Mostrar Footer solo si no está logueado */}
                {!usuario && <Footer />}

        </div>
    );
}

function Servicio({ nombre, precio, profesional, isSelected, addServiceEvent }) {
    return (
        <>
        <li className={`serviceItem ${isSelected ? "selected" : ""}`}>
            
            <table className="tableDataService">
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th>Profesional</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{nombre}</td>
                        <td>${precio}</td>
                        <td>{profesional.nombre}</td>
                    </tr>
                </tbody>
                
            </table>
            <button className="buttonAdd" onClick={() => addServiceEvent({ profesional, nombre, precio, isSelected })}>{isSelected ? "Quitar" : "Agregar"}</button>
        </li>
         
        </>
        
    )
}

function ServicioSelected({ profesional, nombre, precio, deleteServiceEvent }) {
    return (
        <li className="serviceItemSelected">
            <div className="infoItemSelected">
                <h2>{nombre}</h2>
                <h3>${precio}</h3>
            </div>
            <img src={deleteIcon} alt="delete icon" onClick={deleteServiceEvent} />
        </li>
    )
}
