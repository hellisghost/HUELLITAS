import React from "react";
import axiosClient from '../axiosClient.js';

const ReporteExcelButton2 = () => {
    const handleDownload = async () => {
      try {
        const response = await axiosClient.get("/reportesEXCEL2/reporte_excel", {
          responseType: "blob", // Necesario para manejar la respuesta como un archivo
        });
  
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte_Mascotas_${Date.now()}.xlsx`);
  
        // Añadir el enlace al DOM y simular un clic
        document.body.appendChild(link);
        link.click();
  
        // Remover el enlace del DOM
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al descargar el reporte:", error);
      }
    };
  
    return (
      <button onClick={handleDownload} className="w-full py-3 bg-warning-500 text-white font-bold rounded-lg shadow-md hover:bg-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-500 transition duration-300">
        Generar Reportes
      </button>
    );
  };
  
  export default ReporteExcelButton2;
  