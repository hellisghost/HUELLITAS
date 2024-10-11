import React from "react";
import axiosClient from '../axiosClient.js';

const ReporteExcelButton = () => {
  const handleDownload = async () => {
    try {
      const response = await axiosClient.get("/reportesEXCEL1/reporte_excel", {
        responseType: "blob", // Necesario para manejar la respuesta como un archivo
      });

      // Verificar el status de la respuesta
      if (response.status === 404 || response.status === 400) {
        const reader = new FileReader();
        reader.onload = () => {
          const responseText = reader.result;
          const errorData = JSON.parse(responseText);
          alert(errorData.message || "Ocurrió un error al generar el reporte.");
        };
        reader.readAsText(response.data);
        return; // Detener el flujo si hay un error
      }

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const link = document.createElement("a");
      link.href = url;

      // Extraer el nombre del archivo del header 'content-disposition' si está presente
      const contentDisposition = response.headers['content-disposition'];
      let filename = `Reporte_Mascotas_${Date.now()}.xlsx`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      link.setAttribute("download", filename);

      // Añadir el enlace al DOM y simular un clic
      document.body.appendChild(link);
      link.click();

      // Remover el enlace del DOM
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
      alert("Ocurrió un error al descargar el reporte.");
    }
  };

  return (
    <button onClick={handleDownload} className="w-full py-3 bg-warning-500 text-white font-bold rounded-lg shadow-md hover:bg-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-500 transition duration-300">
      Generar Reportes
    </button>
  );
};

export default ReporteExcelButton;
