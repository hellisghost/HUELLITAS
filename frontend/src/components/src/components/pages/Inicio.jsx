import React from 'react';
import { Link } from 'react-router-dom';
import imagenes from "../../styles/imagenes";

function Inicio() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${imagenes.imgPrincipalPets})` }}>
            {/* Superposición oscura */}
            <div className="absolute inset-0 bg-black opacity-35 z-0"></div>

            <div className="relative z-10 flex items-center justify-between w-full h-24 text-white py-1 px-4">
                <img alt="logo" className="w-12 h-12" src={imagenes.imgLogo} />
                <ul className="flex space-x-4">
                    <li>
                        <Link to='/registro'>
                            <button className="text-white border-3 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Registrarse
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/iniciosesion'>
                            <button className="mr-5 inline-block px-5 py-2.5 text-white font-semibold border-2 border-transparent rounded transition-transform hover:border-white hover:bg-transparent hover:text-white transform translate-x-2 text-center bg-[#F7B318]">
                                Iniciar Sesion
                            </button>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <div className="text-center max-w-4xl">
                    <h1 className="text-7xl text-white font-semibold mb-4">Bienvenidos</h1>
                    <p className="text-2xl text-white leading-tight">¡Bienvenido a Purrfect Match tu amigo ideal en el mundo. Explora y adopta! una cola espera por ti</p>
                    <a href="/invitado"  className="text-1xl text-sky-500 leading-tight cursor-pointer">¡Ingresa como invitado!</a>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
