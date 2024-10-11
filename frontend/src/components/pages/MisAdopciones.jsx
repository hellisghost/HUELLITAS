import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from "@nextui-org/link";
import axiosClient from '../axiosClient.js';
import { Card, CardHeader, CardBody, Image, Skeleton } from "@nextui-org/react";
import ListMascotaModal from '../templates/ListsMascotaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';


function MisAdopciones() {
  function Ejemplo({ mascotas }) {
    const [filterValue, setFilterValue] = useState("");

    const [isLoaded, setIsLoaded] = useState(false);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        // Filtrar las mascotas en base a la búsqueda
        let filteredMascotas = mascotas;

        if (hasSearchFilter) {
            filteredMascotas = filteredMascotas.filter(mascota =>
                mascota.nombre_mascota.toLowerCase().includes(filterValue.toLowerCase()) ||
                mascota.sexo.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredMascotas;
    }, [mascotas, filterValue, hasSearchFilter]);

    useEffect(() => {
        // Simulate fetching data with a delay
        setTimeout(() => {
            setIsLoaded(true);
        }, 1500);
    }, []);

    const renderCard = useCallback((mascota) => {
        return (
            <Card className="p-2 bg-gray-200">

                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-2xl mb-1 text-gray-800">Nombre: {mascota.nombre_mascota}</h4>
                    <small className="text-gray-600 mb-2">Género: {mascota.sexo}</small>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">Raza: {mascota.raza}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-4">
                    <Skeleton isLoaded={isLoaded} className="rounded-lg">
                        <div className="relative w-full mb-4 overflow-hidden">
                            {mascota.imagenes && mascota.imagenes.length > 0 ? (
                                <div className={`grid ${mascota.imagenes.split(',').length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                                    {mascota.imagenes.split(',').map((imagen, index) => (
                                        <div key={index} className={`flex items-center justify-center ${mascota.imagenes.split(',').length === 1 && index === 0 ? 'col-span-2' : ''}`}>
                                            <Image
                                                alt={`Imagen ${index + 1}`}
                                                className="object-cover rounded-xl"
                                                src={`${axiosClient.defaults.baseURL}/uploads/${imagen}`}
                                                width='auto'
                                                height='auto'
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="col-span-2 flex items-center justify-center">
                                        <Image
                                            alt="Imagen por defecto"
                                            className="object-cover rounded-xl"
                                            src="https://nextui.org/images/hero-card-complete.jpeg"
                                            width='auto'
                                            height='auto'
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Skeleton>
                    <p className="text-sm text-gray-700 font-medium mb-4">{mascota.descripcion}</p>
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            className="text-blue-600 underline cursor-pointer font-semibold"
                            to="#"
                            onClick={() => handleToggle('view', mascota)}
                        >
                            Ver más Información
                        </Link>
                    </div>
                </CardBody>
            </Card>
        );
    }, [isLoaded]);

    return (
        <div className="z-0 w-full sm:w-full lg:w-12/12 xl:w-11/12 mt-10">
            {filteredItems.length === 0 ? ( // Verifica si no hay items
                <div className="flex justify-center items-center h-64">
                    <h2 className="text-center text-2xl font-bold text-red-500">
                        No tienes mascotas adoptadas
                    </h2>
                </div>
            ) : (
                <div className="z-0 grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredItems.map(renderCard)}
                </div>
            )}
        </div>
    );
}

const [modalOpen, setModalOpen] = useState(false);
const [modalAcciones, setModalAcciones] = useState(false);
const [mode, setMode] = useState('view');
const [initialData, setInitialData] = useState(null);
const [mascotas, setMascotas] = useState([]);
const [mensaje, setMensaje] = useState('');

useEffect(() => {
    peticionGet();
}, []);

const peticionGet = async () => {
    try {
        // Obtén el usuario autenticado del localStorage
        const userInfo = JSON.parse(localStorage.getItem('user'));
        const id_usuario = userInfo.id_usuario; // Extrae el ID del usuario

        // Realiza la petición GET al backend con el ID del usuario adoptante
        const response = await axiosClient.get(`/adopciones/listaraceptadas/${id_usuario}`);
        console.log(response.data);
        setMascotas(response.data); // Establece las mascotas que están en proceso de adopción
    } catch (error) {
        console.log('Error en el servidor ' + error);
    }
};

const handleToggle = (mode, initialData) => {
    setInitialData(initialData);
    setModalOpen(true);
    setMode(mode);
};

const handleModalClose = async () => {
    console.log('cerrar modal');
    setModalOpen(false);
    peticionGet(); // Actualiza los datos de las mascotas después de cerrar el modal
};

return (
    <>
        <div className="pl-24">
            <AccionesModal
                isOpen={modalAcciones}
                onClose={() => handleModalClose(false)}
                label={mensaje}
            />
            <ListMascotaModal
                open={modalOpen}
                onClose={handleModalClose}
                title="Mascota"
                actionLabel="Cerrar"
                initialData={initialData}
                handleSubmit={handleModalClose}
                mode={mode}
            />
            <Ejemplo mascotas={mascotas} />
        </div>
    </>
);
}

export default MisAdopciones
