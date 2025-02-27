-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-10-2024 a las 16:12:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `huellas_programa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adopciones`
--

CREATE TABLE `adopciones` (
  `id_adopcion` int(11) NOT NULL,
  `fk_id_mascota` int(11) DEFAULT NULL,
  `fk_id_usuario_adoptante` int(11) NOT NULL,
  `fecha_adopcion_proceso` date DEFAULT NULL,
  `fecha_adopcion_aceptada` date DEFAULT NULL,
  `estado` enum('aceptada','rechazada','proceso de adopcion') DEFAULT NULL,
  `estado_anterior` enum('En Adopcion','Urgente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `adopciones`
--

INSERT INTO `adopciones` (`id_adopcion`, `fk_id_mascota`, `fk_id_usuario_adoptante`, `fecha_adopcion_proceso`, `fecha_adopcion_aceptada`, `estado`, `estado_anterior`) VALUES
(2, 3, 19, '2024-10-05', '2024-10-05', 'aceptada', 'Urgente'),
(3, 2, 17, '2024-10-07', NULL, 'proceso de adopcion', 'En Adopcion'),
(4, 4, 17, '2024-10-08', '2024-10-08', 'aceptada', 'En Adopcion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(50) NOT NULL,
  `estado` enum('activa','inactiva') NOT NULL DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`, `estado`) VALUES
(2, 'perro', 'activa'),
(3, 'gato', 'activa'),
(4, 'conejo', 'activa'),
(5, 'chivo', 'activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(11) NOT NULL,
  `nombre_departamento` varchar(50) NOT NULL,
  `codigo_dane` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id_departamento`, `nombre_departamento`, `codigo_dane`) VALUES
(4, 'Antioquia', '05001'),
(5, 'Boyaca', '15001'),
(6, 'Caldas', '12345'),
(7, 'cundinamarca', '32345'),
(8, 'huila', '43231');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id_imagen` int(11) NOT NULL,
  `fk_id_mascota` int(11) NOT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes`
--

INSERT INTO `imagenes` (`id_imagen`, `fk_id_mascota`, `ruta_imagen`, `fecha_registro`) VALUES
(2, 2, 'imagenes-1728090459614-517461891.jpg', '2024-10-05 01:07:39'),
(3, 2, 'imagenes-1728090459614-369811245.jpg', '2024-10-05 01:07:39'),
(4, 3, 'imagenes-1728097715996-802683672.jpg', '2024-10-05 03:08:36'),
(5, 3, 'imagenes-1728097715998-755799346.jpg', '2024-10-05 03:08:36'),
(6, 3, 'imagenes-1728097716000-815901771.jpg', '2024-10-05 03:08:36'),
(7, 3, 'imagenes-1728097715998-57417632.jpg', '2024-10-05 03:08:36'),
(8, 4, 'imagenes-1728110525604-18815204.jpg', '2024-10-05 06:42:05'),
(9, 4, 'imagenes-1728110525606-54849439.jpg', '2024-10-05 06:42:05'),
(10, 5, 'imagenes-1728420029537-961268792.jpg', '2024-10-08 20:40:29'),
(11, 5, 'imagenes-1728420029536-285753230.jpg', '2024-10-08 20:40:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

CREATE TABLE `mascotas` (
  `id_mascota` int(11) NOT NULL,
  `nombre_mascota` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `estado` enum('En Adopcion','Urgente','Adoptado','Reservado') NOT NULL DEFAULT 'En Adopcion',
  `descripcion` varchar(300) DEFAULT NULL,
  `esterilizado` enum('si','no') NOT NULL,
  `tamano` enum('Pequeno','Mediano','Intermedio','Grande') NOT NULL,
  `peso` decimal(5,2) NOT NULL,
  `fk_id_categoria` int(11) DEFAULT NULL,
  `fk_id_raza` int(11) DEFAULT NULL,
  `fk_id_departamento` int(11) DEFAULT NULL,
  `fk_id_municipio` int(11) DEFAULT NULL,
  `sexo` enum('Macho','Hembra') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id_mascota`, `nombre_mascota`, `fecha_nacimiento`, `estado`, `descripcion`, `esterilizado`, `tamano`, `peso`, `fk_id_categoria`, `fk_id_raza`, `fk_id_departamento`, `fk_id_municipio`, `sexo`) VALUES
(2, 'pepe', '2023-03-09', 'Reservado', 'es muy imperactivo, cariñozo, delicado con los niños', 'si', 'Grande', 68.00, NULL, 4, NULL, 9, 'Macho'),
(3, 'natacha', '2024-06-19', 'Adoptado', 'cariñosa, obediente, inteligente, linda, aseada, cuida de los niños', 'no', 'Mediano', 50.00, NULL, 3, NULL, 9, 'Hembra'),
(4, 'quiti', '2024-04-09', 'Adoptado', 'tierna, limpia y no es callejera', 'si', 'Pequeno', 20.00, NULL, 5, NULL, 3, 'Hembra'),
(5, 'gemelos ', '2024-10-02', 'En Adopcion', 'otra cosas hay', 'si', 'Intermedio', 60.00, 2, 4, 6, 7, 'Macho');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipios`
--

CREATE TABLE `municipios` (
  `id_municipio` int(11) NOT NULL,
  `nombre_municipio` varchar(50) NOT NULL,
  `codigo_dane` varchar(10) NOT NULL,
  `fk_id_departamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `municipios`
--

INSERT INTO `municipios` (`id_municipio`, `nombre_municipio`, `codigo_dane`, `fk_id_departamento`) VALUES
(2, 'andes', '05034', 4),
(3, 'barbosa', '05079', 4),
(4, 'tunja', '15002', 5),
(5, 'belen', '15087', 5),
(6, 'manizales', '17001', 6),
(7, 'la dorada', '17380', 6),
(8, 'cabrera', '25120', 7),
(9, 'pitalito', '41551', 8),
(10, 'gigante', '41306', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('aceptada','rechazada','proceso de adopcion','pendiente') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificacion`, `id_usuario`, `mensaje`, `leido`, `fecha`, `estado`) VALUES
(4, 17, 'Tu solicitud de cambio de rol fue denegada por el Super Usuario Jose.', 0, '2024-10-05 00:06:32', 'pendiente'),
(6, 19, 'El Super Usuario Jose ha aceptado tu solicitud de cambio de rol. Para continuar con el cambio de rol, debes comunicarte al WhatsApp 3188690317 de Jose para confirmar el cambio.', 0, '2024-10-05 06:49:35', 'pendiente'),
(8, 19, 'Tu solicitud de cambio de rol fue denegada por el Super Usuario kevin fernando.', 0, '2024-10-11 05:19:21', 'pendiente'),
(9, 23, 'El Super Usuario kevin fernando ha aceptado tu solicitud de cambio de rol. Para continuar con el cambio de rol, debes comunicarte al WhatsApp 3142124303 de kevin fernando para confirmar el cambio.', 0, '2024-10-11 05:19:28', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `razas`
--

CREATE TABLE `razas` (
  `id_raza` int(11) NOT NULL,
  `nombre_raza` varchar(50) NOT NULL,
  `fk_id_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `razas`
--

INSERT INTO `razas` (`id_raza`, `nombre_raza`, `fk_id_categoria`) VALUES
(2, 'pitbull', 2),
(3, 'chao chao', 2),
(4, 'pastor aleman', 2),
(5, 'angora', 3),
(6, 'egipcio', 3),
(7, 'siames', 3),
(8, 'mini lop', 4),
(9, 'holandez', 4),
(10, 'boer', 5),
(11, 'damasco', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `tipo_documento` enum('tarjeta','cedula','tarjeta de extranjeria') NOT NULL,
  `documento_identidad` varchar(20) NOT NULL,
  `password` varchar(200) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `rol` enum('superusuario','administrador','usuario') NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `direccion`, `telefono`, `correo`, `tipo_documento`, `documento_identidad`, `password`, `img`, `rol`) VALUES
(1, 'kevin fernando', 'mahecha', 'pitalito', '3142124303', 'mahecha@gmail.com', 'cedula', '1077848366', '$2b$10$m6ok7JSX2JU4LCZNSKyxfeFBv/3YrIp3IO1nwW4rB3LCpxliYvXWO', 'img-1728086267356-294040990.jpg', 'superusuario'),
(17, 'kevin fernando', 'andrade mahecha', 'calle 1b #20-70', '3142124302', 'andrade@gmail.com', 'cedula', '1083864350', '$2b$10$qpbzPM6IGJaTxIFNjeRSf.2To0Rz148UEWhObqAod8bEAJo1eK2ei', 'img-1728624264432-315823060.jpg', 'usuario'),
(18, 'kevin', 'andrade', 'calle 23 barrio sur', '1234456634', 'kevin@gmail.com', 'cedula', '12345678', '$2b$10$u67mpyyubrD7Y/GcLCplh.y12/p9XF99GTto/LbxYIJ50rlpA5/s2', 'img-1728086130235-228447344.jpg', 'administrador'),
(19, 'julian', 'valdez', 'bruselas', '1234213242', 'julian@gmail.com', 'cedula', '123232453', '$2b$10$9HJzuxtDSDJNHqQZy5ggZuDDevxIwVkVjtcbYIsGakeXpLnWJWN3u', NULL, 'usuario'),
(20, 'kevin mamalon', 'epicardo', 'que te importa', '3122344321', 'melo@gmail.com', '', '1083864351', '$2b$10$DN.WyyP8IjnSsf/aJGKwt.s2IM9oErkeMBFeXwlMaWqF9y9WuTmcG', NULL, 'usuario'),
(23, 'cacaito', 'betancour cocoma', 'san francisco', '3123131231', 'cacaito@gmail.com', 'cedula', '1031161875', '$2b$10$E23RJcyTmlVx61fuUSm9u.fXm/DEDN3Hg/xiZRuOY.TVcutwb6h76', 'img-1728623501382-281081079.jpg', 'usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacunas`
--

CREATE TABLE `vacunas` (
  `id_vacuna` int(11) NOT NULL,
  `fk_id_mascota` int(11) DEFAULT NULL,
  `fecha_vacuna` date NOT NULL,
  `enfermedad` varchar(100) NOT NULL,
  `estado` enum('Completa','Incompleta','En proceso','no se') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vacunas`
--

INSERT INTO `vacunas` (`id_vacuna`, `fk_id_mascota`, `fecha_vacuna`, `enfermedad`, `estado`) VALUES
(1, 3, '2024-10-01', 'pardo rojo', 'Completa'),
(2, 2, '2024-08-06', 'pardo rojo', 'Completa'),
(3, 3, '2024-06-11', 'moquillo', 'En proceso');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD PRIMARY KEY (`id_adopcion`),
  ADD KEY `fk_id_mascota` (`fk_id_mascota`),
  ADD KEY `fk_id_usuario_adoptante` (`fk_id_usuario_adoptante`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`),
  ADD UNIQUE KEY `codigo_dane` (`codigo_dane`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `fk_id_mascota` (`fk_id_mascota`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id_mascota`),
  ADD KEY `fk_id_categoria` (`fk_id_categoria`),
  ADD KEY `fk_id_raza` (`fk_id_raza`),
  ADD KEY `fk_id_departamento` (`fk_id_departamento`),
  ADD KEY `fk_id_municipio` (`fk_id_municipio`);

--
-- Indices de la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD PRIMARY KEY (`id_municipio`),
  ADD UNIQUE KEY `codigo_dane` (`codigo_dane`),
  ADD KEY `fk_id_departamento` (`fk_id_departamento`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `correo` (`correo`);

--
-- Indices de la tabla `razas`
--
ALTER TABLE `razas`
  ADD PRIMARY KEY (`id_raza`),
  ADD KEY `fk_id_categoria` (`fk_id_categoria`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD UNIQUE KEY `documento_identidad` (`documento_identidad`);

--
-- Indices de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD PRIMARY KEY (`id_vacuna`),
  ADD KEY `fk_id_mascota` (`fk_id_mascota`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  MODIFY `id_adopcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `municipios`
--
ALTER TABLE `municipios`
  MODIFY `id_municipio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `razas`
--
ALTER TABLE `razas`
  MODIFY `id_raza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  MODIFY `id_vacuna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD CONSTRAINT `adopciones_ibfk_1` FOREIGN KEY (`fk_id_mascota`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE,
  ADD CONSTRAINT `adopciones_ibfk_2` FOREIGN KEY (`fk_id_usuario_adoptante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`fk_id_mascota`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`fk_id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE,
  ADD CONSTRAINT `mascotas_ibfk_2` FOREIGN KEY (`fk_id_raza`) REFERENCES `razas` (`id_raza`) ON DELETE CASCADE,
  ADD CONSTRAINT `mascotas_ibfk_3` FOREIGN KEY (`fk_id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE CASCADE,
  ADD CONSTRAINT `mascotas_ibfk_4` FOREIGN KEY (`fk_id_municipio`) REFERENCES `municipios` (`id_municipio`) ON DELETE CASCADE;

--
-- Filtros para la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD CONSTRAINT `municipios_ibfk_1` FOREIGN KEY (`fk_id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`correo`) REFERENCES `usuarios` (`correo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `razas`
--
ALTER TABLE `razas`
  ADD CONSTRAINT `razas_ibfk_1` FOREIGN KEY (`fk_id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD CONSTRAINT `vacunas_ibfk_1` FOREIGN KEY (`fk_id_mascota`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
