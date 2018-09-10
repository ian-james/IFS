-- MySQL dump 10.16  Distrib 10.1.26-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: IFS
-- ------------------------------------------------------
-- Server version	10.1.26-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `classId` int(10) unsigned NOT NULL,
  `name` text,
  `title` text,
  `description` text,
  `deadline` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `class` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_task`
--

DROP TABLE IF EXISTS `assignment_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignment_task` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `assignmentId` int(10) unsigned NOT NULL,
  `name` text,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `assignmentId` (`assignmentId`),
  CONSTRAINT `assignment_task_ibfk_1` FOREIGN KEY (`assignmentId`) REFERENCES `assignment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_task`
--

LOCK TABLES `assignment_task` WRITE;
/*!40000 ALTER TABLE `assignment_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `class` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(40) NOT NULL,
  `name` text,
  `description` text,
  `disciplineType` enum('computer science','psychology','other') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_skill`
--

DROP TABLE IF EXISTS `class_skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `class_skill` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `classId` int(10) unsigned NOT NULL,
  `assignmentId` int(10) unsigned DEFAULT NULL,
  `name` text,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  KEY `assignmentId` (`assignmentId`),
  CONSTRAINT `class_skill_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `class` (`id`),
  CONSTRAINT `class_skill_ibfk_2` FOREIGN KEY (`assignmentId`) REFERENCES `assignment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_skill`
--

LOCK TABLES `class_skill` WRITE;
/*!40000 ALTER TABLE `class_skill` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `sessionId` int(10) unsigned NOT NULL DEFAULT '0',
  `submissionId` int(10) unsigned NOT NULL,
  `toolName` text NOT NULL,
  `filename` text NOT NULL,
  `runType` text NOT NULL,
  `type` text NOT NULL,
  `route` text,
  `charPos` int(10) unsigned DEFAULT NULL,
  `charNum` int(10) unsigned DEFAULT NULL,
  `lineNum` int(10) unsigned DEFAULT NULL,
  `target` text,
  `suggestions` text,
  `feedback` text,
  `severity` text,
  `hlBeginChar` int(10) unsigned DEFAULT NULL,
  `hlEndChar` int(10) unsigned DEFAULT NULL,
  `hlBeginLine` int(10) unsigned DEFAULT NULL,
  `hlEndLine` int(10) unsigned DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `submissionId` (`submissionId`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`submissionId`) REFERENCES `submission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_input`
--

DROP TABLE IF EXISTS `feedback_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback_input` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `feedbackId` int(10) unsigned NOT NULL,
  `input` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `feedbackId` (`feedbackId`),
  CONSTRAINT `feedback_input_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `feedback_input_ibfk_2` FOREIGN KEY (`feedbackId`) REFERENCES `feedback` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_input`
--

LOCK TABLES `feedback_input` WRITE;
/*!40000 ALTER TABLE `feedback_input` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_interactions`
--

DROP TABLE IF EXISTS `feedback_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback_interactions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `sessionId` int(10) unsigned NOT NULL DEFAULT '0',
  `submissionId` int(10) unsigned NOT NULL,
  `feedbackId` int(10) unsigned NOT NULL,
  `action` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `submissionId` (`submissionId`),
  KEY `feedbackId` (`feedbackId`),
  CONSTRAINT `feedback_interactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `feedback_interactions_ibfk_2` FOREIGN KEY (`submissionId`) REFERENCES `submission` (`id`),
  CONSTRAINT `feedback_interactions_ibfk_3` FOREIGN KEY (`feedbackId`) REFERENCES `feedback` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_interactions`
--

LOCK TABLES `feedback_interactions` WRITE;
/*!40000 ALTER TABLE `feedback_interactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_rating`
--

DROP TABLE IF EXISTS `feedback_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback_rating` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `feedbackId` int(10) unsigned NOT NULL,
  `ratingUp` int(10) unsigned NOT NULL,
  `ratingDown` int(10) unsigned NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `feedbackId` (`feedbackId`),
  CONSTRAINT `feedback_rating_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `feedback_rating_ibfk_2` FOREIGN KEY (`feedbackId`) REFERENCES `feedback` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_rating`
--

LOCK TABLES `feedback_rating` WRITE;
/*!40000 ALTER TABLE `feedback_rating` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_stats`
--

DROP TABLE IF EXISTS `feedback_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback_stats` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `sessionId` int(10) unsigned NOT NULL DEFAULT '0',
  `submissionId` int(10) unsigned NOT NULL,
  `filename` text NOT NULL,
  `toolName` text NOT NULL,
  `name` text NOT NULL,
  `type` text NOT NULL,
  `level` text NOT NULL,
  `category` text NOT NULL,
  `statName` text NOT NULL,
  `statValue` decimal(8,3) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `submissionId` (`submissionId`),
  CONSTRAINT `feedback_stats_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `feedback_stats_ibfk_2` FOREIGN KEY (`submissionId`) REFERENCES `submission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_stats`
--

LOCK TABLES `feedback_stats` WRITE;
/*!40000 ALTER TABLE `feedback_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ifs_tips`
--

DROP TABLE IF EXISTS `ifs_tips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ifs_tips` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ifs_tips`
--

LOCK TABLES `ifs_tips` WRITE;
/*!40000 ALTER TABLE `ifs_tips` DISABLE KEYS */;
INSERT INTO `ifs_tips` VALUES (1,'Track your progress on the Dashboard!','Did you know you can visit the Dashboard to rate your understanding of specific course skills?'),(2,'See how your class is doing!','Visit the Dashboard and checkout the Student and Class Acitivity section to view interactive graphs.'),(3,'View your most recent submission again','Click on \"Feedback\" in the topbar to view your most recent submission!');
/*!40000 ALTER TABLE `ifs_tips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preferences`
--

DROP TABLE IF EXISTS `preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `preferences` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `toolType` varchar(60) NOT NULL,
  `toolName` varchar(60) NOT NULL,
  `toolValue` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userTool` (`userId`,`toolName`),
  CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferences`
--

LOCK TABLES `preferences` WRITE;
/*!40000 ALTER TABLE `preferences` DISABLE KEYS */;
INSERT INTO `preferences` VALUES (1,1,'Option','pref-toolSelect','Programming'),(2,1,'Option','pref-tipsIndex','1'),(3,1,'Option','pref-tipsAllowed','on');
/*!40000 ALTER TABLE `preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `surveyId` int(10) unsigned NOT NULL,
  `language` char(10) NOT NULL,
  `origOrder` int(10) unsigned NOT NULL,
  `text` text NOT NULL,
  `visualFile` text,
  `type` enum('matrix','rating','text','radiogroup') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `surveyId` (`surveyId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`surveyId`) REFERENCES `survey` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(40) NOT NULL DEFAULT 'student',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'developer'),(3,'student');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `name` text,
  `bio` text,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,1,'Kevin Glover-Netherton','');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_assignment_task`
--

DROP TABLE IF EXISTS `student_assignment_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_assignment_task` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `studentId` int(10) unsigned NOT NULL,
  `assignmentTaskId` int(10) unsigned NOT NULL,
  `isComplete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_assignmentId` (`studentId`,`assignmentTaskId`),
  KEY `assignmentTaskId` (`assignmentTaskId`),
  CONSTRAINT `student_assignment_task_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`),
  CONSTRAINT `student_assignment_task_ibfk_2` FOREIGN KEY (`assignmentTaskId`) REFERENCES `assignment_task` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_assignment_task`
--

LOCK TABLES `student_assignment_task` WRITE;
/*!40000 ALTER TABLE `student_assignment_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_assignment_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_class`
--

DROP TABLE IF EXISTS `student_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_class` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `studentId` int(10) unsigned NOT NULL,
  `classId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `classId` (`classId`),
  CONSTRAINT `student_class_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`),
  CONSTRAINT `student_class_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `class` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_class`
--

LOCK TABLES `student_class` WRITE;
/*!40000 ALTER TABLE `student_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_skill`
--

DROP TABLE IF EXISTS `student_skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_skill` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `studentId` int(10) unsigned NOT NULL,
  `classSkillId` int(10) unsigned DEFAULT NULL,
  `value` decimal(4,2) DEFAULT NULL,
  `lastRated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `classSkillId` (`classSkillId`),
  CONSTRAINT `student_skill_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`),
  CONSTRAINT `student_skill_ibfk_2` FOREIGN KEY (`classSkillId`) REFERENCES `class_skill` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_skill`
--

LOCK TABLES `student_skill` WRITE;
/*!40000 ALTER TABLE `student_skill` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission`
--

DROP TABLE IF EXISTS `submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submission` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `sessionId` int(10) unsigned NOT NULL DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `submission_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission`
--

LOCK TABLES `submission` WRITE;
/*!40000 ALTER TABLE `submission` DISABLE KEYS */;
/*!40000 ALTER TABLE `submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey`
--

DROP TABLE IF EXISTS `survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `surveyName` varchar(60) NOT NULL,
  `authorNames` varchar(60) NOT NULL,
  `title` varchar(60) DEFAULT NULL,
  `totalQuestions` int(11) DEFAULT NULL,
  `surveyField` varchar(40) NOT NULL,
  `surveyFreq` varchar(20) NOT NULL,
  `fullSurveyFile` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `surveyName` (`surveyName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey`
--

LOCK TABLES `survey` WRITE;
/*!40000 ALTER TABLE `survey` DISABLE KEYS */;
/*!40000 ALTER TABLE `survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_preferences`
--

DROP TABLE IF EXISTS `survey_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_preferences` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `surveyId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `surveyStartDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastRevision` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pauseAsking` tinyint(1) DEFAULT '0',
  `pauseTime` time DEFAULT NULL,
  `allowedToAsk` tinyint(1) DEFAULT '1',
  `currentIndex` int(11) DEFAULT '0',
  `lastIndex` int(11) DEFAULT '10',
  `currentSurveyIndex` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `survey_userIds` (`surveyId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `survey_preferences_ibfk_1` FOREIGN KEY (`surveyId`) REFERENCES `survey` (`id`),
  CONSTRAINT `survey_preferences_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_preferences`
--

LOCK TABLES `survey_preferences` WRITE;
/*!40000 ALTER TABLE `survey_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `survey_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_result`
--

DROP TABLE IF EXISTS `survey_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `survey_result` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `surveyId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `questionId` varchar(20) NOT NULL,
  `questionAnswer` varchar(80) NOT NULL,
  `surveyResponseId` int(11) NOT NULL DEFAULT '0',
  `answeredOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `surveyId` (`surveyId`),
  KEY `userId` (`userId`),
  CONSTRAINT `survey_result_ibfk_1` FOREIGN KEY (`surveyId`) REFERENCES `survey` (`id`),
  CONSTRAINT `survey_result_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_result`
--

LOCK TABLES `survey_result` WRITE;
/*!40000 ALTER TABLE `survey_result` DISABLE KEYS */;
/*!40000 ALTER TABLE `survey_result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upcoming_event`
--

DROP TABLE IF EXISTS `upcoming_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `upcoming_event` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `classId` int(10) unsigned NOT NULL,
  `name` text,
  `title` text,
  `description` text,
  `openDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `closedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dateCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  CONSTRAINT `upcoming_event_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `class` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upcoming_event`
--

LOCK TABLES `upcoming_event` WRITE;
/*!40000 ALTER TABLE `upcoming_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `upcoming_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_interactions`
--

DROP TABLE IF EXISTS `user_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_interactions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `sessionId` int(10) unsigned NOT NULL,
  `eventType` varchar(40) NOT NULL,
  `name` varchar(40) NOT NULL,
  `data` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_interactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_interactions`
--

LOCK TABLES `user_interactions` WRITE;
/*!40000 ALTER TABLE `user_interactions` DISABLE KEYS */;
INSERT INTO `user_interactions` VALUES (1,1,0,'view','page','\"/registration-complete\"','2018-06-05 16:38:41'),(2,1,1,'view','page','\"/login-redirect\"','2018-06-05 17:08:48'),(3,1,1,'view','page','\"/setup\"','2018-06-05 17:08:49'),(4,1,1,'view','page','\"/setup/data.json\"','2018-06-05 17:08:49'),(5,1,1,'view','page','\"/setup/values.json\"','2018-06-05 17:08:49'),(6,1,1,'view','page','\"/setup\"','2018-06-05 17:09:01'),(7,1,1,'view','page','\"/courses\"','2018-06-05 17:09:01'),(8,1,1,'view','page','\"/courses/courses.json\"','2018-06-05 17:09:02'),(9,1,1,'view','page','\"/courses/enrolled.json\"','2018-06-05 17:09:02');
/*!40000 ALTER TABLE `user_interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_registration`
--

DROP TABLE IF EXISTS `user_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_registration` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `isRegistered` tinyint(1) DEFAULT '0',
  `completedSetup` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_registration_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_registration`
--

LOCK TABLES `user_registration` WRITE;
/*!40000 ALTER TABLE `user_registration` DISABLE KEYS */;
INSERT INTO `user_registration` VALUES (1,1,1,0);
/*!40000 ALTER TABLE `user_registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `roleId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `password` char(60) NOT NULL,
  `sessionId` int(11) NOT NULL DEFAULT '0',
  `optedIn` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kglovern@uoguelph.ca','$2a$10$v.rjEKNeKQ5XaShIwNM1/.XHEJwMmygCQAfAMrwrfZQIgijp1t5GK',1,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verify`
--

DROP TABLE IF EXISTS `verify`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verify` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `type` varchar(10) NOT NULL,
  `token` varchar(40) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `verify_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verify`
--

LOCK TABLES `verify` WRITE;
/*!40000 ALTER TABLE `verify` DISABLE KEYS */;
/*!40000 ALTER TABLE `verify` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-05 17:26:02

