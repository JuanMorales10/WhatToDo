import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import { UserContext } from '../../../components/UserContext/UserContext';
import LocationPicker from '../../../components/LocationPicker/LocationPicker';
import gast from '../../../assets/img/gastonomia.jpg';
import vit from '../../../assets/img/winery.jpg';
import aven from '../../../assets/img/aventura.jpg';
import noche from '../../../assets/img/noche.jpg';
import trans from '../../../assets/img/transporte.jpg';
import Footer from '../../../components/Footer/Footer';
import NavBar from '../../../components/NavBar/NavBar';

const EditServicePage = () => {
    const { token } = useContext(UserContext)
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [service, setService] = useState({
        nombre: '',
        descripcion: '',
        categoria_id: '',
        capacidad: '',
        id_region: 1,
        atp: '',
        rating: 0,
        precio: '',
        duracion: '',
        disponibilidad: true,
        direccion: '',
        operating_hours_start: '',
        operating_hours_end: '',
        operating_days: [],
    });

    useEffect(() => {

        setIsLoading(true)

        const fetchService = async () => {
            try {
                const serviceResponse = await fetch(`http://localhost:3008/service/${serviceId}/detail`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (serviceResponse.status !== 200) {
                    throw new Error('Network response for service was not ok');
                }
                const serviceData = await serviceResponse.json();

                setService(serviceData.service)

                const filteredImages = serviceData.images.filter(image => /\.(jpg|jpeg|png|gif)$/i.test(image.url));
                setImages(filteredImages);
            } catch (error) {
                setError('Failed to load service details');
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        fetchService();

        setIsLoading(false);
    }, [serviceId]);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setService({ ...service, [name]: value });
    };

    const handleRemoveExistingImage = (imageToRemove) => {
        setImages(images.filter(image => image !== imageToRemove));
        // Aquí también puedes agregar lógica para eliminar la imagen del servidor
    };

    const handleRemoveSelectedFile = (fileIndex) => {
        setSelectedFiles(selectedFiles.filter((_, index) => index !== fileIndex));
    };
    // Actualiza el estado de las imágenes
    const handleImageChange = (event) => {
        setSelectedFiles([...event.target.files]);
    };

    const handleLocationSelect = (locationName, lat, lng) => {
        setService({ ...service, direccion: locationName, latitud: lat, longitud: lng });
    };

    const handleCategorySelect = (category) => {
        setService({ ...service, categoria_id: category });
    };

    const isCategorySelected = (category) => {
        return service.categoria_id === category;
    };

    const handleDayChange = (event) => {
        const { value, checked } = event.target;
        setService(prevService => {
            const newOperatingDays = checked
                ? [...prevService.operating_days, value]
                : prevService.operating_days.filter(day => day !== value);
            return { ...prevService, operating_days: newOperatingDays };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const submitData = new FormData();
        Object.keys(service).forEach(key => {
            submitData.append(key, service[key]);
        });
    
        selectedFiles.forEach(file => {
            submitData.append('image', file); 
        });
    
        try {
            const response = await fetch(`http://localhost:3008/service/updateService/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }


    return (
        <>
            <NavBar />
            <form onSubmit={handleSubmit} className="create-service-form">
                <div className='form-cont'>
                    <h2>Editar Experiencia</h2>

                    {/* Paso 1: Categoría */}
                    <div className='inside-1'>
                        <h3>Paso 1</h3>
                        <section className="form-step">
                            <h5>
                                Elije la Categoria de tu Experiencia
                            </h5>
                            <div className="categories-container">
                                <div>
                                    <button
                                        type='button'
                                        className={`category-button ${isCategorySelected(2) ? 'selected-category' : ''}`}
                                        onClick={() => handleCategorySelect(2)}
                                    >
                                        <img src={gast} alt="Gastronomy" />
                                    </button>
                                    Gastronomia
                                </div>
                                <div>
                                    <button
                                        type='button'
                                        className={`category-button ${isCategorySelected(1) ? 'selected-category' : ''}`}
                                        onClick={() => handleCategorySelect(1)}
                                    >
                                        <img src={vit} alt="Wineries" />
                                    </button>
                                    Vitivinicola
                                </div>
                                <div>
                                    <button
                                        type='button'
                                        className={`category-button ${isCategorySelected(4) ? 'selected-category' : ''}`}
                                        onClick={() => handleCategorySelect(4)}
                                    >
                                        <img src={aven} alt="Adventure" />
                                    </button>
                                    Aventura
                                </div>
                                <div>
                                    <button
                                        type='button'
                                        className={`category-button ${isCategorySelected(3) ? 'selected-category' : ''}`}
                                        onClick={() => handleCategorySelect(3)}
                                    >
                                        <img src={trans} alt="Transport" />
                                    </button>
                                    Transporte
                                </div>
                                <div>
                                    <button
                                        type='button'
                                        className={`category-button ${isCategorySelected(5) ? 'selected-category' : ''}`}
                                        onClick={() => handleCategorySelect(5)}
                                    >
                                        <img src={noche} alt="Nightlife" />
                                    </button>
                                    Noche
                                </div>
                            </div>
                        </section>
                        <h3>Paso 2</h3>
                        <section className="form-step">
                            <input type="text" placeholder="Nombra tu experiencia" name='nombre' onChange={handleInputChange} value={service.nombre} />
                            <label>Selecciona tu ubicacion</label>
                            <LocationPicker
                                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                                onLocationSelect={handleLocationSelect}
                            />
                            {service.direccion && (
                                <div style={{ padding: '10px', fontSize: '1rem' }}>
                                    <strong>Dirección Seleccionada:</strong> {service.direccion}
                                </div>
                            )}
                            <textarea placeholder="Describe que van a hacer tus visitas durante la experiencia" name='descripcion' onChange={handleInputChange} value={service.descripcion}></textarea>
                        </section>
                    </div>
                    <div className='inside-2'>
                        <h3>Paso 3</h3>
                        <section className="form-step">
                            <div>
                                <h4>Días de Operación</h4>
                                <div className='days-cont'>
                                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => (
                                        <div key={index}>
                                            <input
                                                type="checkbox"
                                                name="operating_days"
                                                value={day}
                                                onChange={handleDayChange}
                                                checked={service.operating_days.includes(day)}
                                            />
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <h4> Horarios de Operación</h4>
                            <div className='hor-flex'>
                                <label>Inicio</label>
                                <input
                                    type="time"
                                    name="operating_hours_start"
                                    onChange={handleInputChange}
                                    value={service.operating_hours_start}
                                    placeholder="Hora de inicio"
                                />
                            </div>
                            <div className='hor-flex'>
                                <label>Fin</label>
                                <input
                                    type="time"
                                    name="operating_hours_end"
                                    onChange={handleInputChange}
                                    value={service.operating_hours_end}
                                    placeholder="Hora de fin"
                                />
                            </div>
                        </section>

                        <h3>Paso 4</h3>
                        <section className="form-step">
                            <h5>Detalla tu Experiencia</h5>
                            <div className='column'>
                                <div className='row'>
                                    <div className='formflexcreat'>
                                        <label className='lab'>Precio:</label>
                                        <input type="number" name='precio' onChange={handleInputChange} value={service.precio}></input>
                                    </div>
                                    <div className='formflexcreat'>
                                        <label className='lab'>Duración:</label>
                                        <input type="time" name='duracion' onChange={handleInputChange} value={service.duracion} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='formflexcreat'>
                                        <label className='lab'>Maximo de Personas:</label>
                                        <input type="number" style={{ width: '30%' }} name='capacidad' onChange={handleInputChange} value={service.capacidad}></input>
                                    </div>
                                    <div className='formflexcreat'>
                                        <label className='lab'>Apto para todo Publico:</label>
                                        <input type='checkbox' style={{ width: '20%' }} name='atp' onChange={handleInputChange}></input>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <h3>Paso 5</h3>
                        <section className="form-step">
                            <h5>Imágenes Existentes</h5>
                            <div className="image-preview-container">
                                {images.map((image, index) => (
                                    <div key={index} className="image-preview-wrapper">
                                        <img src={`http://localhost:3008/img/service/${image.url}`} alt={`Imagen ${index}`} className="image-preview" />
                                        <button onClick={() => handleRemoveExistingImage(image)} className='delete-button'>Eliminar</button>
                                    </div>
                                ))}
                            </div>

                            <h5>Sube nuevas imágenes</h5>
                            <input type="file" onChange={handleImageChange} multiple name='images' />
                            <div className="image-preview-container">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="image-preview-wrapper">
                                        <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="image-preview" />
                                        <button onClick={() => handleRemoveSelectedFile(index)} className='delete-button'>Eliminar</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <div className='sub-but'>
                            <button type="submit" className="submit-button">Editar Experiencia</button>
                        </div>
                    </div>

                </div>
            </form>
            <Footer />
        </>
    );
};
export default EditServicePage;
