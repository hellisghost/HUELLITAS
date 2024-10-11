import React, { useContext, useEffect, useState } from 'react';
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import axiosClient from '../axiosClient';
import MascotasContext from '../../context/MascotasContext';
import Swal from 'sweetalert2';
import { FaPaw, FaStar, FaCalendarDay, FaCheckCircle, FaMapMarkerAlt, FaWeight, FaMars, FaVenus } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";

function ListMascota({ initialData, onClose }) {
    // const { mascotas, setMascotas } = useContext(MascotasContext);
    const [vacunas, setVacunas] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const genderIcon = initialData.sexo === "Macho" ? <FaMars className="text-blue-500" /> : <FaVenus className="text-pink-500" />;
    const stored = localStorage.getItem('user')
    const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

    // Convertir imagenes en un array si es una cadena separada por comas
    const imagenesArray = typeof initialData.imagenes === 'string'
        ? initialData.imagenes.split(',').filter(imagen => imagen.trim() !== '')
        : [];

    useEffect(() => {
        const fetchVacunas = async () => {
            try {
                console.log(`Solicitando vacunas para la mascota con ID: ${initialData.id_mascota}`);
                const response = await axiosClient.get(`/vacunas/listarVacunasAsociadaAMascota/${initialData.id_mascota}`);
                console.log("Respuesta del servidor para vacunas: ", response.data);
                setVacunas(response.data);
            } catch (error) {
                console.error('Error al listar vacunas:', error);
            }
        };

        if (initialData.id_mascota) {
            fetchVacunas();
        }
    }, [initialData.id_mascota]);


    useEffect(() => {
        peticionGet();
    }, []);


    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/mascotas/listar');
            console.log(response.data);
            setMascotas(response.data);
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const handleAdoptar = async () => {
        try {
            // Obtener el id_usuario desde el localStorage (verifica que estés guardando correctamente el usuario)
            const user = JSON.parse(localStorage.getItem('user'));
            const id_usuario = user?.id_usuario; // Accede a id_usuario desde el objeto user

            console.log("El id_usuario es:", id_usuario);

            // Realiza la solicitud al backend
            const response = await axiosClient.post(`/adopciones/iniciar/${initialData.id_mascota}`, { id_usuario });

            console.log("Respuesta del servidor:", response);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Mascota puesta en proceso de adopción',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                // Actualizar el estado localmente
                setMascotas((prevMascotas) => {
                    return prevMascotas.map((mascota) =>
                        mascota.id_mascota === initialData.id_mascota
                            ? { ...mascota, estado: 'Reservado' }
                            : mascota
                    );
                });

                // Llamar a peticionGet para actualizar la lista de mascotas globalmente
                // Aquí asumimos que tienes una función para obtener la lista actualizada de mascotas
                peticionGet(); // Asegúrate de que peticionGet esté disponible en este contexto

                // Opcional: Cerrar el modal después de la adopción
                onClose();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al poner en proceso de adopción',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error al iniciar adopción:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al poner en proceso de adopción',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };


    const statusColorMap = {
        'En Adopcion': "success",
        Urgente: "danger",
        Reservado: "secondary",
        Adoptado: "warning",
        todos: "primary",
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);

        let ageYears = today.getFullYear() - birth.getFullYear();
        let ageMonths = today.getMonth() - birth.getMonth();

        if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
        }

        if (today.getDate() < birth.getDate()) {
            ageMonths--;
            if (ageMonths < 0) {
                ageYears--;
                ageMonths += 12;
            }
        }

        return { years: ageYears, months: ageMonths };
    };

    // Calcula la edad
    const { years, months } = calculateAge(initialData.fecha_nacimiento);

    return (
        <>
            <div className="px-6">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Tooltip content="Nombre de la mascota">
                            <h4 className="font-semibold text-lg flex items-center space-x-2">
                                <FaPaw className="text-indigo-600" />
                                <span>{initialData.nombre_mascota}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Sexo de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                {genderIcon}
                                <span>{initialData.sexo}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Raza de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaPaw className="text-indigo-600" />
                                <span>{initialData.raza}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Categoría de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaStar className="text-yellow-500" />
                                <span>{initialData.categoria}</span>
                            </h4>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip content="Edad de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaCalendarDay className="text-green-500" />
                                <span>{years} Años y {months} Meses</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Esterilización">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaCheckCircle className="text-blue-500" />
                                <span>{initialData.esterilizado}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Departamento">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{initialData.departamento}</span>
                            </h4>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip content="Municipio">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{initialData.municipio}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Tamaño de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaWeight className="text-gray-500" />
                                <span>{initialData.tamano}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Peso de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaWeight className="text-gray-500" />
                                <span>{initialData.peso} kg</span>
                            </h4>
                        </Tooltip>
                    </div>
                </div>

            </div>
            <div className="capitalize mt-4 text-center text-sm font-medium">
                <span className={`px-4 py-2 rounded-full text-white bg-${statusColorMap[initialData.estado]}`}>
                    {initialData.estado}
                </span>
            </div>
            <div className="overflow-visible py-4">
                <div className="relative w-6/12 h-auto mb-4 overflow-hidden mx-auto">
                    {imagenesArray.length > 0 ? (
                        <div className={`grid ${imagenesArray.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
                            {imagenesArray.map((imagen, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-center ${imagenesArray.length === 1 && index === 0 ? 'col-span-2' : ''}`}
                                >
                                    <Image
                                        alt={`Imagen ${index + 1}`}
                                        className="object-cover w-full h-auto rounded-lg shadow-md mx-auto"
                                        src={`${axiosClient.defaults.baseURL}/uploads/${imagen}`}
                                        width="auto"
                                        height="auto"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Image
                            alt="Imagen por defecto"
                            className="object-cover w-full h-auto rounded-lg shadow-md mx-auto"
                            src="https://nextui.org/images/hero-card-complete.jpeg"
                            width="auto"
                            height="auto"
                        />
                    )}
                </div>

                <p className="text-sm text-gray-700 font-medium">{initialData.descripcion}</p>
                <div className="flex flex-wrap -mx-2">
                    {vacunas.length > 0 ? (
                        vacunas.map((vacuna) => (
                            <div key={vacuna.id_vacuna} className="w-full md:w-1/2 px-2">
                                <div className="border p-4 rounded-lg shadow-sm bg-white">
                                    <h5 className="font-bold text-gray-800 mb-1 text-sm">Enfermedad: {vacuna.enfermedad}</h5>
                                    <p className="text-gray-600 mb-1 text-xs">Fecha: {formatDate(vacuna.fecha_vacuna)}</p>
                                    <p className="text-gray-600 text-xs">Estado: {vacuna.estado}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-700 font-medium mb-4">Esta mascota no tiene vacunas.</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <Button color="danger" onClick={onClose}>Cancelar</Button>
                {user && user.rol !== 'superusuario' && (
                    <>
                        {initialData.estado !== 'Reservado' && initialData.estado !== 'Adoptado'  && initialData.estado_adopcion !== 'proceso de adopcion' && (
                            <Button color="warning" className="ml-4 z-1 text-white" onClick={handleAdoptar}>
                                ¡Adoptame!
                            </Button>
                        )}
                    </>
                )}
            </div>
        </>
    );

}
export default ListMascota;
