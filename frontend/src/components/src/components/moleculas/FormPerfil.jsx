import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';
import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { EyeFilledIcon } from '../nextUI/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../nextUI/EyeSlashFilledIcon';
import { Avatar } from '@nextui-org/react';
import * as yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const validationSchema = yup.object().shape({
  tipo_documento: yup
    .string()
    .required('El tipo de documento es obligatorio'),
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .matches(/^[a-zA-Z\s]{1,20}$/, 'El nombre debe tener máximo 20 caracteres, y solo puede contener letras y espacios'),
  apellido: yup
    .string()
    .required('El apellido es obligatorio')
    .matches(/^[a-zA-Z\s]{1,20}$/, 'El apellido debe tener máximo 20 caracteres, y solo puede contener letras y espacios'),
  direccion: yup
    .string()
    .required('La dirección es obligatoria'),
  correo: yup
    .string()
    .email('El correo electrónico debe ser válido')
    .required('El correo electrónico es obligatorio'),
  telefono: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^\d*$/, 'El teléfono debe ser numérico')
    .length(10, 'El teléfono debe contener exactamente 10 dígitos'),
  password: yup
    .string()
    .required('La contraseña es obligatoria'),
});


const FormPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [id_usuario, setIdUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDisplay, setPasswordDisplay] = useState('********');
  const [foto, setFoto] = useState(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const [tipoDocumentoOp, setTipoDocumentoOp] = useState('');
  const [tipo_documento, setTipoDocumento] = useState([]);
  const fileInputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [passwordChanged, setPasswordChanged] = useState(false);
  const onClose = () => {
    // Aquí defines lo que hace la función onClose, por ejemplo, cerrar el modal
    console.log('Modal cerrado');
  };
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
        const response = await axiosClient.get(`/usuarios/perfil/${id_usuario}`, { headers: { token: token } });
        const data = response.data[0];

        if (data) {
          // Solo añadir el prefijo base si la URL no lo contiene ya
          const imageUrl = data.img && !data.img.startsWith('http')
            ? `${axiosClient.defaults.baseURL}/uploads/${data.img}`
            : data.img || '';
          console.log('URL de la imagen:', imageUrl);
          setFotoUrl(imageUrl);
          setPerfil(data);
          setNombre(data.nombre || '');
          setApellido(data.apellido || '');
          setCorreo(data.correo || '');
          setDireccion(data.direccion || '');
          setTelefono(data.telefono || '');
          setPassword('');
          setPassword('********');
          setIdUsuario(id_usuario);
          setTipoDocumentoOp(data.tipo_documento || '');

          setPasswordChanged(false);  // Restablecemos cuando cargamos los valores
        } else {
          setFotoUrl('');
          setFoto(null);
        }
      } catch (error) {
        console.error("Error al obtener la información", error.response ? error.response.data : error.message);
      }
    };

    obtenerDatos();

    const enumDataTipoDocumento = [
      { key: "tarjeta", label: "Tarjeta" },
      { key: "cedula", label: "Cédula" },
      { key: "tarjeta de extranjeria", label: "Tarjeta de extranjería" },
    ];
    setTipoDocumento(enumDataTipoDocumento);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      setFotoUrl(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  if (!perfil) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h6 className="text-3xl font-extrabold text-warning-500 mb-6 text-center">Editar Perfil</h6>

      <Formik
        initialValues={{
          nombre,
          apellido,
          direccion,
          correo,
          telefono,
          tipo_documento: tipoDocumentoOp,
          password: password,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('nombre', values.nombre);
            formData.append('apellido', values.apellido);
            formData.append('correo', values.correo);
            formData.append('direccion', values.direccion);
            formData.append('telefono', values.telefono);
            formData.append('tipo_documento', values.tipo_documento);
            // if (values.password) formData.append('password', values.password);
            if (foto) formData.append('img', foto);
            if (passwordChanged) {
              formData.append('password', values.password);
            }
            const response = await axiosClient.put(
              `/usuarios/actualizarPerfil/${id_usuario}`,
              formData,
              { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 200) {
              Swal.fire('¡Información actualizada!', 'Tu información ha sido actualizada correctamente.', 'success');
              onClose(); // Cierra el modal
            }
          } catch (error) {
            console.error('Error al actualizar la información:', error.response ? error.response.data : error.message);
            Swal.fire('¡Error!', 'Hubo un problema al actualizar tu perfil. Inténtalo de nuevo más tarde.', 'error');
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className='flex flex-col items-center mb-4'>
              <Avatar
                showFallback
                className="w-24 h-24 cursor-pointer mb-4"
                onClick={handleClick}
                src={fotoUrl || ''}
              />
              <input
                type="file"
                accept="image/*"
                name="img"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col w-full md:w-1/2 p-2">
                <div className="py-2">
                  <Field name="nombre">
                    {({ field }) => (
                      <Input
                        type="text"
                        color='warning'
                        variant="bordered"
                        label="Nombre"
                        className="w-full"
                        {...field}
                        required
                      />
                    )}
                  </Field>
                  <ErrorMessage name="nombre" component="div" className="text-red-500" />
                </div>
                <div className="py-2">
                  <Field name="apellido">
                    {({ field }) => (
                      <Input
                        type="text"
                        color='warning'
                        variant="bordered"
                        label="Apellido"
                        className="w-full"
                        {...field}
                        required
                      />
                    )}
                  </Field>
                  <ErrorMessage name="apellido" component="div" className="text-red-500" />
                </div>
                <div className="py-2">
                  <Field name="direccion">
                    {({ field }) => (
                      <Input
                        type="text"
                        color='warning'
                        variant="bordered"
                        label="Dirección"
                        className="w-full"
                        {...field}
                        required
                      />
                    )}
                  </Field>
                  <ErrorMessage name="direccion" component="div" className="text-red-500" />
                </div>
                <div className="py-2">
                  <Field name="tipo_documento">
                    {({ field }) => (
                      <select
                        className="h-14 pl-2 pr-4 py-2 w-full text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        {...field}
                        required
                      >
                        <option value="" hidden>
                          Seleccionar Tipo de documento
                        </option>
                        {tipo_documento.map((tipo) => (
                          <option key={tipo.key} value={tipo.key}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <ErrorMessage name="tipo_documento" component="div" className="text-red-500" />
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/2 p-2">
                <div className="py-2">
                  <Field name="correo">
                    {({ field }) => (
                      <Input
                        type="email"
                        color='warning'
                        variant="bordered"
                        label="Correo Electrónico"
                        className="w-full"
                        {...field}
                        required
                      />
                    )}
                  </Field>
                  <ErrorMessage name="correo" component="div" className="text-red-500" />
                </div>
                <div className="py-2">
                  <Field name="password">
                    {({ field, form }) => (
                      <Input
                        label="Contraseña"
                        color='warning'
                        variant="bordered"
                        type={isVisible ? "text" : "password"}
                        endContent={
                          <button type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                            ) : (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        className="w-full"
                        {...field}
                        onChange={(e) => {
                          form.handleChange(e);  // Usamos form.handleChange para actualizar el valor en Formik
                          if (e.target.value !== '*******') {
                            setPasswordChanged(true);  // Cambiamos el estado si la contraseña ha sido modificada
                          }
                        }}
                        required
                      />
                    )}
                  </Field>

                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
                <div className="py-2">
                  <Field name="telefono">
                    {({ field }) => (
                      <Input
                        type="text"
                        color='warning'
                        variant="bordered"
                        label="Teléfono"
                        className="w-full"
                        {...field}
                        required
                      />
                    )}
                  </Field>
                  <ErrorMessage name="telefono" component="div" className="text-red-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                type="submit"
                color="warning"
                className="mt-4 text-white p-2 w-40"
                css={{
                  borderRadius: "$full",
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                  padding: "0.5rem 2rem"
                }}
              >
                Editar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );

};

export default FormPerfil;
