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
          const imageUrl = data.img && !data.img.startsWith('http')
            ? `${axiosClient.defaults.baseURL}/uploads/${data.img}`
            : data.img || '';
          setFotoUrl(imageUrl);
          setPerfil(data);
          setNombre(data.nombre || '');
          setApellido(data.apellido || '');
          setCorreo(data.correo || '');
          setDireccion(data.direccion || '');
          setTelefono(data.telefono || '');
          setPassword('********');
          setIdUsuario(id_usuario);
          setTipoDocumentoOp(data.tipo_documento || '');
          setPasswordChanged(false);
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
    <div className="bg-gray-200 shadow-md rounded-lg p-10 mx-auto max-w-xl">
      <h6 className="text-2xl font-bold text-black mb-8 text-center">Actualizar Perfil</h6>

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
              Swal.fire('¡Actualización Exitosa!', 'Tu información ha sido actualizada.', 'success');
              onClose();
            }
          } catch (error) {
            console.error('Error al actualizar:', error.response ? error.response.data : error.message);
            Swal.fire('¡Error!', 'No se pudo actualizar tu perfil. Intenta de nuevo.', 'error');
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="flex justify-center mb-6">
              <Avatar
                showFallback
                className="w-32 h-32 rounded-full shadow-lg cursor-pointer"
                onClick={handleClick}
                src={fotoUrl || ''}
              />
              <input
                type="file"
                accept="image/*"
                name="img"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              <div className="flex flex-col">
                <Field name="nombre">
                  {({ field }) => (
                    <Input
                      type="text"
                      className='black'
                      label="Nombre"
                      {...field}
                      required
                    />
                  )}
                </Field>
                <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col">
                <Field name="apellido">
                  {({ field }) => (
                    <Input
                      type="text"
                      className='black'
                      label="Apellido"
                      {...field}
                      required
                    />
                  )}
                </Field>
                <ErrorMessage name="apellido" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col">
                <Field name="direccion">
                  {({ field }) => (
                    <Input
                      type="text"
                      className='black'
                      label="Dirección"
                      {...field}
                      required
                    />
                  )}
                </Field>
                <ErrorMessage name="direccion" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col">
                <Field name="tipo_documento">
                  {({ field }) => (
                    <select
                      className="p-3 text-black border-2 border-black rounded-md focus:outline-none focus:black"
                      {...field}
                      required
                    >
                      <option value="" hidden>Tipo de Documento</option>
                      {tipo_documento.map((tipo) => (
                        <option key={tipo.key} value={tipo.key}>{tipo.label}</option>
                      ))}
                    </select>
                  )}
                </Field>
                <ErrorMessage name="tipo_documento" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col">
                <Field name="correo">
                  {({ field }) => (
                    <Input
                      type="email"
                      className='black'
                      label="Correo Electrónico"
                      {...field}
                      required
                    />
                  )}
                </Field>
                <ErrorMessage name="correo" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col">
                <Field name="telefono">
                  {({ field }) => (
                    <Input
                      type="text"
                      className='black'
                      label="Teléfono"
                      {...field}
                      required
                    />
                  )}
                </Field>
                <ErrorMessage name="telefono" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            <div className="my-6">
              <Input
                label="Contraseña"
                type={isVisible ? 'text' : 'password'}
                value={passwordDisplay}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordChanged(true);
                  setPasswordDisplay(e.target.value);
                  setFieldValue('password', e.target.value);
                }}
                endContent={
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />}
                  </button>
                }
              />
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-50 py-2 bg-black hover:bg-grey-700 text-white rounded-lg"
              >
                Guardar Cambios
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormPerfil;
