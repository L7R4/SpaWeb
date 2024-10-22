import React, { useState ,useEffect} from 'react';

export function TransferenciaForm({ onTransferenciaDataChange, checkStatusButtonSubmit }) {
    const [fileValue, setFileValue] = useState(null);  // Inicia con null en lugar de una cadena vacía
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];  // Obtén el archivo seleccionado
        setFileValue(file);  // Actualiza el estado con el archivo seleccionado
        // console.log("Archivo seleccionado:", file);  // Muestra el archivo seleccionado en la consola
    };

    useEffect(() => {
        // Solo si hay un archivo seleccionado, elevamos el cambio al componente padre
        onTransferenciaDataChange({ comprobante: fileValue });
        checkStatusButtonSubmit();  // Llama a la función para revisar si el botón debe habilitarse o no
        console.log(fileValue)
    }, [fileValue]);  // Escucha cambios en fileValue

    return (
        <div className="transferenciaForm">
            <div className='payInformationWrapper'>
                <p><strong>CBU</strong> 1234567890123456789012</p> {/* Puedes reemplazarlo por props */}
                <p><strong>Alias</strong> sentiSpaBien.MP</p>
            </div>
            <label htmlFor="comprobante">Subir comprobante de pago</label>
            <input 
                className="inputCheck"
                form="formRequestServicios" 
                type="file" 
                id="comprobante" 
                accept="image/*, application/pdf" 
                onChange={handleFileChange}  // Llama a handleFileChange cuando cambia el input file
            />

            {fileValue && (
                <p className='fileNamePTag'><strong>Archivo subido</strong><br />{fileValue.name}</p>
            )}
        </div>
    );
}