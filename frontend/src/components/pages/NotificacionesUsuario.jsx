import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosClient from '../axiosClient.js';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { FaTrash } from 'react-icons/fa'; // Importar el ícono
import Header from '../moleculas/Header.jsx';

export function NotificacionesUsuario() {
    const [notifications, setNotifications] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
                const response = await axiosClient.get(`/usuarios/listarNoti/${id_usuario}`, { headers: { token: token } });

                setNotifications(response.data);
                setIsLoaded(true);
            } catch (error) {
                console.log('Error en el servidor: ' + error);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        notifications.forEach(notification => {
            if (notification.estado === 'denegado') {
                Swal.fire({
                    icon: 'error',
                    title: 'Solicitud Denegada',
                    text: notification.mensaje,
                });
            }
        });
    }, [notifications]);

    const handleDelete = async (id_notificacion) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosClient.delete(`/usuarios/eliminarNotificacion/${id_notificacion}`);
                Swal.fire('Eliminada', response.data.message, 'success');

                // Actualizar la lista de notificaciones
                setNotifications(notifications.filter(notif => notif.id_notificacion !== id_notificacion));
            } catch (error) {
                console.error('Error al eliminar la notificación', error);
                Swal.fire('Error', 'No se pudo eliminar la notificación', 'error');
            }
        }
    };

    const handleWhatsAppRedirect = (whatsapp) => {
        const url = `https://wa.me/${whatsapp}`;
        window.open(url, '_blank');
    };

    const renderNotificationCard = (notification) => {
        return (
            <Card 
                key={notification.id_notificacion} 
                className="relative p-6 shadow-xl bg-gray-100 rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: "#f5f5f5" }} // Fondo gris claro
            >
                <button
                    onClick={() => handleDelete(notification.id_notificacion)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 active:text-red-600 transition-colors duration-150"
                >
                    <FaTrash size={22} />
                </button>
                <CardHeader className="pb-0 pt-2 px-6 flex-col items-center">
                    <div className="w-full text-center">
                        <h4 className="font-bold text-2xl mb-4 text-blue-600">Notificación</h4>
                    </div>
                    <p className="text-lg text-gray-700 mt-2 text-center">{notification.mensaje}</p>
                </CardHeader>
                {notification.mensaje.includes("WhatsApp") && (
                    <CardBody className="flex justify-center py-4">
                        <Button
                            color="success"
                            shadow
                            auto
                            onClick={() => handleWhatsAppRedirect(notification.mensaje.match(/\d+/)[0])}
                        >
                            Contactar por WhatsApp
                        </Button>
                    </CardBody>
                )}
            </Card>
        );
    };

    return (
        <>
            {/* <Header /> */}
            <div className="z-0 w-full sm:w-full lg:w-12/12 xl:w-11/12 mt-10 px-6"> {/* Reducido el margen superior */}
                {notifications.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <h2 className="text-center text-2xl font-bold text-red-600">
                            No tienes notificaciones disponibles
                        </h2>
                    </div>
                ) : (
                    <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4">
                        {notifications.map(renderNotificationCard)}
                    </div>
                )}
            </div>
        </>
    );
}

export default NotificacionesUsuario;
