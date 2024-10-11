import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { useNavigate } from 'react-router-dom';
import React from "react";
import Inicio from './components/pages/Inicio';
import RegistroUser from './components/pages/RegistroUser';
import IniciarSesion from './components/pages/IniciarSesion';
import GlobalProvider from "./context/GlobalContext";
import { ListsMascotas } from "./components/pages/ListsMascotas";

import Graficas from "./components/pages/Grafica";
import Usuarios from "./components/pages/Usuarios";
import TabMascotas from "./components/pages/TabMascotas";
import TabNotificaciones from "./components/pages/TabNotificaciones";
import PerfilUsuario from "./components/pages/Perfil";
import Reportes from "./components/pages/Reportes";
import FiltradosReporteAdopcionesExcel from "./components/pages/FiltradosReporteAdopcionesExcel";
import FiltradosReporteAdopcionesPDF from "./components/pages/FiltradosReporteAdopcionesPDF";
import FiltradosReporteAdoptadosPDF from "./components/pages/FiltradosReporteAdoptadosPDF";
import FiltradosReporteAdoptadosEXCEL from "./components/pages/FiltradosReporteAdoptadosExcel";
import InvitadoPets from "./components/pages/InvitadoPets";
import TabAdopciones from "./components/pages/TabAdopciones";
import SolicitarRecuperacion from "./components/pages/SolicitarRecuperacion";
import RestablecerContrasena from "./components/pages/RestablecerContrasena";

function App() {
  const stored = localStorage.getItem('user');
  const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/iniciosesion" element={<IniciarSesion />} />
          <Route path="/registro" element={<RegistroUser />} />
          <Route path="/invitado" element={<InvitadoPets />} />
          <Route path="/solicitar_recuperacion" element={<SolicitarRecuperacion />} />
          <Route path="${process.env.FRONTEND_URL}/restablecer_contrasena/${token}" element={<RestablecerContrasena />} />

          {user && user.rol === 'superusuario' && (
            <>
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/mascotas" element={<TabMascotas />} />
              <Route path="/notificaciones" element={<TabNotificaciones />} />
              <Route path="/graficas" element={<Graficas />} />
              <Route path="/perfil" element={<PerfilUsuario />} />
              <Route path="/FiltrosReporteAdopcionesPDF" element={<FiltradosReporteAdopcionesPDF />} />
              <Route path="/FiltrosReporteAdopcionesEXCEL" element={<FiltradosReporteAdopcionesExcel />} />
              <Route path="/FiltradosReporteAdoptadosPDF" element={<FiltradosReporteAdoptadosPDF />} />
              <Route path="/FiltradosReporteAdoptadosEXCEL" element={<FiltradosReporteAdoptadosEXCEL />} />
              <Route path="/reportes" element={<Reportes />} />
            </>
          )}
          {user && user.rol === 'administrador' && (
            <>
              <Route path="/mascotas" element={<TabMascotas />} />
              <Route path="/perfil" element={<PerfilUsuario />} />
              <Route path="/FiltrosReporteAdopcionesPDF" element={<FiltradosReporteAdopcionesPDF />} />
              <Route path="/FiltrosReporteAdopcionesEXCEL" element={<FiltradosReporteAdopcionesExcel />} />
              <Route path="/FiltradosReporteAdoptadosPDF" element={<FiltradosReporteAdoptadosPDF />} />
              <Route path="/FiltradosReporteAdoptadosEXCEL" element={<FiltradosReporteAdoptadosEXCEL />} />
              <Route path="/reportes" element={<Reportes />} />
            </>
          )}
          {user && user.rol === 'usuario' && (
            <>
              <Route path="/listmascotas" element={<ListsMascotas />} />
              <Route path="/notificaciones" element={<TabNotificaciones />} />
              <Route path="/adopciones" element={<TabAdopciones />} />
              <Route path="/perfil" element={<PerfilUsuario />} />
            </>
          )}
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
