import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import HeaderRecuperacionContra from '../moleculas/HeaderRecuperacionContra'; // Asegúrate de que la ruta sea correcta

function RestablecerContrasena() {
    const { token } = useParams();
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/usuarios/reset-password', { token, password });
            Swal.fire('Éxito', response.data.message, 'success');
        } catch (error) {
            Swal.fire('Error', error.response.data.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Incorporamos el Header */}
            <HeaderRecuperacionContra title="Restablecer Contraseñaㅤ" />

            <div className="flex flex-1 items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Restablecer Contraseña</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Nueva Contraseña:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warning-500"
                                placeholder="Ingresa tu nueva contraseña"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#ec971f] text-white py-2 rounded-lg hover:bg-[#f0ad4e] transition duration-300"
                        >
                            Restablecer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RestablecerContrasena;
