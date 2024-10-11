import React, { useRef, useEffect, useState, useContext } from 'react';
import { ModalFooter, Input, Select, SelectItem, Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useFormik } from 'formik';
import * as yup from 'yup';
import UsuarioContext from '../../context/UsuariosContext.jsx';
import { EyeFilledIcon } from "../nextUI/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../nextUI/EyeSlashFilledIcon";
import axiosClient from '../axiosClient.js';

// Definir el esquema de validación con yup
const validationSchema = yup.object().shape({
    tipo_documento: yup
        .string()
        .required('El tipo de documento es obligatorio'),
        documento_identidad: yup
        .string()
        .required('El documento de identidad es obligatorio')
        .matches(/^\d+$/, 'El documento de identidad debe ser numérico')
        .min(6, 'El documento de identidad debe contener como minimo 6 dígitos')
        .max(10, 'El documento de identidad debe contener como maximo 10 dígitos'),
    
    nombre: yup
        .string()
        .required('El nombre es obligatorio')
 	 .matches(/^[a-zA-ZñÑ\s]{1,20}$/, 'El nombre debe tener máximo 20 caracteres, y solo puede contener letras y espacios'),
    apellido: yup
        .string()
        .required('El apellido es obligatorio')
 	 .matches(/^[a-zA-ZñÑ\s]{1,20}$/, 'El apellido debe tener máximo 20 caracteres, y solo puede contener letras y espacios'),
    direccion: yup
        .string()
        .required('La dirección es obligatoria'),
    correo: yup
        .string()
        .email('El correo electrónico debe ser válido')
        .required('El correo electrónico es obligatorio'),
    telefono: yup
        .string()
        .required('El telefono es obligatorio')
        .matches(/^\d*$/, 'El teléfono debe ser numérico')
        .min(10, 'El telefono debe contener exactamente 10 dígitos'),
    password: yup
        .string()
        .required('La contraseña es obligatoria'),
    rol: yup
        .string()
        .required('El rol es obligatorio'),
});

const FormUsuarios = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [rol, setRol] = useState([]);
    const [tipo_documento, setTipoDocumento] = useState([]);
    const [passwordChanged, setPasswordChanged] = useState(false);

    const [foto, setFoto] = useState(null);
    const [fotoUrl, setFotoUrl] = useState('');
    const fileInputRef = useRef(null);

    const { idUsuario } = useContext(UsuarioContext);

    useEffect(() => {
        const enumDataTipoDocumento = [
            { key: "tarjeta", label: "Tarjeta" },
            { key: "cedula", label: "Cédula" },
            { key: "tarjeta de extranjeria", label: "Tarjeta de extranjería" },
        ];
        setTipoDocumento(enumDataTipoDocumento);
    }, []);

    useEffect(() => {
        const enumDataRol = [
            { key: "superusuario", label: "Super usuario" },
            { key: "administrador", label: "Administrador" },
            { key: "usuario", label: "Usuario" },
        ];
        setRol(enumDataRol);
    }, []);

    const formik = useFormik({
        initialValues: {
            tipo_documento: '',
            documento_identidad: '',
            nombre: '',
            apellido: '',
            direccion: '',
            correo: '',
            telefono: '',
            password: '',
            rol: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('tipo_documento', values.tipo_documento);
                formData.append('documento_identidad', values.documento_identidad);
                formData.append('nombre', values.nombre);
                formData.append('apellido', values.apellido);
                formData.append('direccion', values.direccion);
                formData.append('correo', values.correo);
                formData.append('telefono', values.telefono);
                // formData.append('password', values.password);
                formData.append('rol', values.rol);

                if (foto) {
                    formData.append('img', foto);
                }

                if (passwordChanged) {
                    formData.append('password', values.password);
                }
                
                handleSubmit(formData);
            } catch (error) {
                alert('Hay un error en el sistema ' + error);
            }
        },
    });

    useEffect(() => {
        if (mode === 'update' && idUsuario) {
            formik.setValues({
                tipo_documento: idUsuario.tipo_documento || '',
                documento_identidad: idUsuario.documento_identidad || '',
                nombre: idUsuario.nombre || '',
                apellido: idUsuario.apellido || '',
                direccion: idUsuario.direccion || '',
                correo: idUsuario.correo || '',
                telefono: idUsuario.telefono || '',
                password: '*******', // Mostrar los asteriscos
                rol: idUsuario.rol || '',
            });
setFotoUrl(idUsuario.img ? `${axiosClient.defaults.baseURL}/uploads/${idUsuario.img}` : '');
            setPasswordChanged(false);  // Restablecemos cuando cargamos los valores
        }
    }, [mode, idUsuario]);

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

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-col items-center mb-4'>
                <Avatar
                    showFallback
                    className="w-24 h-24 cursor-pointer mb-4"
                    onClick={handleClick}
                    src={fotoUrl}
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

            <div className='flex flex-wrap justify-between'>
                <div className='flex flex-col w-full md:w-1/2 p-2'>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="tipo_documento"
                            value={formik.values.tipo_documento}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Tipo de documento
                            </option>
                            {tipo_documento.map((tipo) => (
                                <option key={tipo.key} value={tipo.key}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                        {formik.touched.tipo_documento && formik.errors.tipo_documento && (
                            <div className="text-red-500 text-sm">{formik.errors.tipo_documento}</div>
                        )}
                    </div>

                    <div className='py-2'>
                        <Input
                            type="number"
                            color='warning'
                            variant="bordered"
                            label="Documento de identidad"
                            className="w-full"
                            id='documento_identidad'
                            name="documento_identidad"
                            value={formik.values.documento_identidad}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.documento_identidad && !!formik.errors.documento_identidad}
                            errorMessage={formik.errors.documento_identidad}
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Nombre"
                            className="w-full"
                            id='nombre'
                            name="nombre"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.nombre && !!formik.errors.nombre}
                            errorMessage={formik.errors.nombre}
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Apellido"
                            className="w-full"
                            id='apellido'
                            name="apellido"
                            value={formik.values.apellido}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.apellido && !!formik.errors.apellido}
                            errorMessage={formik.errors.apellido}
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Dirección"
                            className="w-full"
                            id='direccion'
                            name="direccion"
                            value={formik.values.direccion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.direccion && !!formik.errors.direccion}
                            errorMessage={formik.errors.direccion}
                        />
                    </div>
                </div>

                <div className='flex flex-col w-full md:w-1/2 p-2'>
                    <div className='py-2'>
                        <Input
                            type="email"
                            color='warning'
                            variant="bordered"
                            label="Correo Electrónico"
                            className="w-full"
                            id='correo'
                            name="correo"
                            value={formik.values.correo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.correo && !!formik.errors.correo}
                            errorMessage={formik.errors.correo}
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Teléfono"
                            className="w-full"
                            id='telefono'
                            name="telefono"
                            value={formik.values.telefono}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.telefono && !!formik.errors.telefono}
                            errorMessage={formik.errors.telefono}
                        />
                    </div>
                    <div className='py-2'>
                <Input
                    color='warning'
                    variant="bordered"
                    label="Contraseña"
                    type={isVisible ? "text" : "password"}
                    className="w-full"
                    required
                    id='password'
                    name="password"
                    value={formik.values.password}
                    onChange={(e) => {
                        formik.handleChange(e);
                        if (e.target.value !== '*******') {
                            setPasswordChanged(true);  // Si el valor cambia, marcamos que la contraseña ha sido modificada
                        }
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && !!formik.errors.password}
                    errorMessage={formik.errors.password}
                    endContent={
                        <button type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                            ) : (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                />
            </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="rol"
                            value={formik.values.rol}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Rol
                            </option>
                            {rol.map((r) => (
                                <option key={r.key} value={r.key}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        {formik.touched.rol && formik.errors.rol && (
                            <div className="text-red-500 text-sm">{formik.errors.rol}</div>
                        )}
                    </div>
                </div>
            </div>

            <ModalFooter>
                <Button color='danger' variant='flat' onClick={onClose} >
                    Cerrar
                </Button>
                <Button
                    type='submit' color="warning" className='text-white'
                >
                    {actionLabel}
                </Button>
            </ModalFooter>
        </form>
    );
};

export default FormUsuarios;
