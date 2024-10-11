import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';
import HeaderRecuperacionContra from '../moleculas/HeaderRecuperacionContra';

function SolicitarRecuperacion() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handleCorreoSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/usuarios/solicitar-reset-password', { correo });
            Swal.fire('Éxito', response.data.message, 'success');
            setShowPasswordForm(true); // Muestra el formulario de contraseña
        } catch (error) {
            Swal.fire('Error', error.response.data.message, 'error');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/usuarios/update-password', { correo, password });
            Swal.fire('Éxito', response.data.message, 'success');
        } catch (error) {
            Swal.fire('Error', error.response.data.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <HeaderRecuperacionContra title="Recuperar Contraseñaㅤ" />

            <div className="flex flex-1 items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Recuperar Contraseña</h2>
                    
                    {!showPasswordForm ? (
                        <form onSubmit={handleCorreoSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Ingresa tu correo electrónico"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#ec971f] text-white py-2 rounded-lg hover:bg-[#f0ad4e] transition duration-300"
                            >
                                Verificar Correo
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Nueva Contraseña:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Ingresa tu nueva contraseña"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#ec971f] text-white py-2 rounded-lg hover:bg-[#f0ad4e] transition duration-300"
                            >
                                Guardar Contraseña
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SolicitarRecuperacion;