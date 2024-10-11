import React, { useEffect, useState, useContext, useRef } from 'react';
import { ModalFooter, Input, Textarea, Avatar, AvatarGroup } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { CameraIcon } from '../nextUI/CameraIcon.jsx';
import MascotasContext from '../../context/MascotasContext.jsx';
import axiosClient from '../axiosClient.js';
import { DatePicker } from "@nextui-org/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

const validationSchema = yup.object().shape({
    nombre_mascota: yup
        .string()
        .required('El nombre_mascota es obligatorio')
        .matches(/^[a-zA-Z\s]{1,20}$/, 'El nombre de la mascota debe tener máximo 20 caracteres, y solo puede contener letras y espacios'),
    fechaNacimiento: yup
        .date()
        .required('La fecha de nacimiento es obligatoria')
        .max(new Date(), 'La fecha no puede ser futura'),
    estado: yup
        .string()
        .required('El estado es obligatorio'),
    descripcion: yup
        .string()
        .max(300, 'Máximo 300 caracteres')
        .required('La descripción es obligatoria'),
    esterilizacion: yup
        .string()
        .required('Especifica si la mascota está esterilizada'),
    tamano: yup
        .string()
        .required('El tamaño es obligatorio'),
    peso: yup
        .string()
        .matches(/^[0-9]+(,[0-9]{1,2})?$/, 'El peso debe ser un número con hasta dos decimales')
        .test('max', 'El peso no puede ser mayor a 200', value => {
            if (!value) return true;
            const pesoEnKg = parseFloat(value.replace(',', '.'));
            return pesoEnKg <= 200;
        })
        .required('El peso es obligatorio'),
    fk_id_raza: yup
        .string()
        .required('La raza es obligatoria'),
    fk_id_municipio: yup
        .string()
        .required('El municipio es obligatorio'),
    sexo: yup
        .string()
        .required('El sexo es obligatorio'),
        imagenes: yup
        .array()
        .min(1, 'Debe seleccionar al menos una imagen')
        .required('Debe seleccionar al menos una imagen'),
    
});

const FormMascotas = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [raza, setRaza] = useState([]);
    const [municipio, setMunicipio] = useState([]);
    const [fotos, setFotos] = useState([null, null, null, null]);
    const [fotoUrl, setFotoUrl] = useState([null, null, null, null]);
    const [imagenesExistentes, setImagenesExistentes] = useState([null, null, null, null]);
    const fileInputRef = useRef(null);
    const { idMascota } = useContext(MascotasContext);

    useEffect(() => {
        axiosClient.get('/razas/listar').then((response) => setRaza(response.data));
        axiosClient.get('/municipios/listar').then((response) => setMunicipio(response.data));
    }, []);

    useEffect(() => {
        if (mode === 'update' && idMascota) {
            const fecha = idMascota.fecha_nacimiento ? new Date(idMascota.fecha_nacimiento) : null;
            const peso = parseFloat(idMascota.peso);
            
            const imagenesArray = idMascota.imagenes ? idMascota.imagenes.split(',') : [];
            const updatedFotos = [...imagenesArray, ...Array(4 - imagenesArray.length).fill(null)];
            setImagenesExistentes(updatedFotos);
            
            const fotoUrls = updatedFotos.map(imagen => imagen ? `${axiosClient.defaults.baseURL}/uploads/${imagen}` : null);
            setFotoUrl(fotoUrls);
    
            // Aquí actualizamos formik con las imágenes existentes
            formik.setValues({
                nombre_mascota: idMascota.nombre_mascota || '',
                fechaNacimiento: fecha,
                estado: idMascota.estado || 'En Adopcion',
                descripcion: idMascota.descripcion || '',
                esterilizacion: idMascota.esterilizado || '',
                tamano: idMascota.tamano || '',
                peso: peso || '',
                fk_id_raza: idMascota.fk_id_raza || '',
                fk_id_municipio: idMascota.fk_id_municipio || '',
                sexo: idMascota.sexo || '',
                imagenes: updatedFotos.filter(imagen => imagen !== null),  // Añadimos las imágenes existentes
            });
        }
    }, [mode, idMascota]);
    
    const formik = useFormik({
        initialValues: {
            nombre_mascota: '',
            fechaNacimiento: null,
            estado: 'En Adopcion',
            descripcion: '',
            esterilizacion: '',
            tamano: '',
            peso: '',
            fk_id_raza: '',
            fk_id_municipio: '',
            sexo: '',
            imagenes: [], // Inicialmente vacío, pero se actualizará en el useEffect si es actualización
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('nombre_mascota', values.nombre_mascota);
            
            const formattedDate = values.fechaNacimiento ? new Date(values.fechaNacimiento).toISOString().split('T')[0] : null;
            formData.append('fecha_nacimiento', formattedDate);
    
            formData.append('estado', values.estado);
            formData.append('descripcion', values.descripcion);
            formData.append('esterilizado', values.esterilizacion);
            formData.append('tamano', values.tamano);
            formData.append('peso', values.peso);
            formData.append('fk_id_raza', values.fk_id_raza);
            formData.append('fk_id_municipio', values.fk_id_municipio);
            formData.append('sexo', values.sexo);
    
            // Verificamos las imágenes nuevas y las existentes
            fotos.forEach((foto, index) => {
                if (foto instanceof File) {
                    formData.append('imagenes', foto);
                } else if (imagenesExistentes[index]) {
                    formData.append('imagenesExistentes[]', imagenesExistentes[index]);  // Mantenemos las imágenes existentes
                }
            });
    
            handleSubmit(formData);
        }
    });
    
    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const updatedFotos = [...fotos];
            updatedFotos[index] = file;
            setFotos(updatedFotos);
    
            const updatedFotoUrl = [...fotoUrl];
            updatedFotoUrl[index] = URL.createObjectURL(file);
            setFotoUrl(updatedFotoUrl);
    
            // Actualizamos el campo de Formik con las nuevas imágenes
            formik.setFieldValue('imagenes', updatedFotos.filter(f => f !== null));
        }
    };
    

    const handleClick = (index) => {
        fileInputRef.current.dataset.index = index;
        fileInputRef.current.click();
    };

    return (
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <div className='flex flex-row items-center justify-center'>
                <AvatarGroup isBordered max={4} size={20} className='gap-1'>
                    {fotoUrl.map((imagenUrl, index) => (
                        <div key={`foto-${index}`} className="w-24 h-24 mb-4 cursor-pointer">
                            <Avatar
                                size={80}
                                src={imagenUrl || null}
                                onClick={() => handleClick(index)}
                                fallback={<CameraIcon className="animate-pulse w-12 h-8 text-default-500" fill="currentColor" />}
                            />
                        </div>
                    ))}
                </AvatarGroup>
                <input
                    type="file"
                    name="imagenes"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageChange(e, fileInputRef.current.dataset.index)}
                />
            </div>

            {/* Mostrar mensaje de error si no se ha seleccionado una imagen */}
            {formik.errors.imagenes && formik.touched.imagenes ? (
                <div className="text-red-500 text-sm mt-1 flex justify-center">
                    {formik.errors.imagenes}
                </div>
            ) : null}
            {/*  */}
            <div className='flex justify-center'>
                <div className='flex flex-col mr-4'>
                    <div className='py-2'>
                        <Input
                            type="text"
                            label="nombre_mascota de la mascota"
                            className="w-80 text-black"
                            variant="bordered"
                            id='nombre_mascota'
                            name="nombre_mascota"
                            value={formik.values.nombre_mascota}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.nombre_mascota && !!formik.errors.nombre_mascota}
                            errorMessage={formik.errors.nombre_mascota}
                        />
                    </div>
                    <div className="py-2">
                        <DatePicker
                            label="Fecha Nacimiento"
                            className="w-80 text-black"
                            variant="bordered"
                            maxValue={today(getLocalTimeZone())}
                            value={formik.values.fechaNacimiento ? parseDate(formik.values.fechaNacimiento.toISOString().split('T')[0]) : null}
                            onChange={(date) => formik.setFieldValue('fechaNacimiento', date ? new Date(date) : null)}
                            isInvalid={formik.touched.fechaNacimiento && !!formik.errors.fechaNacimiento}
                            errorMessage={formik.errors.fechaNacimiento}
                        />

                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            id='tamano'
                            name="tamano"
                            value={formik.values.tamano}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        >
                            <option value="" hidden>
                                Tamaño
                            </option>
                            <option value="Grande">Grande</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Pequeño">Pequeño</option>
                        </select>
                        {formik.touched.tamano && formik.errors.tamano && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.tamano}</div>
                        )}
                    </div>
                    <div className="py-2">
                        <Input
                            type="text"
                            label="Peso (Kg)"
                            className="w-80 text-black"
                            variant="bordered"
                            id='peso'
                            name="peso"
                            value={formik.values.peso}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.peso && !!formik.errors.peso}
                            errorMessage={formik.errors.peso}
                        />
                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            id='fk_id_raza'
                            name="fk_id_raza"
                            value={formik.values.fk_id_raza}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        >
                            <option value="" hidden>
                                Seleccionar Raza
                            </option>
                            {raza.map((r) => (
                                <option key={r.id_raza} value={r.id_raza}>
                                    {r.nombre_raza}
                                </option>
                            ))}
                        </select>
                        {formik.touched.fk_id_raza && formik.errors.fk_id_raza && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.fk_id_raza}
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            id='fk_id_municipio'
                            name="fk_id_municipio"
                            value={formik.values.fk_id_municipio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        >
                            <option value="" hidden>
                                Seleccionar municipio
                            </option>
                            {municipio.map((mun) => (
                                <option key={mun.id_municipio} value={mun.id_municipio}>
                                    {mun.nombre_municipio}
                                </option>
                            ))}
                        </select>
                        {formik.touched.fk_id_municipio && formik.errors.fk_id_municipio && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.fk_id_municipio}
                            </div>
                        )}
                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            id='sexo'
                            name="sexo"
                            value={formik.values.sexo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        >
                            <option value="" hidden>
                                Seleccionar Sexo
                            </option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </select>
                        {formik.touched.sexo && formik.errors.sexo && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.sexo}
                            </div>
                        )}
                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            id='esterilizacion'
                            name="esterilizacion"
                            value={formik.values.esterilizacion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        >
                            <option value="" hidden>
                                ¿Está esterilizado?
                            </option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                        {formik.touched.esterilizacion && formik.errors.esterilizacion && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.esterilizacion}
                            </div>
                        )}
                    </div>

                    <div className="py-2">
                        <Textarea
                            label="Descripción"
                            className="w-80 text-black"
                            variant="bordered"
                            id='descripcion'
                            name="descripcion"
                            value={formik.values.descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.descripcion && !!formik.errors.descripcion}
                            errorMessage={formik.errors.descripcion}
                        />
                    </div>



                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            id='estado'
                            name="estado"
                            value={formik.values.estado}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        >
                            <option value="" hidden>
                                Seleccionar Estado
                            </option>
                            <option value="En Adopcion">En Adopción</option>
                            <option value="Reservado">Reservado</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Adoptado">Adoptado</option>
                        </select>
                        {formik.touched.estado && formik.errors.estado && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.estado}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ModalFooter>
                <Button color='danger' variant='flat' onClick={onClose} >
                    Cerrar
                </Button>
                <Button
                    type='submit' className='text-white bg-black'
                >
                    {actionLabel}
                </Button>
            </ModalFooter>
        </form>
    );
};
export default FormMascotas;