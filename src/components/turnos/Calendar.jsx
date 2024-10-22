import { useState, useEffect } from "react"
import { Calendar } from "react-multi-date-picker"
import 'dayjs/locale/es'; // Importa el idioma español
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'; // Plugin para formatos localizados
import spanish_es_lowercase from '../localeCalendarEspanol'; // Importa el idioma español para el calendario

// Extiende dayjs con el plugin y establece el idioma
dayjs.extend(localizedFormat);
dayjs.locale('es'); // Establece el idioma a español



export function DateCalendarMultipleSelect({ onDateChange, clearValue, checkStatusButtonSubmit }) {
  const today = dayjs().toDate();

  const [value, setValue] = useState("");
  useEffect(() => {
    if (clearValue) {
      setValue(""); // Limpia la selección
    }
  }, [clearValue]);

  useEffect(()=>{
    const today = {day:dayjs().format('DD'), month: dayjs().format('MM'), year: dayjs().format('YYYY')};
    const formattedDate = `${today.day}/${today.month}/${today.year}`;
    onDateChange(formattedDate);  //Llama a la función cuando cambia la fecha
    setValue(today)
  },[])

  const handleDateChange = (newValue) => {
    setValue(newValue);
    const formattedDate = `${newValue.day}/${newValue.month}/${newValue.year}`;
    onDateChange(formattedDate);  //Llama a la función cuando cambia la fecha
    checkStatusButtonSubmit();
  };


  return (
    <>
      <input className="inputCheck" type="hidden" id="calendarioInputID" name="calendar-days" value={`${value.day}/${value.month}/${value.year}`} />
    
      <Calendar
        value={value}
        onChange={handleDateChange}
        locale={spanish_es_lowercase}
        minDate={today}
        maxDate={dayjs(today).add(6, 'months').toDate()}
        className="custom-calendar"
      />
    </>
  );
}