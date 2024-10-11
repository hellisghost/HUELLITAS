import React from "react";
import { useNavigate } from 'react-router-dom';

const Reportes = () => {
  const navigate = useNavigate();

  const generarReporte = (tipo, formato) => (e) => {
    e.preventDefault();
    let ruta = '';
    if (tipo === 'adopcion' && formato === 'PDF') ruta = '/reportes/adopciones/pdf';
    if (tipo === 'adopcion' && formato === 'EXCEL') ruta = '/reportes/adopciones/excel';
    if (tipo === 'adoptados' && formato === 'PDF') ruta = '/reportes/adoptados/pdf';
    if (tipo === 'adoptados' && formato === 'EXCEL') ruta = '/reportes/adoptados/excel';
    navigate(ruta);
  };

  return (
    <div style={{ background: '#0d1b2a', height: '100vh', padding: '50px' }}>
      <header style={{ color: '#e0e1dd', fontSize: '40px', textAlign: 'center', marginBottom: '30px' }}>
        Sistema de Reportes de Mascotas
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <section style={{ background: '#1b263b', borderRadius: '15px', padding: '30px', width: '45%' }}>
          <h2 style={{ color: '#f4d58d', fontSize: '28px', marginBottom: '20px' }}>Reportes de Animales en Adopción</h2>
          <p style={{ color: '#c0c7d4', marginBottom: '30px' }}>
            Obtén información detallada sobre los animales que están disponibles para adopción, filtrando por diferentes parámetros y exportando los datos en formato PDF o Excel.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button
              onClick={generarReporte('adopcion', 'PDF')}
              style={{ backgroundColor: '#ff6347', color: '#fff', padding: '15px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Generar PDF
            </button>
            <button
              onClick={generarReporte('adopcion', 'EXCEL')}
              style={{ backgroundColor: '#00b894', color: '#fff', padding: '15px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Generar Excel
            </button>
          </div>
        </section>

        <section style={{ background: '#1b263b', borderRadius: '15px', padding: '30px', width: '45%' }}>
          <h2 style={{ color: '#f4d58d', fontSize: '28px', marginBottom: '20px' }}>Reportes de Animales Adoptados</h2>
          <p style={{ color: '#c0c7d4', marginBottom: '30px' }}>
            Consulta un resumen de las mascotas que han sido adoptadas. Filtra los resultados y exporta los reportes en el formato que prefieras, ya sea PDF o Excel.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button
              onClick={generarReporte('adoptados', 'PDF')}
              style={{ backgroundColor: '#ff6347', color: '#fff', padding: '15px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Generar PDF
            </button>
            <button
              onClick={generarReporte('adoptados', 'EXCEL')}
              style={{ backgroundColor: '#00b894', color: '#fff', padding: '15px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Generar Excel
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reportes;
