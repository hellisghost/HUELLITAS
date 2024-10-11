import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ListGraficaModal from "../templates/GraficaModal";
import Header from '../moleculas/Header.jsx';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Graficas = () => {
    const [mascotasData, setMascotasData] = useState({
        labels: [],
        datasets: [{
            label: 'Mascotas por Estado',
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#82e0aa'],
        }],
    });
    const [usuariosData, setUsuariosData] = useState({
        labels: [],
        datasets: [{
            label: 'Usuarios por Rol',
            data: [],
            backgroundColor: ['#bb8fce', '#ccd1d1', '#f8c471'],
        }],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMascotasData = async () => {
            try {
                const response = await axiosClient.get('/mascotas/conteo/estado');
                if (Array.isArray(response.data) && response.data.every(item => item.estado && item.total)) {
                    const estados = response.data.map(item => item.estado);
                    const totales = response.data.map(item => item.total);

                    setMascotasData({
                        labels: estados,
                        datasets: [{
                            label: 'Mascotas por Estado',
                            data: totales,
                            backgroundColor: ['#36A2EB', '#FF6384', '#bb8fce', '#82e0aa'],
                        }],
                    });
                } else {
                    throw new Error('La respuesta de la API no tiene el formato esperado');
                }
            } catch (error) {
                console.error('Error fetching mascotas data:', error);
                // setError('Error fetching mascotas data');
            } finally {
                setLoading(false);
            }
        };

        const fetchUsuariosData = async () => {
            try {
                const response = await axiosClient.get('/usuarios/conteo/rol');
                if (Array.isArray(response.data) && response.data.every(item => item.rol && item.total)) {
                    const roles = response.data.map(item => item.rol);
                    const totales = response.data.map(item => item.total);

                    setUsuariosData({
                        labels: roles,
                        datasets: [{
                            label: 'Usuarios por Rol',
                            data: totales,
                            backgroundColor: ['#bb8fce', '#ccd1d1', '#f8c471'],
                        }],
                    });
                } else {
                    throw new Error('La respuesta de la API no tiene el formato esperado');
                }
            } catch (error) {
                console.error('Error fetching usuarios data:', error);
                setError('Error fetching usuarios data');
            } finally {
                setLoading(false);
            }
        };

        fetchMascotasData();
        fetchUsuariosData();
    }, []);

    const optionsBar = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    };

    const optionsDoughnut = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <>
            <Header title="Graficas" />
            <div className="p-8 pl-24">
                <ListGraficaModal>
                    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-28">
                        <div>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : (
                                mascotasData.datasets[0].data.length === 0 ? (
                                    <p>No hay datos de mascotas disponibles</p>
                                ) : (
                                    <Bar data={mascotasData} options={optionsBar} style={{ height: '470px' }} />
                                )
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                        <div>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : (
                                usuariosData.datasets[0].data.length === 0 ? (
                                    <p>No hay datos de usuarios disponibles</p>
                                ) : (
                                    <Doughnut data={usuariosData} options={optionsDoughnut} style={{ height: '500px' }} />
                                )
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                    </div>
                </ListGraficaModal>
            </div>
        </>
    );
};

export default Graficas;
