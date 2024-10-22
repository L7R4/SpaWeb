import React, { useState } from 'react';

export function TarjetaForm({ onTarjetaDataChange, checkStatusButtonSubmit }) {
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onTarjetaDataChange(prevState => ({ ...prevState, [name]: value }));
        checkStatusButtonSubmit();
    };

    return (
        <div className="tarjetaForm">
            <div>
                <label htmlFor="numero">Número de tarjeta</label>
                <input className="inputCheck" form="formRequestServicios" type="text" id="numero" name="numero" maxLength="16" onChange={handleInputChange} />
            </div>

            <div>
                <label htmlFor="titular">Nombre del titular</label>
                <input className="inputCheck" form="formRequestServicios" type="text" id="titular" name="titular" onChange={handleInputChange} />
            </div>   

            <div>
                <label htmlFor="vencimiento">Fecha de vencimiento (MM/YY)</label>
                <input className="inputCheck" form="formRequestServicios" type="text" id="vencimiento" name="vencimiento" maxLength="5" onChange={handleInputChange} />
            </div>

            <div>
                <label htmlFor="cvv">CVV</label>
                <input className="inputCheck" form="formRequestServicios" type="text" id="cvv" name="cvv" maxLength="3" onChange={handleInputChange} />
            </div>

            <div>
                <label htmlFor="direccion">Dirección de facturación</label>
                <input className="inputCheck" form="formRequestServicios" type="text" id="direccion" name="direccion" onChange={handleInputChange} />
            </div>
            
        </div>
    );
}