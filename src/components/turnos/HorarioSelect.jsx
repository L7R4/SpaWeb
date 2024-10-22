import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export function HorarioSelect({ options, clearValue, onHorarioChange, checkStatusButtonSubmit }) {
    const [value, setValue] = useState(null);

    // Efecto que escucha cambios en clearValue para limpiar el estado
    useEffect(() => {
        if (clearValue) {
            setValue(null); // Limpia la selección
        }
    }, [clearValue]);

    // Efecto para manejar cambios en el valor seleccionado
    useEffect(() => {
        // Solo llamar a onHorarioChange si el valor ha cambiado
        onHorarioChange(value ? value.value : null);
        checkStatusButtonSubmit(); // Validar el estado del botón
    }, [value, onHorarioChange]); // Escuchar cambios en 'value'

    const handleChange = (selectedOption) => {
        setValue(selectedOption); // Actualiza el valor
    };

    // const handleChange = (selectedOption) => {
    //     console.log(selectedOption)
    //     onHorarioChange(selectedOption ? selectedOption.value : null);
    //     setValue(selectedOption);
    //     console.log(value)
    //     checkStatusButtonSubmit();
    // };
    return (
        <>
            <input className="inputCheck" type="hidden" id="horarioInputID" name="horario" value={value ? value.value : ""} />
            <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={false}
                isDisabled={false}
                name="horario"
                options={options}
                onChange={handleChange}
                value={value} // Mantén el estado del valor actualizado
                placeholder="Seleccionar horario"
            />
        </>
    );
};