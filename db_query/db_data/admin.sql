-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2025 at 11:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `roomfinder_db`
--

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'I am Admin', 'sampleadd@gmail.com', '$2y$10$AOsVOT.DBXKf03SadZlpX.aQfbvhDOmH67vI2S/0y7epWKANJp5.2', 'admin'),
(2, 'Mr. Bert', 'bert@gmail.com', '$2y$10$x1qioOaIqttG.cIGdzexvu61ncxz.7MAOg0pMzaUzsCcVoFSUTZxK', 'admin'),
(3, 'Mr. Agape', '12@gmail.com', '$2y$10$xz8xOuppf00IPak2vfBwS.GCobfZTIPuclM9yWtGbaPnsogY7sT/G', 'admin'),
(4, 'Admin Angel CSS Master', 'admin@gmail.com', '$2y$10$jOcGqACv4jGIbjYwFTMuq.cwDmT6uu0BlA/3QJCh.wxXLuKRqKxVy', 'admin'),
(5, 'Admin Ruff', 'ruff@gmail.com', '$2y$10$3dNxlR/IshupbU9PvTM4VeEwjORpsOEHRGGAbP9Fadp7BNb1J/QQy', 'admin'),
(6, 'Admin Glenn', 'adminqq@gmail.com', '$2y$10$vW5CstW.u1TclsAsX.Iv3OhbrcxGTxK1uZQjTpYkFiTmm3O6tYrdq', 'admin'),
(7, 'Admin Antonio', 'antonio@gmail.com', '$2y$10$BxswtfkYxVrlwBrHeAxbN.MVdP1mLsmZW4UnSt8lW7pE0jHaKPtxG', 'admin'),
(8, 'Admin Angelo Blockchain Master', 'admin11@gmail.com', '$2y$10$eX82aPwwnW77X9hDIh.To.KVAHeE.TqUzpfbrgTPqp7Qr09sxvvLS', 'admin'),
(9, 'Admin Figma Boi', 'figma@gmail.com', '$2y$10$809gS3OcOl0TcLM/g4rKE.slDyWGbFXXV3hc6Yg1Jpy17B4wD9bYm', 'admin'),
(10, 'Admin SQL', 'sql@gmail.com', '$2y$10$KCT1Da.MXtPQcIpz/Hk6YuxRnCrPNrIY7pNA17Mm3H8aT6h4pMO4C', 'admin'),
(11, 'Staff Antonio', 'staff1@gmail.com', '$2y$10$YGMkFWWpUH8RMmFWVWIvm.BmbfgeX8FYNA9cKnyt.lAY6W5byT/Oi', 'staff'),
(12, 'Staff Bernabe', 'staff11@gmail.com', '$2y$10$jhPgOhvML3X7ALjVtdvtN.TLiZenG13tZI5SrplgXFyYhHgi2r1Nq', 'admin'),
(13, 'Staff MIchael', '1212@gmail.com', '$2y$10$.TZGRQ3rNwzjI0DfgfyV8.lWz0FaXa8xyI2pQbmjXLDynp88D9pXO', 'admin'),
(14, 'Staff', 'sandda@gmail.com', '$2y$10$poTOFck4vpvNWhO2UE8UCes3cPxPVENbHu8PFP0Gp0B3Xjw1UN/RK', 'staff'),
(15, 'Staff Arg', 'arg@gmail.com', '$2y$10$8k.MVWG8sa8mSpT9YqB6EOmcdbIyUtpmiNbx.5Nvk3v15zZRhabwq', 'admin'),
(16, 'New STaff', 'st@gmail.com', '$2y$10$CP0Gs8PuX2vRFraGACNi0OSP8rNSOHcqoaTlHlHRsJ9SUH9dGAZA6', 'staff'),
(17, 'STa STa', 'sta@gmail.com', '$2y$10$FlCPVAnvehGm2t4vH665HeaI5IU.stl0RXny0ThP0xPALgy1sg8gy', 'staff'),
(18, 'Stafff Lang ako', 'sana@gmail.com', '$2y$10$q.LeLqXuyAHXnfvvGOmuguQSbZRgfPBc2g4TdMUFR9ERQca7htA7K', 'admin');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
