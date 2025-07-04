-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: dms
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `Appointment_ID` varchar(10) NOT NULL,
  `Appointment_Requester_ID` varchar(8) DEFAULT NULL,
  `Appointment_Approver_ID` varchar(8) DEFAULT NULL,
  `Visit_purpose` varchar(300) DEFAULT NULL,
  `Visit_date` varchar(20) DEFAULT NULL,
  `Visit_time` varchar(20) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `Comments` varchar(450) DEFAULT NULL,
  PRIMARY KEY (`Appointment_ID`),
  KEY `Requester_ID_idx` (`Appointment_Requester_ID`),
  KEY `Appointment_Approver_ID_idx` (`Appointment_Approver_ID`),
  CONSTRAINT `Appointment_Approver_ID` FOREIGN KEY (`Appointment_Approver_ID`) REFERENCES `users` (`User_ID`),
  CONSTRAINT `Appointment_Requester_ID` FOREIGN KEY (`Appointment_Requester_ID`) REFERENCES `users` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES ('0051238540','53759861','07603612','inquiry','05/12/2024','10:32','Approved','urgent appointment'),('0242749338','53759861','20252138','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('1068021716','53759861','20252138','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('1309861470','20251772','20251399','normal check up','20/02/2002','02:30','Approved',''),('1541796072','53759861','07603612','inquiry','05/12/2024','10:32','Approved','urgent appointment'),('2269787098','53759861','07603612','inquiry','05/12/2024','10:32','Declined','urgent appointment'),('3075683134','20256386','20251399','holiday','23/12/2025','04:20','Approved',''),('3281039953','07603612','07603612','inquiry','05/03/2025','10:20','Approved','urgent appointment'),('3331420976','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('3863173028','53759861','20251399','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('4017573269','20251772','20251399','nothing','09/09/2009','09:09','Approved',''),('4175342246','53759861','20251399','Question from the last lecture','02/05/2025','14:20','waiting','it\'s not urgent'),('4721027889','20251772','20251399','nothing','09/09/2009','09:09','Approved',''),('5193239462','53759861','07603612','inquiry','11/11/2024','11:11','Approved','urgent appointment'),('5262619102','20251399','20252138','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('5322074239','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('5393267248','53759861','07603612','inquiry','05/12/2024','10:32','Approved','urgent appointment'),('5394532227','53759861','07603612','Question from the last lecture','02/05/2025','14:20','waiting','it\'s not urgent'),('5641896144','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('5650297418','07603612','07603612','question from the midterm','02/04/2024','14:20','Approved','it\'s not urgent'),('6189734159','17777550','07603612','question from the midterm','02/04/2024','14:20','waiting','it\'s not urgent'),('6363738413','07603612','20251399','Question from last class','02/04/2024','14:20','Declined','it\'s not urgent'),('6403300917','17777550','20251399','question from the midterm','02/04/2024','14:20','waiting',''),('6610216495','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('7000421153','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('7220422520','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('7637736619','53759861','07603612','inquiry','11/11/2024','11:11','waiting','urgent appointment'),('7757101662','53759861','20252138','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('7830613589','20251399','20252138','inquiry','05/12/2024','10:32','Approved','urgent appointment'),('8179520185','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('8734818515','20251772','20251399','normal check up','10/12/2002','05:30','Declined','I lost the notes'),('8969162515','53759861','20251399','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('9124022890','53759861','07603612','inquiry','05/12/2024','10:32','waiting','urgent appointment'),('9178077051','20251772','20251399','nothing','09/09/2009','09:09','Approved',''),('9227610657','20251772','20251399','nothing','09/09/2009','09:09','Declined',''),('9522856103','53759861','07603612','Question from the last lecture','02/05/2025','14:20','waiting','it\'s not urgent');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entry_requests`
--

DROP TABLE IF EXISTS `entry_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entry_requests` (
  `EntryRequest_ID` varchar(10) NOT NULL,
  `Entry_Requester_ID` varchar(8) DEFAULT NULL,
  `Entry_Approver_ID` varchar(8) DEFAULT NULL,
  `Entry_purpose` varchar(300) DEFAULT NULL,
  `Entry_date` varchar(20) DEFAULT NULL,
  `Entry_time` varchar(20) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`EntryRequest_ID`),
  KEY `Requester_ID_idx` (`Entry_Requester_ID`),
  KEY `Approver_ID_idx` (`Entry_Approver_ID`),
  CONSTRAINT `Approver_ID` FOREIGN KEY (`Entry_Approver_ID`) REFERENCES `users` (`User_ID`),
  CONSTRAINT `Requester_ID` FOREIGN KEY (`Entry_Requester_ID`) REFERENCES `users` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entry_requests`
--

LOCK TABLES `entry_requests` WRITE;
/*!40000 ALTER TABLE `entry_requests` DISABLE KEYS */;
INSERT INTO `entry_requests` VALUES ('0353928397','20256386','20256386','special visit','05/12/2025','09:35','Approved'),('0422090350','53759861','07603612','visit lecturer','12/12/2025','12:12','Approved'),('0508618443','53759861','20252138','visit lecturer','12/12/2025','12:12','waiting'),('0648416870','53759861',NULL,'urgent','11/11/2025','10:10','waiting'),('2083314127','53759861','20252138','visit lecturer','12/12/2025','12:12','waiting'),('2167538212','53759861','20251399','visit lecturer','12/12/2025','12:12','Approved'),('2523560892','20256386','20256386','special visit','11/11/2025','11:11','Approved'),('2570415639','53759861','20252138','visit lecturer','12/12/2025','12:12','waiting'),('2631696946','17777550',NULL,'to explore the department','02/04/2024','1:20','waiting'),('2888065648','20251399','20251399','normal check up','10/12/2002','05:30','Declined'),('2968857999','20252138','17777550','visit lecturer','12/03/2025','09:30','waiting'),('3144849809','53759861','20252138','visit lecturer','12/12/2025','12:12','waiting'),('3411256748','07603612','07603612','normal check up needed','05/11/2025','09:25','Approved'),('3433352207','20256386','20256386','special visit','11/11/2025','11:11','waiting'),('4128099648','20253603','20252138','visit','18/10/2025','10:15','Declined'),('4402773826','17777550',NULL,'to explore the department','02/04/2024','14:20','waiting'),('4743714766','20256386','20256386','special visit','05/12/2025','09:35','waiting'),('4808885823','20252138','20256386','visit','05/10/2025','five o\'cloucl','waiting'),('5188259707','20251399','20251399','normal check up','11/11/1111','11:11','Approved'),('5286389136','20253710','20252138','visit','18/10/2025','10:15','Declined'),('5585762619','20256386','20256386','special visit','05/12/2025','09:35','waiting'),('5847979460','53759861',NULL,'normal check up needed','/2025','****','waiting'),('6012683805','53759861',NULL,'normal check up needed','/2025','---','waiting'),('6142659436','17777550',NULL,'to explore the department','02/04/2024','14:20','waiting'),('6322775890','20251399','20252138','visit lecturer','12/12/2025','12:12','waiting'),('6393006039','20251399','20251399','explore the building','12/10/2024','09:45','Approved'),('6451670673','53759861','20252138','visit lecturer','12/12/2025','12:12','waiting'),('6554148072','17777550',NULL,'to explore the department','02/04/2024','14:20','waiting'),('6679431770','53759861','20252138','visit lecturer','12/12/2025','12:12','waiting'),('7030930967','20251399','20252138','visit lecturer','12/12/2025','12:12','waiting'),('7702449726','20256386','20256386','special visit','05/12/2025','09:35','Approved'),('9659688088','53759861','07603612','visit lecturer','12/12/2025','12:12','Approved'),('9797791293','20256386','20256386','special visit','05/12/2025','09:35','Approved'),('9972383483','17777550',NULL,'to explore the department','02/04/2024','14:20','waiting');
/*!40000 ALTER TABLE `entry_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internship_applications`
--

DROP TABLE IF EXISTS `internship_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internship_applications` (
  `User_name` varchar(45) DEFAULT NULL,
  `User_ID` varchar(45) NOT NULL,
  `department` varchar(45) DEFAULT NULL,
  `period_of_internship` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `additional_notes` varchar(450) DEFAULT NULL,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internship_applications`
--

LOCK TABLES `internship_applications` WRITE;
/*!40000 ALTER TABLE `internship_applications` DISABLE KEYS */;
INSERT INTO `internship_applications` VALUES ('Sondos Deeb','07603612','Software Engineering','35 days','Approved',''),('zain','17777550','Software Engineering department','25 days','waiting','I prefer to be assigned to hardware project'),('jana','49091381','Computer Engineering','25 days','Approved','');
/*!40000 ALTER TABLE `internship_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qr_codes`
--

DROP TABLE IF EXISTS `qr_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qr_codes` (
  `QRcode_ID` varchar(12) NOT NULL,
  `User_ID` varchar(8) DEFAULT NULL,
  `Visit_purpose` varchar(300) DEFAULT NULL,
  `Appointment_ID` varchar(10) DEFAULT NULL,
  `EntryRequest_ID` varchar(10) DEFAULT NULL,
  `QRcode_Expiry_date` varchar(20) DEFAULT NULL,
  `QRcode_path` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`QRcode_ID`),
  KEY `User_ID_idx` (`User_ID`),
  KEY `EntryRequest_ID_idx` (`EntryRequest_ID`),
  KEY `Appointment_ID_idx` (`Appointment_ID`),
  CONSTRAINT `Appointment_ID` FOREIGN KEY (`Appointment_ID`) REFERENCES `appointments` (`Appointment_ID`),
  CONSTRAINT `EntryRequest_ID` FOREIGN KEY (`EntryRequest_ID`) REFERENCES `entry_requests` (`EntryRequest_ID`),
  CONSTRAINT `User_ID` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qr_codes`
--

LOCK TABLES `qr_codes` WRITE;
/*!40000 ALTER TABLE `qr_codes` DISABLE KEYS */;
INSERT INTO `qr_codes` VALUES ('0226090200','53759861','3',NULL,'2167538212','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\0226090200.png'),('0338398841','07603612','inquiry','3281039953',NULL,'10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\0338398841.png'),('0538708307','07603612','Question from last class','6363738413',NULL,'09/08/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\0538708307.png'),('0835738628','20251772','General Visit','9178077051',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\0835738628.png'),('0847839883','07603612','normal check up needed',NULL,'3411256748','10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\back-end( this version send emails to students once a status get updated) - Copy\\QRcodes\\0847839883.png'),('1302250294','07603612','inquiry','3281039953',NULL,'10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\1302250294.png'),('1806955051','07603612','normal check up needed',NULL,'3411256748','10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\back-end( this version send emails to students once a status get updated) - Copy\\QRcodes\\1806955051.png'),('2118077014','53759861','inquiry','0051238540',NULL,'10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\back-end( this version send emails to students once a status get updated) - Copy\\QRcodes\\2118077014.png'),('2260450396','07603612','inquiry','3281039953',NULL,'10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\2260450396.png'),('2321597427','20251399','General Visit','7830613589',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\29- Department-Management-System ( added cors)\\back-end\\QRcodes\\2321597427.png'),('2540501372','53759861','inquiry','1541796072',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\2540501372.png'),('2684851145','07603612','normal check up needed',NULL,'3411256748','10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\back-end( this version send emails to students once a status get updated) - Copy\\QRcodes\\2684851145.png'),('2877272108','07603612','normal check up needed',NULL,'3411256748','10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\back-end( this version send emails to students once a status get updated) - Copy\\QRcodes\\2877272108.png'),('3568211970','53759861','visit lecturer',NULL,'9659688088','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\3568211970.png'),('3669835293','20256386','update the project condition',NULL,'0353928397','15/03/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Department-Management-System( convert all the code to prmise)\\back-end( convert to promise )\\QRcodes\\3669835293.png'),('3798824173','20256386','normal visit','3075683134',NULL,'05/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Department-Management-System( convert all the code to prmise)\\back-end( convert to promise )\\QRcodes\\3798824173.png'),('3969757128','53759861','visit lecturer',NULL,'9659688088','01/12/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\3969757128.png'),('4004118306','20251772','normal visit','9227610657',NULL,'05/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Department-Management-System( convert all the code to prmise)\\back-end( convert to promise )\\QRcodes\\4004118306.png'),('4373692734','20251772','General Visit','1309861470',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\4373692734.png'),('4648475434','53759861','inquiry','0051238540',NULL,'10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\4648475434.png'),('4664395917','07603612','normal check up needed',NULL,'3411256748','10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\back-end( before  edit eid\'s night\\QRcodes\\4664395917.png'),('4749414448','53759861','visit lecturer',NULL,'2167538212','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\4749414448.png'),('4784891581','07603612','inquiry','3281039953',NULL,'10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\4784891581.png'),('5292356885','53759861','inquiry','5193239462',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\5292356885.png'),('5301495706','20251772','General Visit','8734818515',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\29- Department-Management-System ( added cors)\\back-end\\QRcodes\\5301495706.png'),('5987624146','07603612','inquiry','3281039953',NULL,'10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\5987624146.png'),('6093033276','53759861','inquiry','1541796072',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6093033276.png'),('6144919216','53759861','visit lecturer',NULL,'9659688088','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6144919216.png'),('6172877125','53759861','visit lecturer',NULL,'9659688088','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6172877125.png'),('6240069967','07603612','question from the midterm','5650297418',NULL,'09/08/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6240069967.png'),('6344278895','53759861','inquiry','1541796072',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6344278895.png'),('6382325484','20251399','General Visit','7830613589',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6382325484.png'),('6445641345','53759861','inquiry','5193239462',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6445641345.png'),('6758785511','53759861','visit lecturer',NULL,'0422090350','10/10/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\back-end( this version send emails to students once a status get updated) - Copy\\QRcodes\\6758785511.png'),('6894808489','53759861','inquiry','1541796072',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\6894808489.png'),('7221314278','20251399','update the project condition',NULL,'5188259707','15/03/2025','C:\\Users\\sondo\\OneDrive\\Desktop\\Department-Management-System( convert all the code to prmise)\\back-end( convert to promise )\\QRcodes\\7221314278.png'),('7643879914','53759861','inquiry','1541796072',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\7643879914.png'),('7840319789','53759861','inquiry','5393267248',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\7840319789.png'),('8099913197','53759861','visit lecturer',NULL,'9659688088','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\8099913197.png'),('8165166883','53759861','inquiry','1541796072',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\8165166883.png'),('8873039885','53759861','visit lecturer',NULL,'2167538212','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\8873039885.png'),('8954897621','53759861','inquiry','5193239462',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\8954897621.png'),('8999097061','53759861','visit lecturer',NULL,'9659688088','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\8999097061.png'),('9178721419','53759861','inquiry','1541796072',NULL,'01/01/2031','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\9178721419.png'),('9836669267','53759861','visit lecturer',NULL,'9659688088','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\9836669267.png'),('9837876455','53759861','visit lecturer',NULL,'9659688088','4','C:\\Users\\sondo\\OneDrive\\Desktop\\Internship 2025\\Department-Management-System\\back-end\\QRcodes\\9837876455.png');
/*!40000 ALTER TABLE `qr_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `User_ID` varchar(50) NOT NULL,
  `User_Role` varchar(50) DEFAULT NULL,
  `User_name` varchar(50) DEFAULT NULL,
  `Email_address` varchar(50) DEFAULT NULL,
  `Photo_path` varchar(300) DEFAULT NULL,
  `Hashed_password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('07603612','admin','Sondos Deeb','sondos.deeb21@gmail.com','sally.png','$2b$10$G.N5iSx22iBW93u6mHhGG.M5S9jkhzMuCrtNHOKrrpN056WcUwqhu'),('17777550','student','zain','zain@gmail.com','zain.png','$2b$10$Js5p6s.vx1sKA2yoekYeRObqAjOtLoSK/1q4eKZmf4.KYmtU6rusS'),('20250391','admin','Amber Norman','AmberNorman@gmail.com',NULL,'$2b$08$FBXQUscl0PxjMxg.3ZcbM.g74X0Q1Is7S9/sU2T5T2DiqCLBZ2wYa'),('20250422','student','Elizabeth Dickerson','ElizabethDickersond35@gmail.com',NULL,'$2b$10$vTbwh40Mq9oRJuELGN6go.gP/F/4xkm4Sx10U99hqTdXTHEW1m75K'),('20251228','student','rema','rema34@gmail.com',NULL,'$2b$08$5oFuvn/P5objmt5JmTUd.Onx8pp5O5fNGOp4Bu73frkm.rGyxiIoO'),('20251399','admin','Tiana Velez','tiana@gmail.com',NULL,'$2b$10$ka78qDZMSIkJtN1y5ivzOen8Iz5BVN0vwJXgBgrCKc.h/DFKXrSWm'),('20251772','student','Jo Brown','JoBrown56@gmail.com',NULL,'$2b$10$rN/mlzDG83JWve9eJHptSu87yAx9lV443oMeswkKieJhARQIw/aym'),('20252138','admin','Emma Frank','Emma@gmail.com',NULL,'$2b$10$LvwD013wqL9lMNmo.Nc9EeBdrh4Qo2SXtDd1sC6IcG3kL4AuQjWzW'),('20253603','student','Sydney Raymond','SydneyRaymond44@gmail.com',NULL,'$2b$10$OSciLbGe7WuJV8deiBS9T.URbRE1BS2Kkx16oWp8BrhocFdE0GCTa'),('20253710','student','Truett Williams','TruettWilliams45@gmail.com',NULL,'$2b$08$CcmQg7ZrhsOFFkMnvpIo6u.mSsubTom2dReoQrkGROkqMfvN1S.Bu'),('20253933','student','Lane Sellers','LaneSellers22@gmail.com',NULL,'$2b$10$mGQnKEftb75UoanYlj.o2O38ALT.nLQzluXd8fEVT/z6uRd9SOB5u'),('20254404','student','Kody Vincent','KodyVincent11@gmail.com',NULL,'$2b$10$eHOmR9sopNTMR/v7Okswq.3Dh3FeE7Ej0FyjOESrwZ9RDMuMaCkG.'),('20256386','student','Aries Fisher','AriesFisher36@gmail.com',NULL,'$2b$08$XhRxwWtrepeIsy1MKNH6b.R.DJUNV4fCLcFazjzEaedWCVzrv5BDC'),('20257381','student','Mila Jobar','MilaJobar55@gmail.com',NULL,'$2b$10$mVyf6YuIf5AcwJTjX7BRoudo8tsDLuW2eAs5ghYrQK4bLxShoLUvW'),('20257397','student','Jaylah Welch','JaylahWelch99@gmail.com',NULL,'$2b$10$GO.5b0H8pQA272UaW51ME.AJsWeJYwP5NFaAgXp/6rCi71F2t5sSa'),('21766180','student','Bruno Bruce','Bruno@gmail.com',NULL,'$2b$10$rvhu8v/pMLYYVw1T6zat1O.XSkD3t2uaJ1cbJmd5hs0Qr4AYTd64G'),('34536715','student','Saul Hunt','SaulHunt44@gmail.com','Saul.png','$2b$10$iYOv7klqleGRsj7ZExJaGORZCYxjTmNQCUMBCbQEGEp4muLw8xvYK'),('36723337','student','mona','mona2@gmail.com','mona.png','$2b$10$OI.Hfi9Nv9pe0vuGIb/YM.DWZhDE3k4jlhn/YfBddS4JYzqcwEti6'),('49091381','student','jana','jana@gmail.com','jana.png','$2b$10$dJ61/K1yOSmgXkH8Q1teDuoYtr1uP4Ix0F8FbF4zriXqwWTkhNqvq'),('53759861','student','Lena','Lena25@gmail.com',NULL,'$2b$10$BxgNcgC1l8cnq0bGQr4dBewNiJTVcn.sG7CaxwOukUSJ3r895yV4i'),('60077243','employee','sally','sally@gmail.com','sally.png','$2b$10$.gamY/wMNBBF81VJuQ3VVOtzIytHCa/blx3klW5J9Z86Qk1UTgft2'),('62904090','student','Maximo Murphy','Maximo Murphy33@gmail.com','Maximo.png','$2b$10$.agfx5ZENA3oBj2ucsfSeObVnUEY0nfNBcXHjfY04Q3L2Jq5f0mSq'),('77823765','student','Norma','norma@gmail.com','norma.png','$2b$10$LJfiH/Rqiq7YPcHTGiaqnu3.Z1eoYKywRR/f78MPTMQN.chTInsji'),('81653002','employee','Adam','adam24@gmail.com',NULL,'$2b$10$sz02PxUMLUdFcfNRYahZSujEMtb9MxiRaqUZvwZD5B2sdedubUhNa'),('85526675','student','mona','mona@gmail.com','zain.png','$2b$10$DYVb4wlXSWqKRchEOkQU0uYK46ZWSSpw65GFviet.vznHneeiwsem');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `announcements`

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `Announcement_ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(255) NOT NULL,
  `Content` TEXT NOT NULL,
  `Created_At` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Announcement_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 21:23:39
