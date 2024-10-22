// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../../../credentials.js';

// export function PaymentComponent({ totalCost, onPaymentSuccess, cliente}) {
//     const [paymentMethod, setPaymentMethod] = useState('');

//     const savePaymentToFirebase = async (status) => {
//         try {
//             const docRef = await addDoc(collection(db, "pagos"), {
//                 cliente: cliente.displayName,
//                 email: cliente.emailUser,
//                 monto: totalCost,
//                 metodo: paymentMethod,
//                 status: status,
//                 fecha: new Date().toISOString(),
//             });
//             console.log("Documento escrito con ID: ", docRef.id);
//         } catch (e) {
//             console.error("Error al agregar el documento: ", e);
//         }
//     };

//     const handlePayment = async () => {
//         if (!paymentMethod) {
//             Swal.fire('Error', 'Selecciona un método de pago', 'error');
//             return;
//         }

//         // Simulador de procesamiento de pago
//         if (paymentMethod === 'cash') {
//             // Caso especial para pagos en efectivo (pagos pendientes)
//                 ('Pendiente');
//             Swal.fire('Pendiente', 'El pago se procesará cuando te presentes en el Spa', 'info');
//         } else {
//             // Procesamiento de otros métodos de pago (tarjeta, transferencia)
//             Swal.fire('Procesando...', 'Estamos procesando tu pago', 'info');
//             await savePaymentToFirebase('Completado');
//             Swal.fire('Completado', 'El pago fue exitoso', 'success');
//             onPaymentSuccess('Completado');

//         }
//     };

//     return (
//         <div className="paymentOptions">
//             <h3>Método de pago</h3>
//             <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//                 <option value="">Selecciona un método</option>
//                 <option value="credit">Tarjeta de Crédito</option>
//                 <option value="debit">Tarjeta de Débito</option>
//                 <option value="transfer">Transferencia (CBU/alias)</option>
//                 <option value="cash">Efectivo</option>
//             </select>
//             <button onClick={handlePayment}>Procesar Pago</button>
//         </div>
//     );
// }


import React, { useState } from 'react';
import { TransferenciaForm } from './TransferenciaForm.jsx';
import { TarjetaForm } from './TarjetaForm.jsx';

export function MetodoPago({ handlePaymentSuccess }) {
    const [metodo, setMetodo] = useState('');

    const handleMetodoChange = (e) => {
        setMetodo(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Puedes manejar el archivo del comprobante aquí, por ejemplo, subirlo a un servidor
        console.log("Archivo de comprobante:", file);
    };

    return (
        <div className="metodoPago">
            <h3>Selecciona un método de pago:</h3>
            <label>
                <input type="radio" value="transferencia" checked={metodo === 'transferencia'} onChange={handleMetodoChange} />
                Transferencia Bancaria
            </label>
            <label>
                <input type="radio" value="tarjeta" checked={metodo === 'tarjeta'} onChange={handleMetodoChange} />
                Tarjeta de Crédito/Débito
            </label>

            {metodo === 'transferencia' && <TransferenciaForm handleFileChange={handleFileChange} />}
            {metodo === 'tarjeta' && <TarjetaForm />}
        </div>
    );
}