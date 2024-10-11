import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { AiOutlineUser, AiOutlineBell, AiOutlinePieChart, AiFillAlert } from "react-icons/ai";
import { FaUsers } from "react-icons/fa6";
import { MdOutlinePets } from "react-icons/md";
import Control from './../../assets/control.png';
import logo from './../../assets/logo.png';

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [sidebar, setSidebar] = useState(false);

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebar(false);
      } else {
        setSidebar(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  const Menus = [
    { title: "Usuarios", link: "/usuarios", icon: FaUsers },
    { title: "Mascotas", link: "/mascotas", icon: MdOutlinePets },
    { title: "Notificaciones", link: "/notificaciones", icon: AiOutlineBell },
    { title: "Gráficas", link: "/graficas", icon: AiOutlinePieChart },
    { title: "Perfil", link: "/perfil", icon: AiOutlineUser },
  ];
  
  const MenusAdmin = [
    { title: "Mascotas", link: "/mascotas", icon: MdOutlinePets },
    { title: "Perfil", link: "/perfil", icon: AiOutlineUser },
  ];
  
  const MenusUser = [
    { title: "Mis Mascotas", link: "/listmascotas", icon: MdOutlinePets },
    { title: "Adopciones", link: "/adopciones", icon: AiFillAlert },
    { title: "Notificaciones", link: "/notificaciones", icon: AiOutlineBell },
    { title: "Perfil", link: "/perfil", icon: AiOutlineUser },
  ];

  const InvitedPets = [
    { title: "Mascotas", link: "/invitado", icon: MdOutlinePets },
  ];

  return (
    <>
      <div className="flex min-h-screen z-20">
        {sidebar ? (
          <div
            className={`${open ? "w-56" : "w-20"} bg-[black] max-h-full p-5 pt-5 h-full fixed duration-300`}
          >
            <img
              src={Control}
              className={`absolute cursor-pointer -right-3 mt-11 w-7 border-dark-purple
                  border-2 rounded-full  ${!open && "rotate-180"}`}
              onClick={() => setOpen(!open)}
            />
            <div className={`flex items-center`}>
              <img
                src={logo}
                className={`cursor-pointer duration-500 h-10 w-10 rounded-full ${open ? "rotate-[360deg] w-20 h-20 rounded-full" : ""}`}
              />
            </div>
            <ul className="pt-6">
              {user?.rol === 'superusuario' && Menus.map((Menu, index) => (
                <Link
                  to={Menu?.link}
                  key={index}
                  onClick={() => setActiveLink(Menu.link)}
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-[#EAEDF6] text-white hover:text-black text-lg font-bold items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-2"} ${activeLink === Menu.link ? "border-2 border-[#EAEDF6]" : ""}`}
                >
                  <div>{React.createElement(Menu?.icon, { size: "20" })}</div>
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {Menu.title}
                  </span>
                </Link>
              ))}
              {user?.rol === 'administrador' && MenusAdmin.map((Menu, index) => (
                <Link
                  to={Menu?.link}
                  key={index}
                  onClick={() => setActiveLink(Menu.link)}
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-[#EAEDF6] text-white hover:text-black text-lg font-bold items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-2"} ${activeLink === Menu.link ? "border-2 border-[#EAEDF6]" : ""}`}
                >
                  <div>{React.createElement(Menu?.icon, { size: "20" })}</div>
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {Menu.title}
                  </span>
                </Link>
              ))}
              {user?.rol === 'usuario' && MenusUser.map((Menu, index) => (
                <Link
                  to={Menu?.link}
                  key={index}
                  onClick={() => setActiveLink(Menu.link)}
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-[#EAEDF6] text-white hover:text-black text-lg font-bold items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-2"} ${activeLink === Menu.link ? "border-2 border-[#EAEDF6]" : ""}`}
                >
                  <div>{React.createElement(Menu?.icon, { size: "20" })}</div>
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {Menu.title}
                  </span>
                </Link>
              ))}
              {!user?.rol && InvitedPets.map((Menu, index) => (
                <Link
                  to={Menu?.link}
                  key={index}
                  onClick={() => setActiveLink(Menu.link)}
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-[#EAEDF6] text-white hover:text-black text-lg font-bold items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-2"} ${activeLink === Menu.link ? "border-2 border-[#EAEDF6]" : ""}`}
                >
                  <div>{React.createElement(Menu?.icon, { size: "20" })}</div>
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {Menu.title}
                  </span>
                </Link>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
};
