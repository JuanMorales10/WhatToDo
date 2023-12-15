import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext/UserContext';
import DatePicker from 'react-datepicker';
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css';
import './ReservaForm.css';

function ReservaForm({ service, onSubmit }) {
  const serviceId = service.service.id
  const { user } = useContext(UserContext);
  const [availableSlots, setAvailableSlots] = useState({ dates: [], times: [] });
  const [reserva, setReserva] = useState({
    servicio_id: serviceId,
    fecha: new Date(),
    hora: '',
    cantidadPersonas: 1,
    nombreReserva: service ? service.service.nombre : '',
    nombreUsuario: user ? user.profile.nombre : '',
    usuario_dni: user ? user.profile.id : ''
  });


  console.log(reserva.fecha)


  useEffect(() => {
    fetchAvailableSlots(reserva.fecha);
  }, [serviceId, reserva.fecha]);

  useEffect(() => {
    if (availableSlots.times.length > 0 && reserva.hora === '') {
      setReserva(prevState => ({
        ...prevState,
        hora: availableSlots.times[0]
      }));
    }
  }, [availableSlots.times]);

  // Función para cargar los slots disponibles
  const fetchAvailableSlots = async (selectedDate) => {
    
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    try {
      const response = await fetch(`http://localhost:3008/service/${serviceId}/available-slots?date=${formattedDate}`);
      const slots = await response.json();

      const times = slots.map(slot => {
        const date = new Date(slot);
        // Convertir a hora local
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
        return `${localDate.getHours().toString().padStart(2, '0')}:${localDate.getMinutes().toString().padStart(2, '0')}`;
      });

      setAvailableSlots({ dates: [formattedDate], times });
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleDateChange = (date) => {
    setReserva({ ...reserva, fecha: date, hora: '' });
    fetchAvailableSlots(date);
  };

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reserva);
  };

  return (
    <>
      <div className="reserva-form-container">
        <h2>Reserva tu experiencia</h2>
        <form onSubmit={handleSubmit} className="reserva-form">
          {/* Input para la cantidad de personas */}
          <div className="form-group">
            <label htmlFor="cantidadPersonas">Cantidad de Personas:</label>
            <input
              type="number"
              name="cantidadPersonas"
              value={reserva.cantidadPersonas}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          {/* DatePicker y otros inputs... */}
          <label htmlFor="datePicker">Selecciona Fecha:</label>
          <DatePicker
            selected={reserva.fecha}
            onChange={handleDateChange}
            name="fecha"
            inline
          />
          <label htmlFor="timePicker">Selecciona una Hora</label>
          <select name="hora" id="timePicker" value={reserva.hora} onChange={handleChange}>
            {availableSlots.times.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
          <button type="submit" className="book-now-btn">Reservar Ahora</button>
        </form>
      </div>
    </>
  );
}

export default ReservaForm;
