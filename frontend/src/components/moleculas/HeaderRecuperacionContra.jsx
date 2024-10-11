import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Asegúrate de instalar react-icons si no lo tienes: npm install react-icons

const HeaderRecuperacionContra = (props) => {
    return (
        <div className="bg-[black] w-full h-20 flex justify-between shadow-3xl shadow-gray-900 border-b-2 border-gray-300">
            {/* Icono de volver */}
                <Link to="/iniciosesion" className="flex items-center pl-4">
                    <FaArrowLeft className="text-white text-2xl" />
                    <span className="text-white ml-3">Volver al inicio</span>
                </Link>

                <h2 className="text-white text-2xl font-bold flex items-center">
                    {props.title}
                </h2>
        </div>
    );
}

export default HeaderRecuperacionContra;
