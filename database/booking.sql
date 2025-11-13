-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: booking
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `TRIP_ID` int NOT NULL,
  `AMOUNT` decimal(10,2) DEFAULT NULL,
  `STATUS` varchar(20) DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `USER_ID` (`USER_ID`),
  KEY `TRIP_ID` (`TRIP_ID`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`TRIP_ID`) REFERENCES `trips` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,1,2,1284.00,'PENDING','2025-11-11 14:06:48'),(2,1,2,1284.00,'PENDING','2025-11-11 14:19:35'),(3,1,2,1284.00,'PENDING','2025-11-11 14:26:39'),(4,1,2,1284.00,'PENDING','2025-11-11 15:44:09'),(5,1,2,1284.00,'PENDING','2025-11-11 15:45:05'),(6,1,2,1284.00,'PENDING','2025-11-11 15:50:17'),(7,1,2,1284.00,'PENDING','2025-11-11 15:56:45'),(8,1,16,167.00,'PENDING','2025-11-11 16:23:32'),(9,1,16,167.00,'PENDING','2025-11-11 16:29:35'),(10,1,16,167.00,'PENDING','2025-11-11 16:37:43'),(11,1,2,1284.00,'PENDING','2025-11-11 16:40:16'),(12,1,16,167.00,'PENDING','2025-11-12 12:01:15'),(13,1,16,167.00,'PENDING','2025-11-12 12:05:47'),(14,1,16,167.00,'PENDING','2025-11-12 12:06:42'),(15,1,16,167.00,'PENDING','2025-11-12 12:07:06'),(16,1,16,167.00,'PENDING','2025-11-12 12:15:22'),(17,1,16,167.00,'PENDING','2025-11-12 12:37:19'),(18,1,16,167.00,'PENDING','2025-11-12 12:44:25'),(19,1,16,167.00,'PENDING','2025-11-12 12:52:20'),(20,1,16,167.00,'PENDING','2025-11-12 12:55:49'),(21,1,16,167.00,'PENDING','2025-11-12 13:02:25'),(22,1,16,167.00,'SUCCESSFUL','2025-11-12 13:09:29'),(23,1,2,1284.00,'PENDING','2025-11-12 13:24:52'),(24,1,2,1284.00,'PENDING','2025-11-12 13:44:10'),(25,1,16,167.00,'PENDING','2025-11-12 13:46:21'),(26,1,16,167.00,'SUCCESSFUL','2025-11-12 13:52:53'),(27,1,16,167.00,'SUCCESSFUL','2025-11-12 13:58:09'),(28,1,16,167.00,'SUCCESSFUL','2025-11-12 14:13:06'),(29,1,16,167.00,'SUCCESSFUL','2025-11-12 14:14:24'),(30,16,2,1284.00,'CANCELLED','2025-11-12 14:20:37'),(31,16,16,167.00,'CANCELLED','2025-11-12 15:12:11'),(32,16,17,1982.00,'SUCCESSFUL','2025-11-12 15:20:37'),(33,15,17,1982.00,'SUCCESSFUL','2025-11-12 15:51:34'),(34,15,18,754.00,'CANCELLED','2025-11-12 16:00:06'),(35,16,16,167.00,'PENDING','2025-11-13 04:09:20'),(36,16,32,1284.00,'PENDING','2025-11-13 04:12:51'),(37,16,32,500.00,'CANCELLED','2025-11-13 04:16:15'),(38,16,36,100.00,'CANCELLED','2025-11-13 04:57:38'),(39,17,16,160.00,'SUCCESSFUL','2025-11-13 05:06:48');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_seats`
--

DROP TABLE IF EXISTS `booking_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_seats` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `BOOKING_ID` int NOT NULL,
  `SEAT_NO` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `BOOKING_ID` (`BOOKING_ID`),
  CONSTRAINT `booking_seats_ibfk_1` FOREIGN KEY (`BOOKING_ID`) REFERENCES `booking` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_seats`
--

LOCK TABLES `booking_seats` WRITE;
/*!40000 ALTER TABLE `booking_seats` DISABLE KEYS */;
INSERT INTO `booking_seats` VALUES (1,28,28),(2,29,44),(3,30,18),(4,31,45),(5,32,31),(6,33,36),(7,34,32),(8,35,41),(9,36,39),(10,37,36),(11,38,12),(12,39,11),(13,39,12);
/*!40000 ALTER TABLE `booking_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL,
  `OPERATOR_ID` int NOT NULL,
  `TOTAL_SEAT` int NOT NULL,
  `LAYOUT` json DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `OPERATOR_ID` (`OPERATOR_ID`),
  CONSTRAINT `buses_ibfk_1` FOREIGN KEY (`OPERATOR_ID`) REFERENCES `users` (`ID`),
  CONSTRAINT `buses_chk_1` CHECK ((`TOTAL_SEAT` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,'Gujarat Express',1,45,'{\"rows\": 10, \"seatsPerRow\": 4, \"lastRowSeats\": 5}'),(2,'Saurashtra Travels',1,40,'{\"rows\": 10, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(3,'Patel Tours & Travels',1,50,'{\"rows\": 11, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(4,'Rajkot Rapid',1,44,'{\"rows\": 9, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(5,'Ahmedabad Expressline',1,48,'{\"rows\": 10, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(6,'Surat Silverline',1,42,'{\"rows\": 9, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(7,'Vadodara Royal',1,46,'{\"rows\": 10, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(8,'Bhavnagar Comfort',1,40,'{\"rows\": 10, \"hasLastRow5\": false, \"seatsPerRow\": 4}'),(9,'Dwarka Yatra',1,50,'{\"rows\": 11, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(10,'Jamnagar Jetline',1,45,'{\"rows\": 10, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(11,'Junagadh Deluxe',1,42,'{\"rows\": 9, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(12,'Gir Lion Travels',1,44,'{\"rows\": 10, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(13,'Somnath Express',1,47,'{\"rows\": 10, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(14,'Mehsana Comfortline',1,43,'{\"rows\": 9, \"hasLastRow5\": true, \"seatsPerRow\": 4}'),(15,'Anand FastTrack',1,45,'{\"rows\": 10, \"hasLastRow5\": true, \"seatsPerRow\": 4}');
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `BOOKING_ID` int NOT NULL,
  `PROVIDER` varchar(50) NOT NULL,
  `PROVIDER_PAYMENT_ID` varchar(100) NOT NULL,
  `STATUS` enum('PENDING','SUCCESSFUL','FAILED') NOT NULL DEFAULT 'PENDING',
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `BOOKING_ID` (`BOOKING_ID`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`BOOKING_ID`) REFERENCES `booking` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (4,16,'UPI','TXN_1762950601998','PENDING','2025-11-12 12:30:02'),(5,17,'UPI','TXN_1762951051904','PENDING','2025-11-12 12:37:31'),(6,18,'UPI','TXN_1762951472738','PENDING','2025-11-12 12:44:32'),(7,19,'UPI','TXN_1762951951462','PENDING','2025-11-12 12:52:31'),(8,20,'UPI','TXN_1762952153941','PENDING','2025-11-12 12:55:53'),(9,21,'UPI','TXN_1762952551912','PENDING','2025-11-12 13:02:31'),(10,22,'UPI','TXN_1762952975768','PENDING','2025-11-12 13:09:35'),(11,23,'UPI','TXN_1762954793267','SUCCESSFUL','2025-11-12 13:39:53'),(12,24,'UPI','TXN_1762955056032','SUCCESSFUL','2025-11-12 13:44:16'),(13,25,'UPI','TXN_1762955186294','SUCCESSFUL','2025-11-12 13:46:26'),(14,25,'UPI','TXN_1762955291506','SUCCESSFUL','2025-11-12 13:48:11'),(15,26,'UPI','TXN_1762955579192','SUCCESSFUL','2025-11-12 13:52:59'),(16,26,'UPI','TXN_1762955596257','SUCCESSFUL','2025-11-12 13:53:16'),(17,26,'UPI','TXN_1762955867979','SUCCESSFUL','2025-11-12 13:57:48'),(18,27,'UPI','TXN_1762955894311','SUCCESSFUL','2025-11-12 13:58:14'),(19,28,'UPI','TXN_1762956790951','SUCCESSFUL','2025-11-12 14:13:10'),(20,28,'UPI','TXN_1762956803416','SUCCESSFUL','2025-11-12 14:13:23'),(21,29,'UPI','TXN_1762956869549','SUCCESSFUL','2025-11-12 14:14:29'),(22,30,'UPI','TXN_1762957245283','SUCCESSFUL','2025-11-12 14:20:45'),(23,31,'UPI','TXN_1762960336394','SUCCESSFUL','2025-11-12 15:12:16'),(24,32,'UPI','TXN_1762960842052','SUCCESSFUL','2025-11-12 15:20:42'),(25,33,'UPI','TXN_1762962699950','SUCCESSFUL','2025-11-12 15:51:39'),(26,34,'UPI','TXN_1762963213894','SUCCESSFUL','2025-11-12 16:00:13'),(27,37,'UPI','TXN_1763007384239','SUCCESSFUL','2025-11-13 04:16:24'),(28,38,'UPI','TXN_1763009870039','SUCCESSFUL','2025-11-13 04:57:50'),(29,39,'UPI','TXN_1763010444762','SUCCESSFUL','2025-11-13 05:07:24');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `From` varchar(100) NOT NULL,
  `TO` varchar(100) NOT NULL,
  `DISTANCE_KM` decimal(8,2) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `routes_chk_1` CHECK ((`DISTANCE_KM` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,'Ahmedabad','Surat',265.50),(2,'Ahmedabad','Vadodara',111.30),(3,'Ahmedabad','Rajkot',214.00),(4,'Ahmedabad','Bhavnagar',169.80),(5,'Ahmedabad','Dwarka',441.60),(6,'Rajkot','Dwarka',225.30),(7,'Surat','Vadodara',150.70),(8,'Surat','Rajkot',348.40),(9,'Vadodara','Bhavnagar',175.20),(10,'Jamnagar','Dwarka',131.50),(11,'Junagadh','Somnath',82.00),(12,'Ahmedabad','Anand',76.50),(13,'Mehsana','Ahmedabad',75.80),(14,'Surat','Navsari',30.40),(15,'Rajkot','Junagadh',103.20),(16,'Ahmedabad','Gandhinagar',27.80),(17,'Ahmedabad','Bhuj',330.40),(18,'Ahmedabad','Patan',125.60),(19,'Ahmedabad','Nadiad',60.20),(20,'Surat','Valsad',90.40),(21,'Surat','Bharuch',67.30),(22,'Vadodara','Dahod',147.50),(23,'Rajkot','Porbandar',182.60),(24,'Bhavnagar','Amreli',115.70),(25,'Junagadh','Rajkot',103.20),(26,'Jamnagar','Morbi',97.40),(27,'Dwarka','Porbandar',104.50),(28,'Anand','Nadiad',24.60),(29,'Mehsana','Palanpur',69.80),(30,'Ahmedabad','Palitana',215.50);
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `TRIP_ID` int NOT NULL,
  `SEAT_NUMBER` varchar(10) NOT NULL,
  `STATUS` varchar(20) DEFAULT NULL,
  `BOOKING_ID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `TRIP_ID` (`TRIP_ID`),
  KEY `BOOKING_ID` (`BOOKING_ID`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`TRIP_ID`) REFERENCES `trips` (`ID`),
  CONSTRAINT `seats_ibfk_2` FOREIGN KEY (`BOOKING_ID`) REFERENCES `booking` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,2,'37','BOOKED',1),(2,2,'34','BOOKED',2),(3,2,'35','BOOKED',3),(4,2,'19','BOOKED',4),(5,2,'36','BOOKED',5),(6,2,'29','BOOKED',6),(7,2,'12','BOOKED',7),(8,16,'40','BOOKED',8),(9,16,'29','BOOKED',9),(10,16,'42','BOOKED',10),(11,2,'44','BOOKED',11),(12,16,'24','BOOKED',12),(13,16,'31','BOOKED',13),(14,16,'25','BOOKED',14),(15,16,'37','BOOKED',15),(16,16,'36','BOOKED',16),(17,16,'22','BOOKED',17),(18,16,'8','BOOKED',18),(19,16,'17','BOOKED',19),(20,16,'16','BOOKED',20),(21,16,'6','BOOKED',21),(22,16,'19','BOOKED',22),(23,2,'21','BOOKED',23),(24,2,'28','BOOKED',24),(25,16,'32','BOOKED',25),(26,16,'18','BOOKED',26),(27,16,'20','BOOKED',27),(28,16,'28','BOOKED',28),(29,16,'44','BOOKED',29),(30,2,'18','AVAILABLE',NULL),(31,16,'45','BOOKED',31),(32,17,'31','BOOKED',32),(33,17,'36','BOOKED',33),(34,18,'32','BOOKED',34),(35,16,'41','BOOKED',35),(36,32,'39','BOOKED',36),(37,32,'36','AVAILABLE',NULL),(38,36,'12','AVAILABLE',NULL),(39,16,'11','BOOKED',39),(40,16,'12','BOOKED',39);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `BUS_ID` int NOT NULL,
  `ROUTE_ID` int NOT NULL,
  `DEPARTURE_TS` datetime NOT NULL,
  `ARRIVAL_TS` datetime NOT NULL,
  `PRICE` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `BUS_ID` (`BUS_ID`),
  KEY `ROUTE_ID` (`ROUTE_ID`),
  CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`BUS_ID`) REFERENCES `buses` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`ROUTE_ID`) REFERENCES `routes` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (1,1,1,'2025-11-12 06:30:00','2025-11-12 11:30:00',NULL),(2,2,3,'2025-11-12 07:00:00','2025-11-12 11:00:00',520.00),(3,3,2,'2025-11-12 08:00:00','2025-11-12 10:30:00',NULL),(4,4,4,'2025-11-12 09:00:00','2025-11-12 12:30:00',NULL),(5,5,5,'2025-11-12 06:00:00','2025-11-12 13:30:00',NULL),(6,6,6,'2025-11-12 07:45:00','2025-11-12 11:45:00',NULL),(7,7,7,'2025-11-12 09:30:00','2025-11-12 12:30:00',NULL),(8,8,8,'2025-11-12 10:15:00','2025-11-12 16:15:00',NULL),(9,9,9,'2025-11-12 11:00:00','2025-11-12 14:30:00',NULL),(10,10,10,'2025-11-12 05:30:00','2025-11-12 08:15:00',NULL),(11,11,11,'2025-11-12 06:00:00','2025-11-12 07:45:00',NULL),(12,12,12,'2025-11-12 07:15:00','2025-11-12 09:00:00',NULL),(13,13,13,'2025-11-12 08:00:00','2025-11-12 09:45:00',NULL),(14,14,14,'2025-11-12 09:00:00','2025-11-12 09:45:00',NULL),(15,15,15,'2025-11-12 10:00:00','2025-11-12 12:30:00',NULL),(16,1,16,'2025-11-13 07:00:00','2025-11-13 07:45:00',80.00),(17,2,17,'2025-11-13 05:30:00','2025-11-13 11:00:00',NULL),(18,3,18,'2025-11-13 06:30:00','2025-11-13 09:30:00',NULL),(19,4,19,'2025-11-13 07:45:00','2025-11-13 09:00:00',NULL),(20,5,20,'2025-11-13 08:30:00','2025-11-13 10:00:00',NULL),(21,6,21,'2025-11-13 09:15:00','2025-11-13 10:45:00',NULL),(22,7,22,'2025-11-13 06:00:00','2025-11-13 09:15:00',NULL),(23,8,23,'2025-11-13 07:30:00','2025-11-13 10:30:00',NULL),(24,9,24,'2025-11-13 09:00:00','2025-11-13 11:30:00',NULL),(25,10,25,'2025-11-13 06:45:00','2025-11-13 08:45:00',NULL),(26,11,26,'2025-11-13 05:45:00','2025-11-13 07:15:00',NULL),(27,12,27,'2025-11-13 06:30:00','2025-11-13 08:30:00',NULL),(28,13,28,'2025-11-13 07:15:00','2025-11-13 07:45:00',NULL),(29,14,29,'2025-11-13 06:15:00','2025-11-13 07:45:00',NULL),(30,15,30,'2025-11-13 05:30:00','2025-11-13 10:15:00',NULL),(31,5,3,'2025-11-14 06:00:00','2025-11-14 10:00:00',450.00),(32,7,3,'2025-11-14 07:30:00','2025-11-14 11:00:00',500.00),(33,9,3,'2025-11-14 09:00:00','2025-11-14 12:30:00',550.00),(34,12,3,'2025-11-14 11:00:00','2025-11-14 14:30:00',480.00),(35,3,16,'2025-11-14 06:45:00','2025-11-14 07:30:00',90.00),(36,6,16,'2025-11-14 08:00:00','2025-11-14 08:50:00',100.00),(37,10,16,'2025-11-14 09:30:00','2025-11-14 10:15:00',70.00),(38,14,16,'2025-11-14 11:00:00','2025-11-14 11:45:00',85.00),(39,1,1,'2025-11-12 06:30:00','2025-11-12 11:30:00',550.00),(40,2,3,'2025-11-12 07:00:00','2025-11-12 11:00:00',500.00),(41,3,2,'2025-11-12 08:00:00','2025-11-12 10:30:00',300.00),(42,4,4,'2025-11-12 09:00:00','2025-11-12 12:30:00',350.00),(43,5,5,'2025-11-12 06:00:00','2025-11-12 13:30:00',800.00),(44,6,6,'2025-11-12 07:45:00','2025-11-12 11:45:00',400.00),(45,7,7,'2025-11-12 09:30:00','2025-11-12 12:30:00',320.00),(46,8,8,'2025-11-12 10:15:00','2025-11-12 16:15:00',600.00),(47,9,9,'2025-11-12 11:00:00','2025-11-12 14:30:00',300.00),(48,10,10,'2025-11-12 05:30:00','2025-11-12 08:15:00',200.00),(49,11,11,'2025-11-12 06:00:00','2025-11-12 07:45:00',150.00),(50,12,12,'2025-11-12 07:15:00','2025-11-12 09:00:00',120.00),(51,13,13,'2025-11-12 08:00:00','2025-11-12 09:45:00',100.00),(52,14,14,'2025-11-12 09:00:00','2025-11-12 09:45:00',80.00),(53,15,15,'2025-11-12 10:00:00','2025-11-12 12:30:00',250.00),(54,1,16,'2025-11-13 07:00:00','2025-11-13 07:45:00',70.00),(55,2,17,'2025-11-13 05:30:00','2025-11-13 11:00:00',900.00),(56,3,18,'2025-11-13 06:30:00','2025-11-13 09:30:00',300.00),(57,4,19,'2025-11-13 07:45:00','2025-11-13 09:00:00',120.00),(58,5,20,'2025-11-13 08:30:00','2025-11-13 10:00:00',150.00),(59,6,21,'2025-11-13 09:15:00','2025-11-13 10:45:00',160.00),(60,7,22,'2025-11-13 06:00:00','2025-11-13 09:15:00',350.00),(61,8,23,'2025-11-13 07:30:00','2025-11-13 10:30:00',300.00),(62,9,24,'2025-11-13 09:00:00','2025-11-13 11:30:00',220.00),(63,10,25,'2025-11-13 06:45:00','2025-11-13 08:45:00',200.00),(64,11,26,'2025-11-13 05:45:00','2025-11-13 07:15:00',180.00),(65,12,27,'2025-11-13 06:30:00','2025-11-13 08:30:00',260.00),(66,13,28,'2025-11-13 07:15:00','2025-11-13 07:45:00',60.00),(67,14,29,'2025-11-13 06:15:00','2025-11-13 07:45:00',180.00),(68,15,30,'2025-11-13 05:30:00','2025-11-13 10:15:00',500.00);
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(50) NOT NULL,
  `PASSWORD_HASH` varchar(255) NOT NULL,
  `ROLE` enum('USER','ADMIN','OPERATOR') DEFAULT 'USER',
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Bansari','bansari@gmail.com','$2b$10$IhMDFel3VZUjmZV28tMi/.SS1mOXHa6u.2qzzv9Dz2XThhyARkZ7G','ADMIN','2025-11-08 04:50:39'),(2,'Khush','khushpatel2996@gmail.com','$2b$10$rXpOJTvRvd89J29hdSkFyep1gm1.yHyhyFHe0cRvfkRHYcJnnS23W','USER','2025-11-09 06:47:15'),(13,'Admin User','admin@example.com','$2b$10$pWjVsYMmRxZds5JvDwH4oeE62MiMPhhZ3JzTpwuhyn.NH2I5c28AK','USER','2025-11-09 05:29:15'),(15,'priya','priyavala23@gmail.com','$2b$10$Db94iIA51uOW7W8BQm/sdOgAGlMwjFMj7p/yf/fpnLzsOah/eF7hy','USER','2025-11-11 16:06:27'),(16,'bansari der','bansarider611@gmail.com','$2b$10$ZYl4YBUdqYdtTqaIzM.Hx.Z3bNsFhcVRPGtYTTfdkkq6TLOXRNIoa','USER','2025-11-12 12:36:56'),(17,'Dhwanit Patel','dhwanitakoliya10@gmail.com','$2b$10$N6lUIj/axNnjjbPgr26cr.MMOf1yIjD1JX6hl1RJJWh6eiuW2NNde','USER','2025-11-13 05:05:42');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 20:24:13
