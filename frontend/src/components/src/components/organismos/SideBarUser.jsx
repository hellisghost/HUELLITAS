import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaX } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { FaRegUserCircle } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

export const SideBarUser = () => {
    const [sidebar, setSideBar] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navRef = useRef(null);
    const navigate = useNavigate();

    const showSideBar = () => setSideBar(!sidebar);

    const handleClickOutside = (event) => {
        if (navRef.current && !navRef.current.contains(event.target)) {
            setSideBar(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Traer el usuario del localStorage
    const storedUser = localStorage.getItem('user');
    const user = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;

    // Verificar si el rol es válido
    const validRoles = ['superusuario', 'administrador', 'usuario'];
    const showPerfil = user && validRoles.includes(user.rol);

    return (
        <div className='z-20'>
            <div className='h-20 flex justify-end items-center'>
                <Link to='#'>
                    <FaRegUserCircle size={40} className="cursor-pointer mr-8 text-white" onClick={showSideBar} />
                </Link>
            </div>
            <IconContext.Provider value={{ color: '#fff' }}>
                <nav
                    ref={navRef}
                    className={`fixed top-0 right-0 h-full w-64 bg-[black] transition-transform duration-300 ease-in-out ${sidebar ? 'translate-x-0' : 'translate-x-full'} shadow-lg`}
                >
                    <ul className='w-full mt-6 flex flex-col items-center p-4' onClick={showSideBar}>
                        <li className='mb-6 self-end'>
                            <Link to='#'>
                                <FaX size={20} className="text-white" />
                            </Link>
                        </li>

                        {/* Mostrar "Perfil de usuario" solo si el rol es válido */}
                        {showPerfil && (
                            <li className='flex items-center mb-4 w-full border-2 border-transparent hover:border-[#EAEDF6] rounded-lg p-2'>
                                <Link to="/perfil" className='flex items-center w-full'>
                                    <CiUser className='text-3xl text-white' />
                                    <span className='text-white text-xl font-bold px-4'>Perfil de usuario</span>
                                </Link>
                            </li>
                        )}

                        <li className='flex items-center mb-4 w-full border-2 border-transparent hover:border-[#EAEDF6] rounded-lg p-2'>
                            <IoLogOutOutline className='text-3xl text-white' />
                            <label className='text-white text-xl font-bold w-full h-full flex items-center px-4 rounded-lg cursor-pointer' onClick={onOpen}>
                                {/* Cambiar el texto dependiendo del rol */}
                                {showPerfil ? 'Cerrar sesión' : 'Volver al inicio'}
                            </label>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center">
                                {/* Cambiar el mensaje del modal */}
                                {showPerfil ? '¿Estás seguro de que deseas cerrar sesión?' : '¿Deseas volver al inicio?'}
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-center">
                                    {showPerfil
                                        ? 'Al cerrar sesión, se cerrará tu sesión actual y deberás iniciar sesión nuevamente para acceder a tu cuenta.'
                                        : 'Serás redirigido al inicio del sitio.'}
                                </p>
                            </ModalBody>
                            <ModalFooter className="flex justify-center gap-4">
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="primary" onPress={() => {
                                    onClose();
                                    // Limpiar el localStorage al cerrar sesión
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    // Redirigir según si tiene rol válido o no
                                    navigate('/');
                                }}>
                                    {showPerfil ? 'Cerrar sesión' : 'Volver al inicio'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
