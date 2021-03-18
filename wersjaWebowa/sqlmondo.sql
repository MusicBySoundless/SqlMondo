-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 18, 2021 at 12:38 PM
-- Server version: 10.1.48-MariaDB-0+deb9u1
-- PHP Version: 7.0.33-0+deb9u10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sqlmondo`
--

-- --------------------------------------------------------

--
-- Table structure for table `Klasy`
--

CREATE TABLE `Klasy` (
  `id_klasy` int(11) NOT NULL,
  `nazwa` varchar(25) NOT NULL,
  `id_nauczyciela_zew` int(11) NOT NULL,
  `kod_klasy` char(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Nauczyciele`
--

CREATE TABLE `Nauczyciele` (
  `id_nauczyciela` int(11) NOT NULL,
  `imie` varchar(50) NOT NULL,
  `nazwisko` varchar(50) NOT NULL,
  `login` varchar(25) NOT NULL,
  `haslo` char(64) NOT NULL,
  `salt` char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Uczniowie`
--

CREATE TABLE `Uczniowie` (
  `id_ucznia` int(11) NOT NULL,
  `imie` varchar(50) NOT NULL,
  `nazwisko` varchar(50) NOT NULL,
  `id_klasy` int(11) DEFAULT NULL,
  `login` varchar(25) NOT NULL,
  `userID` text NOT NULL,
  `haslo` char(64) NOT NULL,
  `salt` char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ZapomnianeHaslo`
--

CREATE TABLE `ZapomnianeHaslo` (
  `id_wpisu` int(11) NOT NULL,
  `typ` varchar(11) NOT NULL,
  `id_typ` int(11) NOT NULL,
  `waznosc` datetime NOT NULL,
  `url` char(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Klasy`
--
ALTER TABLE `Klasy`
  ADD PRIMARY KEY (`id_klasy`),
  ADD UNIQUE KEY `kod_klasy` (`kod_klasy`),
  ADD KEY `nauczyciele_do_klasy` (`id_nauczyciela_zew`);

--
-- Indexes for table `Nauczyciele`
--
ALTER TABLE `Nauczyciele`
  ADD PRIMARY KEY (`id_nauczyciela`),
  ADD UNIQUE KEY `login` (`login`);

--
-- Indexes for table `Uczniowie`
--
ALTER TABLE `Uczniowie`
  ADD PRIMARY KEY (`id_ucznia`),
  ADD UNIQUE KEY `login` (`login`),
  ADD KEY `klasa_do_ucznia` (`id_klasy`);

--
-- Indexes for table `ZapomnianeHaslo`
--
ALTER TABLE `ZapomnianeHaslo`
  ADD PRIMARY KEY (`id_wpisu`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Klasy`
--
ALTER TABLE `Klasy`
  MODIFY `id_klasy` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Nauczyciele`
--
ALTER TABLE `Nauczyciele`
  MODIFY `id_nauczyciela` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Uczniowie`
--
ALTER TABLE `Uczniowie`
  MODIFY `id_ucznia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ZapomnianeHaslo`
--
ALTER TABLE `ZapomnianeHaslo`
  MODIFY `id_wpisu` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Klasy`
--
ALTER TABLE `Klasy`
  ADD CONSTRAINT `nauczyciele_do_klasy` FOREIGN KEY (`id_nauczyciela_zew`) REFERENCES `Nauczyciele` (`id_nauczyciela`);

--
-- Constraints for table `Uczniowie`
--
ALTER TABLE `Uczniowie`
  ADD CONSTRAINT `klasa_do_ucznia` FOREIGN KEY (`id_klasy`) REFERENCES `Klasy` (`id_klasy`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
