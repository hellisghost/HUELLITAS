import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Avatar } from "@nextui-org/react";
import axiosClient from '../axiosClient';
import { FaUserCircle } from 'react-icons/fa';
import PerfilModal from '../templates/PerfilModal';
import Header from '../moleculas/Header';

const PerfilUsuario = () => {
  const [solicitudEnviada, setSolicitudEnviada] = useState(false); // Estado para controlar si la solicitud fue enviada
  const [perfil, setPerfil] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [mode, setMode] = useState('update');

  const navigate = useNavigate();


  const refreshPerfil = async () => {
    await obtenerDatos(); // Obtén los datos más recientes
  };

  const obtenerDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
      const response = await axiosClient.get(`/usuarios/perfil/${id_usuario}`, { headers: { token: token } });
      const data = response.data[0];

      const imageUrl = data && data.img
        ? `${axiosClient.defaults.baseURL}/uploads/${data.img}`
        : 'path/to/default-image.jpg';

      setPerfil({ ...data, imageUrl });
    } catch (error) {
      console.error("Error al obtener la información", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleSubmit = async (e, passwordChanged) => {
    e.preventDefault();
    console.log('Datos enviados:', initialData);

    try {
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;

      if (mode === 'update') {
        if (!passwordChanged) {
          delete formData.password;
        }
        const response = await axiosClient.put(`/usuarios/actualizar/${id_usuario}`, initialData);
        if (response.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se actualizó con éxito la información",
            showConfirmButton: false,
            timer: 1500
          });
          refreshPerfil(); // Llama a la función para actualizar el perfil en la vista
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al actualizar la información",
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error en el servidor",
        text: error.message,
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setModalOpen(false); // Cierra el modal después de intentar actualizar
    }
  };

  const handleToggle = () => {
    setModalOpen(true);
    setMode('update');
    setInitialData(perfil); // Pasa los datos actuales del perfil al modal
  };

  const handleRequestRoleChange = async () => {
    if (solicitudEnviada) {
      // Si ya se envió la solicitud, muestra el mensaje de advertencia
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Solicitud ya enviada",
        text: "Ya has enviado una solicitud de cambio de rol. Por favor, espera la aprobación.",
        showConfirmButton: false,
        timer: 1500
      });
      return; // No hace nada más si ya se envió la solicitud
    }

    try {
      const token = localStorage.getItem("token");
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
      const response = await axiosClient.post(`/usuarios/solicitarCambioRol/${id_usuario}`, {
        headers: { token: token },
      });

      if (response.status === 200) {
        setSolicitudEnviada(true); // Cambia el estado para indicar que la solicitud fue enviada
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Solicitud enviada",
          text: "Tu solicitud de cambio de rol ha sido enviada al Super-Usuario.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al enviar la solicitud",
        text: error.message,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };


  return (
    <>
      <Header title="Perfil" />
      {perfil && (
        <div className='my-12 flex justify-center pl-24'>
          <div className="flex flex-col items-center">
            <h6 className="text-4xl font-extrabold text-warning-500 mb-6">Tu Perfil</h6>
            <div
              className="flex items-center mb-6 rounded-full p-1"
              style={{
                border: '2px solid #D1D5DB',
                transition: 'border-color 0.3s, border-width 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'orange';
                e.currentTarget.style.borderWidth = '4px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.borderWidth = '2px';
              }}>
              {perfil.img ? (
                <Avatar
                  src={perfil.img}
                  alt="Imagen de perfil"
                  css={{
                    borderRadius: "$full",
                  }}
                  className="w-40 h-40 border-gray-800 hover:border-warning-500 transition-colors duration-300"
                />
              ) : (
                <FaUserCircle
                  size={150}
                  className="text-gray-400 border-4 border-gray-800 p-2 rounded-full bg-gray-100 w-36 h-36 hover:border-warning-500 transition-colors duration-300"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {[
                { label: "Nombre(s):", value: perfil.nombre },
                { label: "Apellidos:", value: perfil.apellido },
                { label: "Tipo de documento:", value: perfil.tipo_documento },
                { label: "Número de documento:", value: perfil.documento_identidad },
                { label: "Dirección:", value: perfil.direccion },
                { label: "Correo Electrónico:", value: perfil.correo },
                { label: "Teléfono:", value: perfil.telefono },
                { label: "Rol:", value: perfil.rol }
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-lg border border-gray-300 hover:border-2 hover:border-warning-500 transition-colors"
                >
                  <label className="font-semibold text-base text-gray-800">{item.label}</label>
                  <p className="text-lg text-gray-600">{item.value || "No disponible"}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                auto
                flat
                color="warning"
                className='mt-4 text-white p-2 w-40'
                onClick={handleToggle}
                css={{
                  borderRadius: "$full",
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                  padding: "0.5rem 2rem"
                }}
              >
                Edita tu Perfil
              </Button>
            </div>

            {/* Sección para solicitar cambio de rol */}
            {perfil.rol === 'usuario' && (
              <div className="mt-8 text-center">
                <p className="text-lg font-medium text-gray-700">¿Deseas solicitar un cambio de rol superior?</p>
                <Button
                  color="error"
                  onClick={handleRequestRoleChange}
                  className="mt-4 text-white bg-blue-600 hover:bg-blue-500"
                >
                  Solicitar Cambio de Rol
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <PerfilModal
          open={modalOpen}  // Aquí se pasa correctamente el estado
          onClose={() => setModalOpen(false)}  // Función para cerrar el modal
          handleSubmit={handleSubmit}
          title="Editar Perfil 123"
          initialData={initialData}
          mode={mode}
          refreshPerfil={refreshPerfil}
        />
      )}

    </>
  );
};

export default PerfilUsuario;
