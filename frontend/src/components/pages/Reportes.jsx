import React from "react";
import Header from '../moleculas/Header.jsx';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Reportes = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/FiltrosReporteAdopcionesPDF'); // Redirige a la vista de filtrados
  }
  const handleSubmit1 = (e) => {
    e.preventDefault();
    navigate('/FiltrosReporteAdopcionesEXCEL'); // Redirige a la vista de filtrados
  }

  const handleSubmit2 = (e) => {
    e.preventDefault();
    navigate('/FiltradosReporteAdoptadosPDF'); // Redirige a la vista de filtrados
  }
  const handleSubmit3 = (e) => {
    e.preventDefault();
    navigate('/FiltradosReporteAdoptadosEXCEL'); // Redirige a la vista de filtrados
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <Header title="Reportes de Mascotas" />
      <div className="flex flex-col md:flex-row max-w-6xl w-full gap-8 mt-16">
        {/* Contenedor Izquierdo: Información y Botón */}
        <div className="flex-1 bg-white shadow-custom rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Generar Reportes de Mascotas en Adopción</h2>
          <p className="text-lg text-gray-700 mb-6">
            Este módulo te permite generar reportes detallado sobre las mascotas en adopción. 
            Puedes filtrar por día, mes, o rango de fechas, categoría y raza, y generar los reportes en formatos Excel y PDF.
          </p>
          <div className="flex space-x-4">
  <button
    onClick={handleSubmit}
    className="w-64 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
  >
    Filtrar y Generar Reporte PDF
  </button>
  <button
    onClick={handleSubmit1}
    className="w-64 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
  >
    Filtrar y Generar Reporte EXCEL
  </button>
</div>


        </div>

        {/* Contenedor Derecho: Información y Botón */}
        <div className="flex-1 bg-white shadow-custom rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Generar Reportes de Mascotas Adoptadas</h2>
          <p className="text-lg text-gray-700 mb-6">
            Este módulo permite generar reportes detallados sobre las mascotas adoptadas. Puedes filtrar por el ID de la mascota, día, semana, rango de fechas, categoría y raza, y generar reportes en formatos Excel y PDF.
          </p>
          <div className="flex space-x-4">
  <button
    onClick={handleSubmit2}
    className="w-64 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
  >
    Filtrar y Generar Reporte PDF
  </button>
  <button
    onClick={handleSubmit3}
    className="w-64 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
  >
    Filtrar y Generar Reporte EXCEL
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default Reportes;
