import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from "@nextui-org/link";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient.js';
import MascotasContext from '../../context/MascotasContext.jsx';
import {
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { SearchIcon } from "../nextUI/SearchIcon.jsx";
import { ChevronDownIcon } from "../nextUI/ChevronDownIcon.jsx";
import { Card, CardHeader, CardBody, Image, Skeleton } from "@nextui-org/react";
import ListMascotaModal from '../templates/ListsMascotaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';
import Header from '../moleculas/Header.jsx';


export function ListsMascotas() {
    const navigate = useNavigate();
    const statusColorMap = {
        'En Adopcion': "success",
        Urgente: "danger",
        Reservado: "secondary",
        Adoptado: "warning",
        todos: "primary",
    };

    const statusOptions = [
        { name: "Todos", uid: "todos" },
        { name: "En Adopcion", uid: "En Adopcion" },
        { name: "Urgente", uid: "Urgente" },
        { name: "Reservado", uid: "Reservado" },
        { name: "Adoptado", uid: "Adoptado" },

    ];

    function Ejemplo() {
        const [filterValue, setFilterValue] = useState("");
        const [selectedKeys, setSelectedKeys] = useState(new Set(["todos"]));
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [page, setPage] = useState(1);
        const [isLoaded, setIsLoaded] = useState(false);

        const statusFilter = useMemo(() => {
            return Array.from(selectedKeys).join(", ");
        }, [selectedKeys]);

        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = useMemo(() => {
            let filteredMascotas = mascotas;

            if (hasSearchFilter) {
                filteredMascotas = filteredMascotas.filter(mascota =>
                    String(mascota.id_mascota).toLowerCase().includes(filterValue.toLowerCase()) ||
                    mascota.nombre_mascota.toLowerCase().includes(filterValue.toLowerCase()) ||
                    mascota.raza.toLowerCase().includes(filterValue.toLowerCase()) ||
                    mascota.sexo.toLowerCase().includes(filterValue.toLowerCase())
                );
            }

            if (statusFilter !== "todos") {
                filteredMascotas = filteredMascotas.filter(
                    (mascota) => mascota.estado === statusFilter
                );
            }

            return filteredMascotas;
        }, [mascotas, filterValue, statusFilter]);

        useEffect(() => {
            // Simulate fetching data with a delay
            setTimeout(() => {
                setIsLoaded(true);
            }, 1500);
        }, []);

        const onSearchChange = (e) => {
            setFilterValue(e.target.value);
        };

        const onClear = () => {
            setFilterValue('');
        };

        const onRowsPerPageChange = (e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(1);
        };

        const renderCard = useCallback((mascota) => {
            const handleDownloadPDF = async (id) => {
                try {
                    const response = await axiosClient.get(`/mascotas/pdf/${id}`, {
                        responseType: 'blob', // Esperamos un archivo blob
                    });
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `mascota_${id}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                } catch (error) {
                    console.error('Error al descargar el PDF:', error);
                }
            };
            return (
                <Card className="p-2 bg-gray-200">

                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <h4 className="font-bold text-2xl mb-1 text-gray-800">Nombre: {mascota.nombre_mascota}</h4>
                        <small className="text-gray-600 mb-2">Género: {mascota.sexo}</small>
                        <h4 className="font-semibold text-lg mb-2 text-gray-700">Raza: {mascota.raza}</h4>
                        <Chip className="capitalize" color={statusColorMap[mascota.estado]} size="sm" variant="flat">
                            {mascota.estado}
                        </Chip>
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
    <Button 
        color="danger" 
        variant="ghost" 
        onPress={() => handleDownloadPDF(mascota.id_mascota)}
    >
        Ficha Técnica
    </Button>
</div>

                    </CardBody>
                </Card>
            );
        }, [isLoaded]);

        return (
            <div className="flex flex-col items-center p-4 w-full">
                <div className="w-full sm:w-full lg:w-11/12 xl:w-11/12">
                    <div className="flex flex-col mt-3">
                        <div className="flex justify-between gap-3 items-end">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                                placeholder="Buscar..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={onClear}
                                onChange={onSearchChange}
                            />
                            <div className="z-0 flex gap-3">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            className="capitalize"
                                            endContent={<ChevronDownIcon className="text-small text-slate-700" />}
                                        >
                                            {statusFilter}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Single selection example"
                                        variant="flat"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={setSelectedKeys}
                                    >
                                        {statusOptions.map((status) => (
                                            <DropdownItem key={status.uid} className="capitalize w-55">
                                                {status.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="z-0 grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredItems.map(renderCard)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [mode, setMode] = useState('view');
    const [initialData, setInitialData] = useState(null);
    const [mascotas, setMascotas] = useState([]);
    const [mensaje, setMensaje] = useState('')
    const { idMascota, setMascotaId } = useContext(MascotasContext);

    useEffect(() => {
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            await axiosClient.get('/mascotas/listar').then((response) => {
                console.log(response.data);
                setMascotas(response.data);
            });
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const handleToggle = (mode, initialData) => {
        setInitialData(initialData)
        setModalOpen(true)
        setMode(mode)
    }

    const handleModalClose = async () => {
        console.log('holap cerrar');
        setModalOpen(false);
        peticionGet();  // Actualiza los datos de las mascotas después de cerrar el modal
    };
    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <>
      
            <Header title="Lista de mascotas"/>
            <div className='pl-24'>
            <AccionesModal
                isOpen={modalAcciones}
                onClose={() => handleModalClose(false)}
                label={mensaje}
            />
            <ListMascotaModal
                open={modalOpen}
                onClose={handleModalClose}  // Utiliza la nueva función de cierre
                title='Mascota'
                actionLabel='Cerrar'
                initialData={initialData}
                handleSubmit={handleModalClose}  // Utiliza la nueva función de cierre
                mode={mode}
            />
            <Ejemplo
                mascotas={mascotas}
            />
            </div>
        </>
    );
}
