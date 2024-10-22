import React, { useState , useEffect} from 'react';
import { TransferenciaForm } from './TransferenciaForm.jsx';
import { TarjetaForm } from './TarjetaForm.jsx';
import { Efectivo } from './EfectivoForm.jsx';


export function MetodoPago({ onMetodoChange, onTransferenciaDataChange, onTarjetaDataChange, checkStatusButtonSubmit }) {
    const [metodo, setMetodo] = useState('');

    const handleMetodoChange = (e) => {
        const selectedMetodo = e.target.value;
        setMetodo(selectedMetodo);
        onMetodoChange(selectedMetodo); // Elevamos el valor del método al componente padre
    };

    useEffect(() => {
        checkStatusButtonSubmit(); 
    }, [metodo]);

    return (
        <div className="metodoPago">
            <h3>Selecciona un método de pago</h3>
            <div className='metodosOptionsWrapper'>
                <input id="transferenciaInput" name="metodoPago" className="inputCheck" form="formRequestServicios" type="radio" value="transferencia" checked={metodo === 'transferencia'} onChange={handleMetodoChange} />
                <label htmlFor='transferenciaInput'>
                    Transferencia
                </label>
                
                <input id="efectivoInput" name="metodoPago" className="inputCheck" form="formRequestServicios" type="radio" value="efectivo" checked={metodo === 'efectivo'} onChange={handleMetodoChange} />
                <label htmlFor='efectivoInput'>
                    Efectivo
                </label>

                <input id="tarjetaInput" name="metodoPago" className="inputCheck" form="formRequestServicios" type="radio" value="tarjeta" checked={metodo === 'tarjeta'} onChange={handleMetodoChange} />
                <label htmlFor='tarjetaInput'>
                    Tarjeta de Crédito/Débito
                </label>

                

            </div>

            {metodo === 'transferencia' && <TransferenciaForm onTransferenciaDataChange={onTransferenciaDataChange} checkStatusButtonSubmit = {checkStatusButtonSubmit}/>}
            {metodo === 'tarjeta' && <TarjetaForm onTarjetaDataChange={onTarjetaDataChange} checkStatusButtonSubmit = {checkStatusButtonSubmit} />}
            {metodo === 'efectivo' && <Efectivo />}

        </div>
    );
}