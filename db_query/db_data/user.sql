-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2025 at 11:58 AM
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
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `teacher_id`, `username`, `email`, `password`, `role`) VALUES
(1, 'ddd22', 'Teacher Tecjj', 'tee@gmail.com', '$2y$10$/9ekcmDHiiuLoRZew8fDueholUAeu8eQULD2UIdZ9ZAXxwpCAYiH2', 'teacher'),
(2, '12222', 'Teacher Lng AKo 123', '122@gmail.com', '$2y$10$lVuYKKlZsGv5FYHpLwSTc.wZzeQ04wqD0JgcdK8VHlIjKCdOuJ2yy', 'teacher'),
(3, '1222', 'Test User Form', 'Teacher@gmail.com', '$2y$10$YRzwR6pALsbmpKDQ/gImKeFo5IqAy726SdaVvmpvUZNyOqG5aIK/e', 'teacher'),
(4, '1222', 'Tech Tech', 'tech@gmail.com', '$2y$10$gD7.4erPB2CBh/.a5mvVlObouQpCLU0OeWw0TkHzp43AjANfTmd/i', 'teacher'),
(5, '12222', 'Basta Teacher', 'teacher22@gmail.com', '$2y$10$xOq7R5YiCK/SUj4oiwm6xeUe34G6OalqVR.tSgjvpsnOIjL9fBzf.', 'teacher'),
(6, '12', 'Tech Console', '12@gmail.org', '$2y$10$nQ3pCEyac5NcjE3VELNhG.Q8hHGuPqAXD5EwEe4dnbgrbk03llT72', 'teacher'),
(7, '4444', 'usertech', 'user@gmail.com', '$2y$10$P2INFZmt6E1cnDJrrHX6kOWgLVjJdrGW0.Hdqux6VkLrgvKVSHKZW', 'teacher'),
(8, '11111', 'userTeacher123', 'yec@gmail.com', '$2y$10$P2INFZmt6E1cnDJrrHX6kOWgLVjJdrGW0.Hdqux6VkLrgvKVSHKZW', 'teacher'),
(9, '1', 'Tech db', 'db@gmail.com', '$2y$10$b3NHDYtk6TXR75qzJo54HO4FWTIsdP3MejY0IhO6dMu6ouIx2kOUK', 'teacher'),
(10, '1', 'tech99', 'tech1@gmail.com', '$2y$10$P2INFZmt6E1cnDJrrHX6kOWgLVjJdrGW0.Hdqux6VkLrgvKVSHKZW', 'teacher');
COMMIT;

INSERT INTO `user` (`teacher_id`, `username`, `email`, `password`, `role`) VALUES
('10101', 'Teacher Emily', 'emily@gmail.com', '$2y$10$A6h6Qntp.wF22M7zk1Xj7L47XeorOIJ51RiOGVdFY1esZV5AKf46u', 'teacher'),
('20202', 'Teacher Luke', 'luke@gmail.com', '$2y$10$J2pDNYB88vD9beEZSkFUbOMdXZKb0jCEvslm4I80WVZ2qOYNRe/e2', 'teacher'),
('30303', 'Teacher Grace', 'grace@gmail.com', '$2y$10$QhLMzvBtbj11nUy1Yy/.N4tzZ21jQg3yXY5R7ft8s12YVeblBp3dS', 'teacher'),
('40404', 'Teacher Mark', 'mark@gmail.com', '$2y$10$8jDVs9ZzMzH9Dz9wChOr6AAV7JWpuaP2CevRI2Qm3VZsFPxyV0mbK', 'teacher'),
('50505', 'Teacher Lily', 'lily@gmail.com', '$2y$10$Gq5QcClTM4oHb6lDgseKfaGy3HKjR78IX3GiL0Qd8dw4i1nO8bE6y', 'teacher'),
('60606', 'Teacher Alice', 'alice@gmail.com', '$2y$10$CKnAkaFPOzyqXZ9dlduI2SZn3eyuV79hFkKmwhk1BdrWz9jgl0f6i', 'teacher'),
('70707', 'Teacher Harry', 'harry@gmail.com', '$2y$10$E12Lg42NjCzmjXOD2xk4PvZ2YliFJ7z8ZZmPbhZyvvMTNvcA2UaxO', 'teacher'),
('80808', 'Teacher Ava', 'ava@gmail.com', '$2y$10$HzJh7f4D60pARUP19t5j3hTsmgJikTS9R3c8DoMMpZ2jq1k3zPjeq', 'teacher'),
('90909', 'Teacher Noah', 'noah@gmail.com', '$2y$10$RDE9QpddCk.aCVLh6fTz6Hg6fHp5Wz16Viw2Dh8QJlh1jv6L0XOVy', 'teacher'),
('10001', 'Teacher Sophia', 'sophia@gmail.com', '$2y$10$VqBnxTh5DpFbnfyeOPJ98Wpk88XIz6g.g5IF28lj5pMUn2Nf8/xkW', 'teacher');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
