-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2024 at 12:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sharingapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `file_access`
--

CREATE TABLE `file_access` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `uploaded_files`
--

CREATE TABLE `uploaded_files` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `fieldname` varchar(255) NOT NULL,
  `originalname` varchar(255) NOT NULL,
  `encoding` varchar(255) NOT NULL,
  `mimetype` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `public_access` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uploaded_files`
--

INSERT INTO `uploaded_files` (`id`, `user_id`, `fieldname`, `originalname`, `encoding`, `mimetype`, `destination`, `filename`, `path`, `size`, `created_at`, `public_access`) VALUES
(9, 5, 'file', 'onion-crying-funny-desktop-sy5nrttasy2qeyzy (1).jpg', '7bit', 'image/jpeg', 'uploads/', 'file-1707086337611-341247070.jpg', 'uploads\\file-1707086337611-341247070.jpg', 6864, '2024-02-04 22:38:57', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `salt`) VALUES
(1, 'Anushtha', 'Pandit', 'kumarsen.bash@gmail.com', NULL, NULL),
(2, 'Ingenral', 'Ingenral', 'ingenral2@gmail.com', NULL, NULL),
(5, 'abc', 'abc', 'abc@mail.com', '$2a$10$8Gz4nizwMYULvzMiCdYOnOWT/./2G2szfL2xhgc/AF48DyGR4OB1m', '$2a$10$8Gz4nizwMYULvzMiCdYOnO'),
(6, 'john', 'john', 'john@mail.com', '$2a$10$iHKVPP4uLzAaeq7rkChTu.BGsz1byDJoew8aQI4abgjfabviwTa0u', '$2a$10$iHKVPP4uLzAaeq7rkChTu.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `file_access`
--
ALTER TABLE `file_access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_file` (`user_id`,`file_id`),
  ADD KEY `file_id` (`file_id`);

--
-- Indexes for table `uploaded_files`
--
ALTER TABLE `uploaded_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `file_access`
--
ALTER TABLE `file_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `uploaded_files`
--
ALTER TABLE `uploaded_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `file_access`
--
ALTER TABLE `file_access`
  ADD CONSTRAINT `file_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `file_access_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `uploaded_files` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `uploaded_files`
--
ALTER TABLE `uploaded_files`
  ADD CONSTRAINT `uploaded_files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
