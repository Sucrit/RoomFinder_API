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
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `room_building`, `room_number`, `status`, `equipment`, `capacity`, `room_type`) VALUES
(1, 'PTC', 210, 'Available', 'TV', 50, 'Lecture'),
(2, 'PTC', 211, 'Available', 'TV', 50, 'Lecture'),
(3, 'PTC', 219, 'Available', 'TV', 50, 'Lecture'),
(4, 'PTC', 218, 'Available', 'TV', 50, 'Lecture'),
(5, 'PTC', 216, 'Available', 'TV', 50, 'Lecture'),
(6, 'PTC', 213, 'Available', 'TV', 50, 'Lecture'),
(7, 'ITS', 211, 'Available', 'TV', 50, 'Lecture'),
(8, 'ITS', 122, 'Available', 'TV', 50, 'Lecture'),
(9, 'ITS', 123, 'Available', 'TV', 50, 'Lecture'),
(10, 'ITS', 124, 'Available', 'TV', 50, 'Lecture'),
(11, 'ITS', 127, 'Available', 'TV', 50, 'Lecture'),
(12, 'ITS', 128, 'Available', 'TV', 50, 'Lecture'),
(13, 'ITS', 129, 'Available', 'TV', 50, 'Lecture'),
(14, 'ITS', 100, 'Available', 'TV', 50, 'Lecture'),
(15, 'PTC', 233, 'Available', 'TV', 50, 'Lecture'),
(16, 'PTC', 400, 'Available', 'TV', 50, 'Lecture'),
(17, 'PTC', 900, 'Available', 'TV', 50, 'Lecture');
(18, 'PTC', 201, 'Available', 'TV', 50, 'Lecture'),
(19, 'PTC', 202, 'Available', 'TV', 50, 'Lecture'),
(20, 'PTC', 203, 'Available', 'TV', 50, 'Lecture'),
(21, 'PTC', 204, 'Available', 'TV', 50, 'Lecture'),
(22, 'PTC', 205, 'Available', 'TV', 50, 'Lecture'),
(23, 'PTC', 206, 'Available', 'TV', 50, 'Lecture'),
(24, 'PTC', 207, 'Available', 'TV', 50, 'Lecture'),
(25, 'PTC', 208, 'Available', 'TV', 50, 'Lecture'),
(26, 'PTC', 209, 'Available', 'TV', 50, 'Lecture'),
(27, 'ITS', 105, 'Available', 'TV', 50, 'Lecture'),
(28, 'ITS', 106, 'Available', 'TV', 50, 'Lecture'),
(29, 'ITS', 107, 'Available', 'TV', 50, 'Lecture'),
(30, 'ITS', 108, 'Available', 'TV', 50, 'Lecture'),
(31, 'ITS', 109, 'Available', 'TV', 50, 'Lecture'),
(32, 'ITS', 110, 'Available', 'TV', 50, 'Lecture'),
(33, 'ITS', 111, 'Available', 'TV', 50, 'Lecture'),
(34, 'ITS', 112, 'Available', 'TV', 50, 'Lecture'),
(35, 'ITS', 113, 'Available', 'TV', 50, 'Lecture'),
(36, 'ITS', 114, 'Available', 'TV', 50, 'Lecture'),
(37, 'ITS', 115, 'Available', 'TV', 50, 'Lecture'),
(38, 'ITS', 116, 'Available', 'TV', 50, 'Lecture'),
(39, 'ITS', 117, 'Available', 'TV', 50, 'Lecture'),
(40, 'ITS', 118, 'Available', 'TV', 50, 'Lecture'),
(41, 'ITS', 119, 'Available', 'TV', 50, 'Lecture'),
(42, 'ITS', 120, 'Available', 'TV', 50, 'Lecture'),
(43, 'ITS', 121, 'Available', 'TV', 50, 'Lecture'),
(44, 'PTC', 220, 'Available', 'TV', 50, 'Lecture'),
(45, 'PTC', 221, 'Available', 'TV', 50, 'Lecture'),
(46, 'PTC', 222, 'Available', 'TV', 50, 'Lecture'),
(47, 'PTC', 223, 'Available', 'TV', 50, 'Lecture'),
(48, 'PTC', 224, 'Available', 'TV', 50, 'Lecture');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
