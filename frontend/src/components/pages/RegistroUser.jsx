import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Import imagenes e iconos
import imagenes from '../../styles/imagenes'
import iconos from '../../styles/iconos'
import Icon from '../atomos/IconVolver'
// Import conexion con el servidor
import axiosClient from '../axiosClient'
// Import de nextUI
import { EyeFilledIcon } from '../nextUI/EyeFilledIcon'
import { CameraIcon } from '../nextUI/CameraIcon.jsx';
import { EyeSlashFilledIcon } from '../nextUI/EyeSlashFilledIcon'
import { Input, Select, SelectItem, Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
// Import alertas 
import Swal from 'sweetalert2'
import { useFormik } from 'formik';
import * as yup from 'yup';

function RegistroUser() {
    const navigate = useNavigate();

    const typeDocuemnt = [
        { key: "tarjeta", label: "tarjeta" },
        { key: "cedula", label: "cedula" },
        { key: "tarjeta de extranjeria", label: "tarjeta de extranjería" },
    ];

    // Estado para la imagen
    const [foto, setFoto] = useState(null);
    const [fotoUrl, setFotoUrl] = useState(''); // URL de la imagen para mostrar
    const fileInputRef = useRef(null);

    // Esquema de validación con Yup
    const validationSchema = yup.object({
        nombre: yup.string()
            .matches(/^[a-zA-ZñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
            .required('El nombre es obligatorio'),
        apellido: yup.string()
            .matches(/^[a-zA-ZñÑ\s]+$/, 'El apellido solo puede contener letras y espacios')
            .required('El apellido es obligatorio'),
        direccion: yup.string().required('La dirección es obligatoria'),
        correo: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
        telefono: yup.string()
        .matches(/^[0-9]{10}$/, 'El teléfono debe contener exactamente 10 dígitos')
        .required('El teléfono es obligatorio'),
    
        documento_identidad: yup
        .string()
        .required('El documento de identidad es obligatorio')
        .matches(/^\d+$/, 'El documento de identidad debe ser numérico')
        .min(6, 'El documento de identidad debe contener como minimo 6 dígitos')
        .max(10, 'El documento de identidad debe contener como maximo 10 dígitos'),
    
        password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(16, 'La contraseña no puede tener más de 16 caracteres').required('La contraseña es obligatoria'),
        tipo_documento: yup.string().required('Debe seleccionar un tipo de documento')
    });


    // Formik para manejar el formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            direccion: '',
            correo: '',
            telefono: '',
            documento_identidad: '',
            password: '',
            tipo_documento: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            // Verificar si el correo ya está registrado
            const { data: correoExiste } = await axiosClient.get(`/usuarios/verificar/correo/${values.correo}`);
            if (correoExiste.existe) {
                Swal.fire({
                    position: "top-center",
                    icon: 'warning',
                    title: 'El correo electrónico ya está registrado',
                    text: 'Por favor, utilice otro correo electrónico.',
                    showConfirmButton: true
                });
                return;
            }

            // Verificar si el documento de identidad ya está registrado
            const { data: documentoExiste } = await axiosClient.get(`/usuarios/verificar/documento_identidad/${values.documento_identidad}`);
            if (documentoExiste.existe) {
                Swal.fire({
                    position: "top-center",
                    icon: 'warning',
                    title: 'El documento de identidad ya está registrado',
                    text: 'Por favor, utilice otro documento de identidad.',
                    showConfirmButton: true
                });
                return;
            }
            const formDataUser = new FormData();
            formDataUser.append('nombre', values.nombre);
            formDataUser.append('apellido', values.apellido);
            formDataUser.append('direccion', values.direccion);
            formDataUser.append('correo', values.correo);
            formDataUser.append('telefono', values.telefono);
            formDataUser.append('documento_identidad', values.documento_identidad);
            formDataUser.append('password', values.password);
            formDataUser.append('rol', 'usuario');
            formDataUser.append('tipo_documento', values.tipo_documento);
            if (foto) {
                formDataUser.append('img', foto);
            }

            try {
                const response = await axiosClient.post('/usuarios/registrar', formDataUser);
                console.log('Datos del registro del usuario', response);
                Swal.fire({
                    position: "top-center",
                    icon: 'success',
                    title: 'Usuario registrado con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/iniciosesion');
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                Swal.fire({
                    position: "top-center",
                    icon: 'error',
                    title: 'Error al registrar usuario, intente de nuevo',
                    text: 'Por favor, intente nuevamente.',
                    showConfirmButton: true
                });
            }
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFoto(file);
        if (file) {
            setFotoUrl(URL.createObjectURL(file)); // Actualizar la vista previa de la imagen
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    // const para ver el estado dinámico del ojo del password
    const [isVisible, setIsVisible] = useState(false);

    // toggleVisibility alterna la visibilidad de la contraseña entre texto y puntos.
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="flex items-center justify-center bg-[black] min-h-screen p-2 w-full">
            <div className='relative flex flex-col m-0 space-y-0 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 '>
                <div className="flex flex-col p-4 md:p-10">
                    <Link className='mb-0' to='/' >
                        <Icon icon={iconos.iconoVolver} className='w-8 h-8' />
                    </Link>
                    <span className="mb-6 text-4xl font-bold text-center">Registro</span>
                    <form onSubmit={formik.handleSubmit}>
                        {/* Campo Imagen */}
                        <div className='flex flex-col items-center mb-4'>
                            <Avatar
                                showFallback
                                className="w-24 h-24 cursor-pointer mb-4"
                                onClick={handleClick}
                                src={fotoUrl || 'https://images.unsplash.com/broken'}
                                fallback={
                                    <CameraIcon className="animate-pulse w-12 h-12 text-default-500" fill="currentColor" size={20} />
                                }
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

                        {/* Campo nombre */}
                        <div className="py-2">
                            <Input
                                type='text'
                                label='Ingrese sus nombres completos'
                                color="black"
                                variant="bordered"
                                className='w-80'
                                name='nombre'
                                id='nombre'
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.nombre && !!formik.errors.nombre}
                                errorMessage={formik.errors.nombre}
                            />
                        </div>

                        {/* Campo apellido */}
                        <div className="py-2">
                            <Input
                                type='text'
                                label='Ingrese sus apellidos completos'
                                color="black"
                                variant="bordered"
                                className='w-80'
                                name='apellido'
                                id='apellido'
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.apellido && !!formik.errors.apellido}
                                errorMessage={formik.errors.apellido}
                            />
                        </div>

                        {/* Campo Correo */}
                        <div className="py-2">
                            <Input
                                type='email'
                                label='Ingrese su correo'
                                color="black"
                                variant="bordered"
                                className='w-80'
                                name='correo'
                                id='correo'
                                value={formik.values.correo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.correo && !!formik.errors.correo}
                                errorMessage={formik.errors.correo}
                            />
                        </div>

                        {/* Campo Dirección */}
                        <div className="py-2">
                            <Input
                                type='text'
                                label='Ingrese su dirección'
                                color="black"
                                variant="bordered"
                                className='w-80'
                                name='direccion'
                                id='direccion'
                                value={formik.values.direccion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.direccion && !!formik.errors.direccion}
                                errorMessage={formik.errors.direccion}
                            />
                        </div>

                        {/* Campo Teléfono */}
                        <div className="py-2">
                            <Input
                                type='number'
                                label='Ingrese su teléfono'
                                color="black"
                                variant="bordered"
                                className='w-80'
                                name='telefono'
                                id='telefono'
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.telefono && !!formik.errors.telefono}
                                errorMessage={formik.errors.telefono}
                            />
                        </div>

                        {/* Campo Tipo de Documento */}
                        <div className="py-2">
                            <Select
                                label="Tipo de documento"
                                color="black"
                                className='w-80'
                                name="tipo_documento"
                                value={formik.values.tipo_documento}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.tipo_documento && !!formik.errors.tipo_documento}
                                errorMessage={formik.errors.tipo_documento}
                            >
                                {typeDocuemnt.map((tipo) => (
                                    <SelectItem key={tipo.key} value={tipo.key}>
                                        {tipo.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Campo Documento de Identidad */}
                        <div className="py-2">
                            <Input
                                type='number'
                                label='Ingrese su documento de identidad'
                                color="black"
                                variant="bordered"
                                className='w-80'
                                name='documento_identidad'
                                id='documento_identidad'
                                value={formik.values.documento_identidad}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.documento_identidad && !!formik.errors.documento_identidad}
                                errorMessage={formik.errors.documento_identidad}
                            />
                        </div>
                        {/* Campo Rol */}
                        <Select
                            color="black"
                            variant="bordered"
                            className='w-80'
                            label='Usuario'
                            isDisabled
                        />

                        {/* Campo Password */}
                        <div className="py-2">
                            <Input
                                type={isVisible ? "text" : "password"}
                                label='Ingrese una contraseña'
                                color="black"
                                variant="bordered"
                                className='w-80'
                                name='password'
                                id='password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.password && !!formik.errors.password}
                                errorMessage={formik.errors.password}
                                endContent={
                                    <button type="button" className="focus:outline-none" onClick={toggleVisibility}>
                                        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                                    </button>
                                }
                            />
                        </div>

                        <Button type="submit" className='mt-4 w-full text-white p-2 bg-black'>
                            Registrarse
                        </Button>
                    </form>
                </div>
                <div className="relative">
                    <img className="w-[350px] h-full hidden rounded-r-2xl md:block object-cover" src={imagenes.imgRegistroPets} alt='dog' />
                </div>
            </div>
        </div>
    );
}

export default RegistroUser;
