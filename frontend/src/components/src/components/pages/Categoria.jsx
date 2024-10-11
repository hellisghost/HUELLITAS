import React, { useContext, useEffect, useMemo, useState } from 'react';
import CategoriaModal from '../templates/CategoriaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';
import Swal from 'sweetalert2';
import axiosClient from '../axiosClient.js';
import CategoriasContext from '../../context/CategoriaContext.jsx';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    // Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
} from "@nextui-org/react";
import { ChevronDownIcon } from "./../nextUI/ChevronDownIcon.jsx";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "./../nextUI/PlusIcon.jsx";
import { SearchIcon } from "./../nextUI/SearchIcon.jsx";
import { EditIcon } from "../nextUI/EditIcon";
import { DeleteIcon } from "../nextUI/DeleteIcon";
import { PiDeviceMobileSlashDuotone } from "react-icons/pi";

function Categorias() {

    const statusColorMap = {
        activa: "success",
        inactiva: "danger",
    };

    function EjemploCategoria() {
        const [filterValue, setFilterValue] = useState("");
        const [selectedKeys, setSelectedKeys] = useState(new Set(["activa"]));
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [sortDescriptor, setSortDescriptor] = useState({
            column: "fecha",
            direction: "ascending",
        });
        const [page, setPage] = useState(1);

        const statusOptions = [
            { name: "Activa", uid: "activa" },
            { name: "Inactiva", uid: "inactiva" },
        ];


        const statusFilter = useMemo(() => {
            return Array.from(selectedKeys).join(", ");
        }, [selectedKeys]);

        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = useMemo(() => {
            let filteredCategorias = categorias;
            if (hasSearchFilter) {
                filteredCategorias = filteredCategorias.filter(categoria =>
                    categoria.nombre_categoria.toLowerCase().includes(filterValue.toLowerCase())
                    );
            }

            // Filtrar por estado (activa o inactiva)
            if (statusFilter === "activa") {
                filteredCategorias = filteredCategorias.filter(
                    (categoria) => categoria.estado === "activa"
                );
            } else if (statusFilter === "inactiva") {
                filteredCategorias = filteredCategorias.filter(
                    (categoria) => categoria.estado === "inactiva"
                );
            }
            return filteredCategorias;
        }, [categorias, filterValue, statusFilter]);

        // Filtrar las categorías según el estado para calcular el total
        const totalCategorias = useMemo(() => {
            return categorias.filter(categoria =>
                (statusFilter === "activa" && categoria.estado === "activa") ||
                (statusFilter === "inactiva" && categoria.estado === "inactiva")
            ).length;
        }, [categorias, statusFilter]);

        const pages = Math.ceil(filteredItems.length / rowsPerPage);

        const items = React.useMemo(() => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            return filteredItems.slice(start, end);
        }, [page, filteredItems, rowsPerPage]);

        const sortedItems = React.useMemo(() => {
            return [...items].sort((a, b) => {
                const first = a[sortDescriptor.column];
                const second = b[sortDescriptor.column];
                const cmp = first < second ? -1 : first > second ? 1 : 0;
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            });
        }, [sortDescriptor, items]);

        const renderCell = React.useCallback((categoria, columnKey) => {
            const cellValue = categoria[columnKey];

            switch (columnKey) {
                case "estado":
                    return (
                        <Chip className="capitalize" color={statusColorMap[categoria.estado]} size="sm" variant="flat">
                            {cellValue}
                        </Chip>
                    );
                case "actions":
                    return (
                        <div className="relative flex justify-start items-center gap-2">
                            <Dropdown>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                        <EditIcon onClick={() => handleToggle('update', categoria)} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                        <DeleteIcon
                                            onClick={() => peticionEliminar(categoria.id_categoria)}
                                        />
                                    </span>
                                    <span
                                        className={`text-lg cursor-pointer active:opacity-50 ${categoria.estado === "activa" ? "text-success" : "text-danger"
                                            }`}
                                    >
                                        <PiDeviceMobileSlashDuotone
                                            onClick={() => peticionDesactivar(categoria.id_categoria)}
                                        />
                                    </span>

                                </div>
                            </Dropdown>
                        </div>
                    );

                default:
                    return cellValue;
            }
        }, []);

        const onNextPage = React.useCallback(() => {
            if (page < pages) {
                setPage(page + 1);
            }
        }, [page, pages]);

        const onPreviousPage = React.useCallback(() => {
            if (page > 1) {
                setPage(page - 1);
            }
        }, [page]);

        const onRowsPerPageChange = React.useCallback((e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        }, []);

        const onSearchChange = (e) => {
            setFilterValue(e.target.value);
        };

        const onClear = () => {
            setFilterValue('');
        };


        const topContent = React.useMemo(() => {
            return (
                <>
                    <div className="flex flex-col mt-3">
                        <div className="flex justify-between gap-3 items-end">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                                placeholder="Buscar..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={() => onClear()}
                                onChange={onSearchChange}
                            />
                            <div className="flex gap-3">
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
                                <Button color="warning" className="mr-30 text-white" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => handleToggle('create')}>
                                    Registrar
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center z-10 mr-30 mt-2">
                            <span className="text-default-400 text-small">Total {totalCategorias} Resultados</span>
                            <label className="flex items-center text-default-400 mr-30 text-small">
                                Columnas por página:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={onRowsPerPageChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </>
            );
        }, [
            filterValue,
            onRowsPerPageChange,
            onSearchChange,
            onClear,
            hasSearchFilter,
        ]);

        const bottomContent = React.useMemo(() => {
            return (
                <div className="py-2 px-2 flex justify-between items-center m-3">
                    <Pagination
                        showControls
                        initialPage={1}
                        color="warning"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                    <div className="hidden sm:flex w-[40%] justify-end gap-2">
                        <Button isDisabled={pages === 1} size="md" variant="shadow" className="text-black" onPress={onPreviousPage}>
                            Anterior
                        </Button>
                        <Button isDisabled={pages === 1} size="md" className="text-black mr-58" variant="shadow" onPress={onNextPage}>
                            Siguiente
                        </Button>
                    </div>
                </div>
            );
        }, [items.length, page, pages, hasSearchFilter]);

        return (
            <div className="flex flex-col items-center justify-center p-4 w-full">
                <div className="w-full sm:w-12/12 lg:w-8/12 xl:w-10/12">
                    <Table
                        aria-label="Tabla"
                        isHeaderSticky
                        bottomContent={bottomContent}
                        bottomContentPlacement="outside"
                        classNames={{
                            wrapper: "max-h-[100%] max-w-[100%]",
                        }}
                        className="flex mr-16"
                        sortDescriptor={sortDescriptor}
                        topContent={topContent}
                        topContentPlacement="outside"
                        onSelectionChange={setSelectedKeys}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader columns={data}>
                            {(column) => (
                                <TableColumn
                                    key={column.uid}
                                    align={column.uid === "actions" ? "center" : "start"}
                                    allowsSorting={column.sortable}
                                >
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"No hay resultados registrados"} items={sortedItems}>
                            {(item) => (
                                <TableRow key={item.id_categoria}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [mode, setMode] = useState('create');
    const [initialData, setInitialData] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [categorias, setCategorias] = useState([]);
    const { idCategoria, setCategoriaId } = useContext(CategoriasContext);

    useEffect(() => {
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/categorias/listar');
            // const categoriasFilter = response.data.filter(cate => cate.estado === 'activa');
            setCategorias(response.data);
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const data = [
        {
            uid: 'id_categoria',
            name: 'Id',
            sortable: true
        },
        {
            uid: 'nombre_categoria',
            name: 'Categoría',
            sortable: true
        },
        {
            uid: 'estado',
            name: 'Estado',
            sortable: true
        },
        {
            uid: 'actions',
            name: "Acciones",
            sortable: true
        }
    ];

    const peticionEliminar = async (id_categoria) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                icon: "question",
                text: "¡Esto podría afectar a tus categorias!",
                showCancelButton: true,
                confirmButtonColor: "orange",
                cancelButtonColor: "#d33",
                confirmButtonText: "¡Sí, eliminar!"
            });

            if (result.isConfirmed) {
                const response = await axiosClient.delete(`/categorias/eliminar/${id_categoria}`);

                if (response.status === 200) {
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "Categoría eliminada correctamente.",
                        icon: "success"
                    });
                    peticionGet();
                }
            }
        } catch (error) {
            // Aquí manejas el error y muestras el mensaje que viene del backend
            if (error.response && error.response.status === 400) {
                // El backend devuelve un mensaje cuando la categoría está en uso
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Error en el servidor. Intente nuevamente más tarde.",
                    icon: "error"
                });
            }
        }
    };

    const peticionDesactivar = (id_categoria) => {
        // Mostrar la alerta de confirmación primero
        Swal.fire({
            title: "¿Estás seguro de cambiar el estado de la categoría?",
            text: "¡Esto podría afectar a tus categorías!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "orange",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Sí, estoy seguro!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosClient.put(`/categorias/desactivar/${id_categoria}`);

                    if (response.status === 200) {
                        const nuevoEstado = response.data.message;
                        Swal.fire({
                            title: "¡Actualizado!",
                            text: nuevoEstado,
                            icon: "success"
                        });
                        peticionGet(); // Actualizar la lista después de la desactivación/activación
                    } else {
                        // Si el servidor responde con un estado diferente a 200
                        Swal.fire({
                            title: "Error",
                            text: response.data.message || "Error al actualizar la categoría.",
                            icon: "error"
                        });
                    }
                } catch (error) {
                    // Manejar errores del servidor
                    Swal.fire({
                        title: "Error del servidor",
                        text: error.response?.data?.message || "Ocurrió un error inesperado.",
                        icon: "error"
                    });
                }
            }
        });
    };

    const handleSubmit = async (formData) => {
        // Aquí eliminas 'e.preventDefault();'
        try {
            if (mode === 'create') {
                // En modo de creación, simplemente envía los datos del formulario.
                await axiosClient.post('/categorias/registrar', formData).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Categoría registrada con éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet();
                    } else {
                        alert('Error en el registro');
                    }
                });
            } else if (mode === 'update') {
                // En modo de actualización, utiliza 'id_categoria' para la URL del endpoint.
                await axiosClient.put(`/categorias/actualizar/${initialData.id_categoria}`, formData).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Categoría actualizada con éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet(); // Refrescar los datos
                    }
                }).catch((error) => {
                    // Capturar el error durante la actualización
                    if (error.response && error.response.status === 400) {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "No se puede actualizar",
                            text: error.response.data.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
            setModalOpen(false); // Cerrar el modal después de enviar el formulario
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error en el servidor",
                text: "Ocurrió un error inesperado",
                showConfirmButton: true
            });
        }
    };


    const handleToggle = (mode, categoria = null) => {
        setMode(mode);
        if (categoria) {
            setInitialData(categoria);  // Establecer los datos iniciales
        } else {
            setInitialData(null);  // Limpiar los datos iniciales en modo de creación
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setInitialData(null);
    };

    return (
        <>
            <div className='w-full max-w-[90%] items-center p-10'>
                <EjemploCategoria />
                {modalOpen && (
                    <CategoriaModal
                        open={modalOpen}           // Cambiado de isOpen a open
                        onClose={handleCloseModal} // Cambiado de handleToggle a onClose
                        handleSubmit={handleSubmit}
                        actionLabel={mode === 'create' ? 'Registrar categoria' : 'Editar Categoria'}
                        title={mode === 'create' ? 'Registrar Categoría' : 'Editar Categoría'}
                        initialData={initialData}
                        mode={mode}
                    />
                )}

                {modalAcciones && (
                    <AccionesModal
                        isOpen={modalAcciones}
                        handleToggle={() => setModalAcciones(!modalAcciones)}
                    />
                )}
            </div>
        </>
    );
}

export default Categorias;