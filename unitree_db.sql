-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2025 at 01:41 PM
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
-- Database: `unitree_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'Tech'),
(2, 'Craft'),
(3, 'Necessity');

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `listing_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `status` enum('available','sold','removed') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `date_placed` datetime DEFAULT current_timestamp(),
  `date_shipped` datetime DEFAULT NULL,
  `status` enum('pending','received','cancelled','shipped') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `date_placed`, `date_shipped`, `status`, `created_at`) VALUES
(16, 7, 0.00, '2025-10-03 23:25:25', NULL, 'cancelled', '2025-10-03 15:25:25'),
(17, 7, 0.00, '2025-10-04 16:06:51', NULL, 'cancelled', '2025-10-04 08:06:51'),
(18, 7, 0.00, '2025-10-04 16:20:50', NULL, 'cancelled', '2025-10-04 08:20:50'),
(19, 7, 0.00, '2025-10-04 16:44:57', NULL, 'received', '2025-10-04 08:44:57'),
(20, 7, 0.00, '2025-10-04 16:45:54', NULL, 'cancelled', '2025-10-04 08:45:54'),
(21, 7, 0.00, '2025-10-04 19:27:10', NULL, 'cancelled', '2025-10-04 11:27:10'),
(22, 7, 0.00, '2025-10-04 19:29:58', NULL, 'pending', '2025-10-04 11:29:58'),
(23, 7, 0.00, '2025-10-04 19:32:00', NULL, 'pending', '2025-10-04 11:32:00'),
(24, 5, 0.00, '2025-10-04 19:38:34', NULL, 'pending', '2025-10-04 11:38:34'),
(25, 7, 0.00, '2025-10-04 19:49:42', NULL, 'pending', '2025-10-04 11:49:42'),
(26, 7, 0.00, '2025-10-04 20:53:48', NULL, 'pending', '2025-10-04 12:53:48'),
(27, 39, 0.00, '2025-10-07 09:12:00', '2025-10-07 09:15:31', 'received', '2025-10-07 01:12:00');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(21, 17, 21, 1, 250.00),
(23, 18, 21, 1, 250.00),
(25, 19, 21, 1, 250.00),
(28, 22, 20, 1, 20.00),
(29, 23, 15, 1, 300.00),
(30, 23, 17, 2, 180.00),
(31, 24, 11, 1, 1.00),
(32, 25, 43, 3, 1.00),
(33, 26, 43, 2, 1.00),
(34, 27, 44, 2, 12.00);

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `pet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pet_name` varchar(100) NOT NULL,
  `level` int(11) DEFAULT 1,
  `coins` int(11) DEFAULT 0,
  `level1_image` varchar(255) DEFAULT NULL,
  `level2_image` varchar(255) DEFAULT NULL,
  `level3_image` varchar(255) DEFAULT NULL,
  `last_fed` timestamp NULL DEFAULT NULL,
  `has_fruit` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`pet_id`, `user_id`, `pet_name`, `level`, `coins`, `level1_image`, `level2_image`, `level3_image`, `last_fed`, `has_fruit`) VALUES
(28, 15, 'a', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(29, 15, 'a', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(30, 16, 'kulet1', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(32, 17, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(33, 20, 'mans', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(34, 21, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(35, 21, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(36, 22, 'asasas', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(37, 22, 'asasas', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(39, 23, 'tite', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(40, 24, 'lala', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(41, 24, 'lala', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(42, 24, 'lala', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(43, 24, 'lala', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(44, 24, 'lala', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(45, 24, 'lala', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(46, 35, 'butchi', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(47, 35, 'butchi', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(48, 36, 'eli', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(49, 36, 'eli', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(52, 38, 'minggay', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(53, 38, 'minggay', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(54, 39, 'lili', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(55, 39, 'lili', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(56, 40, 'mimi', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(57, 40, 'mimi', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(58, 41, 'mimiyuh', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(59, 41, 'mimiyuh', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(60, 42, 'taytay', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(61, 42, 'taytay', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(62, 43, 'blue', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(64, 44, 'koko', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(65, 44, 'koko', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(66, 45, 'koi', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(67, 45, 'koi', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(68, 46, 'jaja', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(69, 46, 'jaja', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(70, 47, 'abc', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(71, 47, 'abc', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(72, 48, 'sample', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(73, 48, 'sample', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(74, 49, 'lara', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(75, 49, 'lara', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(76, 57, 'higad', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(77, 57, 'higad', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(78, 61, 'van', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(79, 61, 'van', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(80, 5, 'groot', 1, 0, '1759390285681.jpg', NULL, NULL, NULL, 0),
(81, 62, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(82, 62, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `seller_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `category_id`, `created_at`, `seller_id`) VALUES
(6, 'Gaming Monitor1', '27-inch FHD gaming monitor with 144Hz refresh rate.', 8999.00, 10, NULL, '2025-09-25 05:19:07', 16),
(7, 'External SSD 1TB', 'Portable high-speed external SSD with USB 3.2 interface.', 5999.00, 12, NULL, '2025-09-25 05:19:07', 17),
(8, 'Webcam 1080p', 'Full HD webcam with built-in microphone and privacy cover.', 1299.00, 25, NULL, '2025-09-25 05:19:07', 17),
(9, 'Portable Speaker', 'Compact Bluetooth speaker with waterproof design and 12-hour playtime.', 1799.00, 30, NULL, '2025-09-25 05:19:07', 17),
(11, 'alvin1', 'sas', 1.00, 0, NULL, '2025-09-26 11:41:09', 20),
(12, 'as', 'asasaasa', 250.00, 2, 3, '2025-09-26 12:20:30', 20),
(13, 'poketree', 'poketree as your companion', 200.00, 22, 2, '2025-09-27 12:45:20', 53),
(14, 'mouse', 'mouseee', 300.00, 20, 1, '2025-09-27 13:18:55', 53),
(15, 'ewan', 'ewan', 300.00, 19, 3, '2025-09-27 13:28:55', 53),
(17, 'earphones', 'quality earphones', 180.00, 18, 1, '2025-09-27 13:40:03', 54),
(18, 'charger', 'charger', 100.00, 5, 1, '2025-09-27 13:41:17', 54),
(19, 'bracelet', 'bracelet design for besties', 100.00, 30, 2, '2025-09-28 13:48:53', 56),
(20, 'ballpen', 'basta ballpen', 20.00, 49, 3, '2025-09-29 01:36:42', 58),
(21, 'saas', 'saas', 250.00, 122, NULL, '2025-10-02 05:32:04', 60),
(43, 'aircon', 'air', 1.00, 7, 2, '2025-10-04 11:48:41', 5),
(44, 'jajasj', 'jasjan', 12.00, 109, NULL, '2025-10-07 01:10:14', 6);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `image_path`, `uploaded_at`) VALUES
(4, 11, 'images/1758886906852.png', '2025-09-26 11:41:46'),
(5, 11, 'images/1758886906861.png', '2025-09-26 11:41:46'),
(6, 12, 'images/1758889230365.png', '2025-09-26 12:20:30'),
(7, 21, 'images/1759383124711.jpg', '2025-10-02 05:32:04'),
(8, 21, 'images/1759383124712.jpg', '2025-10-02 05:32:04'),
(9, 21, 'images/1759383124713.jpg', '2025-10-02 05:32:04'),
(15, 43, 'images/1759578521246.jpg', '2025-10-04 11:48:41'),
(16, 44, 'images/1759799414001.jpg', '2025-10-07 01:10:14'),
(17, 44, 'images/1759799414003.jpg', '2025-10-07 01:10:14');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `order_id`, `comment`, `rating`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 39, 44, 27, 'jhahsjahjsa maganda po', 5, '2025-10-07 01:16:43', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `reward_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `reward_type` enum('discount','free_shipping','bonus_coins') NOT NULL,
  `value` varchar(50) NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `coins_earned` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer','seller') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` text DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `profile_picture` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'approved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `created_at`, `token`, `first_name`, `last_name`, `age`, `birthday`, `address`, `gender`, `profile_picture`, `status`) VALUES
(5, 'flint', 'flintaxl.celetaria@gmail.com', '$2b$10$nNlIhzJA9ja1ektzbApOee2U2zdk7tA7s.vZyZ3RKvtitq6NKUzuG', 'admin', '2025-09-23 02:12:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(6, 'bea', 'bea@gmail.com', '$2b$10$VvcXKPSLhVkcrT/Nb5a36eRquGTfFRO0sfv3oJkkMHwVaFpqBS0qG', 'seller', '2025-09-23 02:28:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(7, 'ash', 'ash@gmail.com', '$2b$10$Th0GH9.IPiSb5J.uWIJmaeSR.zSHRFPdsvJo6Lq3Rsr4lWrt2kURm', 'customer', '2025-09-23 02:33:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(12, 'a', 'a@gmail.com', '$2b$10$R5Rphq8YYSQMeWhsnbb/TeS1ISchse29gKt4aJCbO/LYs23YnQZZm', 'customer', '2025-09-23 04:35:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(15, 'kim', 'kim@gmail.com', '$2b$10$VU45G1S23LalvwTpnmLRAOGeVzyHWRPEvKaLUrIL/dGc4rmcRGsDO', 'seller', '2025-09-23 14:09:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(16, 'bab1', 'bab@gmail.com', '$2b$10$JR7USHa4BnULcRibeDGxzebMHmG8WgD6aW0EVpIXwFFMfSePV48tO', 'seller', '2025-09-23 14:21:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(17, 'lol', 'lol@gmail.com', '$2b$10$wMVaedIGbR8vEAMwhXfQAe7CTaWABOF2uk4hBQN.3wEdRtJcTUZsO', 'seller', '2025-09-23 14:40:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(20, 'lola', 'lola@gmail.com', '$2b$10$zmSA5KWCArw7EimmFSrdS.7.DouAdvgBLKPdZo5i.qiJYgmEEsWda', 'seller', '2025-09-23 14:42:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(21, 'pau', 'pau@gmail.com', '$2b$10$31s0PLx5neNqzOAvo4Pro.Ea5sTY387VihZpBHOZfFognt5EWJCey', 'seller', '2025-09-24 05:53:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(22, 'kc', 'kc@gmail.com', '$2b$10$a0ef96isa5ERfHlFTQCvg.KNrLU/cl3.m9uaV4XTeNrkxli0YDsg.', 'seller', '2025-09-24 05:56:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(23, 'juli', 'juli@gmail.com', '$2b$10$qgwBJUqHAzE/aEzEOCICCe6/oOCks8UA5D7uONqqct4PKkWYGWZq2', 'customer', '2025-09-25 05:28:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(24, 'shelley', 'shelley@gmail.com', '$2b$10$zCU.XNLQLK9ucghKrwV8YuOqwKKeeEAXKR7dwCwqpyYTUHDJ20Mea', 'customer', '2025-09-25 05:39:45', NULL, '', '', NULL, NULL, '', NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAB4AHgDASIAAhEBAxEB/8QAHQABAQEBAAIDAQAAAAAAAAAAAAcGCAIFAQMECf/EADYQAAICAQQBAgUCAwYHAAAAAAECAwQFAAYREgcTIQgUIjFBFSMWMmEkQlFigdEXM1VzkpPB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AP6p6aaaBpppoGmmmgaaa8JZUgjaSR1jRRyWY8AD+p0Hnpr8P67jf+o1P/ev++n65jeOf1Crx/3l/wB9B+7TXijrIisrBlYchgeQRry0DTTTQNNNNA0000DTTTQer3NubG7PwtjLZaz8rRgKKzhGdizuERFVQWZmdlVVUEksAASdeW3s9V3Ng8flaiWIq12BLEUdyu9eZVYcgPFIA6N/irAEH2I1jcCo8j70fcUkpfb+Cmkq4eKMkR2rHHWe034cL7xRkew/ePLd16UPQfU3rmYcGNYuDzyCWJ9uD+OPz7e/41Psr4Rx25M9ks3m8rkMnkbdRakEc3pyU8cB2DSVq0qyRq7gr3Lh+3pr7Acg705Wkt56RtwC6kIsNW9QeosRJAcr9+vII5+3IOs/tXyhtfe+byeJwWXiydzHVKd+x6COYhXtq7VpEl46SB1ic/Qx449+ORyGRx/w5YOjarSvkZLaRSd3hmwmGCTDn+RulFWC/j6Sp/rr39rxhgoK7mHaO2cjzKp9CTHRQcRl154bowLKnYgEAMwUEoCWG2ilSeNZI3WSNhyrKeQR/iDrz0EGi21Z2T5Pj3TtqlaTBtTWrk9nxJLVeuAzc3YI1kENp1/ldert0VPSbnhZbdisrUzmNrZChOlmnZQSRTIfZlP2OvO7j6+QWJbEQk9KVZozyQUdTyCCPt/9BIPsTqZzZO1463zPNOtaHbd9ibkYuQwxUeWZhf6OFPEsj+nKAT9fRwD3cgKppppoGmmmgaaaaBqdea97nbG3lxtaWSvkMsksfzkblPkKyrzYtlh78xqQEUfU8jxqCOSy0XUM3TtW7vL4psVHelWxtnEYCvkRTXqR8z8zYAEw456MyV5UDHjvS5Xgq3YKh49lMmzcSv8AD1na0UVdIocTbaIyV41UBVb0mZQQOBwCeONe+s2YaVaWxYlSCCJDJJLIwVUUDkkk+wAH516DdW+K21crt3GNSu5K/nLvyleCiqFo1Cl5J5C7qFijUcsQSfdQqszAGMbls2dz7p8g4W9lLt2tnd043Z9TFNKxqpTTG171wKikAM8cl3uxPJVFX8AaDQYeiW8Wb58iu1yLOboxM+QjlndlmqUlhkalXQexiCI5cqOOJJZSfqJOsl4VqHH5mLdVhx6G77+Y23kyPbmSlkLUeNKj+6qwR2UYj3ZpIz+OdW/yrG8vi/eCRgl2w9wKFHJJ9B+NTPwlt/HeRPh9yOIa1+zbzedeK5UcGStIcvamr2Im9+roTFNG34IRh+NB6/wvO/jXae04Ybk0+2MXD/BmUqzzFzj7tSwa0E6gkBY5OHDsfqYPWYADsddC6562huahc3rlcFu+pUil3Vxiszj3AEP6zBCVIKFjwtqmkcsJ9y0dfg9WABoHjrcGSweVl2HuRLLX8dEP0rM2ZvW/WqSqo9Vn9j8wh+mVSPc8OOVf2Ci6yfk6BTtOzblkWOpT/fu93KK1T7WAWX3HERdgR7hlUj3A1kcT5C3Rlbu0oitCr87uvN4u+kkD9mpVZLy1/T+r6ZGWCuxY8ggtwB2HFLz1u7j8HkbWNx/6tkYK0klagZhD8zKFJSL1G5CdiAvY+w550GS8XZiWsuR2dkJ71rK7cMcIt34n7XajgmvOJWLesSqlHfsWMkTlgvI53muctib/AGy+xPHPkDH4yOgK2TXaWZxjCVZq0Ulv5FYE+rh2r2/QDO490Sdl6lgp6N0DTTTQNNNNA1g/GFaPIXN17oLNLNmcrJFG7+/p1qv9mjjXn3Cdo5pep+zzyEfza2mQsvToWbEcD2ZIomdYY/5pCASFH9T9tc6fDBjjvintLP2ZLHyW09r4rGVIDOyrJkLNCG3dtOoPEvaOzWQM/JDic8e4Yho/IU+Wm39ubI4GeCTO18TS2vgvXk6ClduztLcmKtwJAsKUZyBySKzKvBJ5nPizw/iczuDBbOzUuWvxbTsbouXIb2RsJblmsZQJQszurK0rPS9cBmPukvsCCeNfSSTyVv7I43G5S3jPVyOWycmWoCNrFB6hjxcCskkbqpeVLrRswIZasgAb6uky+InOw/DtuPB7m3hvTfG8t25SzNDiau3LFfFRQY5DCJBPCD0semZPUJKsSWZuqIjFQ6p2f4ywew7dibCi/XjnhjgNSbJWLFdFQnqUikdlQ/UQSoHI45+w1+DxP4ur+JqWZxOMmLYKa4tjH1XZnapEK8UXpdmJJUGL6R+FIH2GpV8PW/Hy/kDJ43/iZndz1XjnEWK3Zj6UNrvEYizQGusTxhBKBJFPH3PeNh1APbo/QSXeHwybQ3vuq1ubI2s/HuCf0B8/SzE9do0hnE8KKiME4RgQpKkgO/B5Yk7nfGFxOYwDvmbRx1egwupk1mEMlJ0BPrLIf5OFLAn7FWZTyrEHmn4k7Mw35dXyRvjJbf8AHPevDjcFtd2Se5GyR+rPeYHh0MnrRLW6uZFRyFbq3WQ+B9y+J9277/QbWzdwbdwiZuGQ1FztiXF37M7hKj5HFrHFXjJdK4AjjdEkESyMp45DqDb9uPI+aY8ekhaaLO5TLKeQVMEePpQNwefv3vREcfjtq2xX609qetFZhkswdTLCjgvHz7jsPuOfxzqFeOra7g+JveKwdVTbNayk5Pv6n6g1MRhD+OhxM4Ye386f4HhvLb+2szv1K+wNnpHvnH5+tPlty46l+nx0+/Sax69roBaMkB6tCpk5aSMuE4DAN94iniig3diELCbE7juwzRFSBF6xW3GFJ+4MVqJvb2HYj7g63+p741eVt9eV1PQwLuGv0YfcMcRj+ykf+J5/zf01QtA0000DTTTQNQj4bLUWz/AWUz65CHN7eN7L5nFmhF16482JpIoVJYhuqjhCOo6dBwOOTd9S/JbCo+MfBe7sFiZ53xUGNyElOtMsQWnG0Tt6MfRF/bUk8duze/HYgAAJp4my9nx1lsNiosaNx7kyIxe3bckc5ikNerVFi5eI6sG6WMjLI7OULmcAMzFFbUedPF+e3P5G2Vu6lt7FbwxW30nWxhrE4r3D3lglWSsXBhklWStCyiVo1HV/q7MrJMtlbqxeMxuA3xV3diae5624NzbelpZqRo6t5ZLskq15ZgpNaVIaNUo7AjonQqeyFbJs74mdpbiarBlZhti1arm3UkvWIpKV6AP0aWvajZopED+3DFXHsWRQRyEz2P4hx/8AFe2c7gvHmb8UYjCWUyl/LbmysU9meOCC1ElWOMWrAjjYXLDyyMU5HPszN3Syz/EL43jxONyNfeWJykGTlaCimJsC7NakUKXWKKHs7lAylwFPQHluBraw2MduTFFoZa2UxtuMqWjZZYZkIII5HIYH3GpXgvhtx+yK2ah2jnbe3nuxV6dG0KdWxaw1NZQ8tWrO8Zk9FlHVElaRYSAUHChAGQy9Ha3xDV8D5YwO2W8mbZsU7GGmwNyMVJnVLTo8qQ2zHGXSRJUZZejdSergdklY74do955uvko8TlPGOCTMfqN/CSNVe7knj+RlgK2K88q14RNTjJVSZD6QAdEPU3jZ+0cTsPbVHA4SpHRxlNSsUUY45JYs7sfyzMzMzH3ZmJPudSfzh54xFTxxuWttXIRZXLTUpKkeRruTj8fLN+zDJYsqeFBlkQBIy0zE/RG3B4Cf/D9vpcfUvZzFRUMpa37vK1JjHlsemzYf5iS3LMT15PoR2ZQU+yzOUYqSdW7yxlVt7ewENHIzwJkcxjCtmg/HqQG5AWAkAI6sGAI/vKx4/JHH/h7ydiMDhcgm0tqZAbjq7fp7bw+OsFYsPjbN+0pjrR/uF5JpXkNqyxIKJWVCEKHVa+I3cmV8eYjxlsPZ92CbdHCvj4b0fZHEMaUYXMKjsxWzdrWOD9IWrISfp9wtPiWH5mzvnOh+0ea3HPNGoHsq14IKI4P5DfJ9+f8AOR+OTQNek2VtStsbaWJwFOaxagx9ZK4s3JPUnnIH1SytwOzueWY8DlmJ417vQNNNNA0000DXwyh1KsAykcEEexGvnTQTry54sxW7PCu4doUKlbEQfp7fpvyiGBKNiId60qCPqV9OVI2AXj+Xj7e2uVty76zF7zd462vt7G4y7PuFI7GQqW4kgVaxqzWsbWji+ky06YXvI0bASyL1PQt0Xt3cVK3kdv5OpQnhrX56ssVeexGZI45GQhWZQQWUEgkAgkfkajsngTAbFw1y9SxuQzW9spXhx0GXrSGOelMuPFJZYZer/JoERmMnDFTI3AflU0EH8tby8c+IMxiM3ksEqTXbM+Hq5Hb8y4LKbjvdgbFt56npOlOMgr7u3qO3tGeqM9l8S5jG+OchnsrvDddrbkE9LHSnGbl3c16tjXmh9RqxktSs4njf1OXBUOksR4PA67nGfD3s0ZrB7gzODoZfcOGoVsfj7DwcV8fDAweNKsHPSLrIOwcDv9h26qqrvI9uYmHMSZaPF0kysq9HvLXQTuvsOC/HYj2Htz+NBy15QkzG/vIG2sZh5t0b5w19b1eZL2EsQ4Ko8iKKtqYGvHWvV0/dbo0jFmEBUgdifv8ALHivJ0sFSwMKX8dsrAcY/HK8y3JsrYsCKJXleQkrJPYttCXI5SNLLdv7Qph6v00HCvwcfD1mLfkbMbvzeRcbVwWUkkw1KCN4oshknqwRWLyqSVFVEQw1Qn0+g30kKT6nX48XbZbyDPvabFw2tyyQQVo7thRI1dIhMF9Ln/lnixMCy+5DkE8e2tNWqxVI2SGNY0Z2kIX8szFmP+pJP+uvt0DTTTQNNNNA0000DTTTQNNNNA0000DTTTQNNNNA0000DTTTQNNNNA0000DTTTQNNNNA0000DTTTQNNNNA0000H/2Q==', 'approved'),
(32, 'jet', 'jet@gmail.com', '$2b$10$k918lNAwTmuHJfjB7A4qh.HQhup/Wumgqe.5zfICXkSw7wxFOkH.u', 'customer', '2025-09-25 06:23:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(33, 'je', 'je', '$2b$10$bieJqWP05WxmQ1AcMBWEkekzmui19wOD/frnO.leojNiPSfh8auRK', 'customer', '2025-09-25 06:59:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(34, 'min', 'minggay@gmail.com', '$2b$10$bzOTzvrZmSu/REu8.DwOAeoRoED6VbVArEL6W5CuF/cgEJciIHmh6', 'customer', '2025-09-25 07:20:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(35, 'mari', 'mari@gmail.com', '$2b$10$QD0Rt3O.jPNl67xHojUZH.O7D7xZbjhL/FgYcTiaoAyZajVYduTXq', 'customer', '2025-09-26 03:32:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(36, 'eli', 'eli@gmail.com', '$2b$10$sKde3sa.W1iPXAX836acxuasI7olWOLRmoci/7zMZX0yfQXz0Hn36', 'customer', '2025-09-26 04:12:27', NULL, 'eli', 'mejos', 21, '2005-05-14', 'bagumbayan', 'male', NULL, 'approved'),
(38, 'butchi', 'butchi@gmail.com', '$2b$10$VPbmqyBA4KRzsiEtZ1fSr./UfhoXCz1ZQ4v4VyOYKFnurnW7ovUfy', 'customer', '2025-09-26 04:39:02', NULL, 'butch', 'i', 3, '2025-09-27', 'mars', 'female', NULL, 'approved'),
(39, 'lili', 'lili@gmail.com', '$2b$10$ow.GpMzMoz6mpC90bnWDFO6lTcuzdkItVwi/KkyL1NR0Jq2VyDbS2', 'customer', '2025-09-26 04:42:44', NULL, 'kim', 'eledia', 20, '2005-04-12', 'tanyag, taguig city', 'female', NULL, 'approved'),
(40, 'mimi', 'mimi@gmail.com', '$2b$10$gD2gAFPM9C50E2AH6.bhnuFPHltwlVaHnmB/1hWVW3Ji1y9i4/uwC', 'customer', '2025-09-26 04:52:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(41, 'mimiyuh', 'mimiyuh@gmail.com', '$2b$10$Hb/q3BaFXMrqKoxwf2cSi.xG1mhVl6/mUfPybSiAGJbaik9yIfDgS', 'customer', '2025-09-26 04:55:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(42, 'taylor', 'taylor@gmail.com', '$2b$10$V.xZLDLQPA/Qfw8TZZ8FKeTQljrIZNDzVKMxfThGgNC/fkGhAHDp2', 'customer', '2025-09-26 04:58:55', NULL, 'Taylor', 'Swift', 30, NULL, 'New York', 'female', 'data:image/jpeg;base64,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', 'approved'),
(43, 'candy', 'candy@gmail.com', '$2b$10$6iPe8vrDEtOOo6t/nlms3uCuWZzLLnc96i5ROAYc9awGGuWEEEbUa', 'customer', '2025-09-26 06:24:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(44, 'aray', 'aray@gmail.com', '$2b$10$MmI/COoB18BipkYd5TAKkunIw95cNXiTbDQWS3liPar/FiyR3GJrG', 'customer', '2025-09-26 12:38:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(45, 'kol', 'kol@gmail.com', '$2b$10$o1LeKHFe0moXWjfKxn2X5.hOC1hgSHvQsLBiuaYoYsjB5zhgJHAIC', 'customer', '2025-09-26 12:51:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending'),
(46, 'ka;', 'ja@gmail.com', '$2b$10$csRFwHsajnveZERjkWmHROdXkqtL4LUd3CRF87GeSTVrfQZ3HZ4De', 'customer', '2025-09-26 12:52:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(47, 'abc', 'abc@gmail.com', '$2b$10$QFNVtNRAT2/0AiuPRfJdfu3lIV6GzxUJ/ttquoTANyo1ZDZr4wCXa', 'customer', '2025-09-26 14:54:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(48, 'sample', 'sample@gmail.com', '$2b$10$5rFnkKGmNUAvYupo6FbG3.ybGOiKGSBKOd2aJgAzNwbCyQtf.zco6', 'customer', '2025-09-26 15:14:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(49, 'lara', 'lara@gmail.com', '$2b$10$A1nY1HfhjqKOBkEmX/pzF.Y2gidYMDecKN3x5ieu92s0Xas.ZJtGC', 'customer', '2025-09-27 12:04:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(50, 'manon', 'manon@gmail.com', '$2b$10$3llCdM660tyYr7lpTRq8cej5HwYL/0sV/.QS6l2OxY4BJnPPqLWKq', 'seller', '2025-09-27 12:05:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(51, 'soph', 'soph@gmail.com', '$2b$10$6fkKEPVRml6i6U8RPUE39.sVdmQdVNn1DvIjDvB7e5h/J7jA3KzLe', 'seller', '2025-09-27 12:08:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(53, 'kimberly', 'kimberly@gmail.com', '$2b$10$1W2cVva3AsF8cbtaQihKI.2hIut002hoRFpza8H4o7sPT8KrUhgDW', 'seller', '2025-09-27 12:10:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(54, 'rollan', 'rollan@gmail.com', '$2b$10$C9MPdW/HCvTNfimiFcjn7uRuvvJ5Guvcp6mNtVxP2pFHXG6o0vNCe', 'seller', '2025-09-27 13:38:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(55, 'ayoko na', 'ayoko@gmail.com', '$2b$10$j/2Z4/2xkWY3tA6CJ7rTi.KW3FotLAcUYSshdJiyx5NiZtj6TCnKe', 'seller', '2025-09-27 14:08:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(56, 'jp', 'jp@gmail.com', '$2b$10$FXnnCXvcS2FoeggvQGukoO9WkoMtLG6KFOpOgg86neNZg.0.911EK', 'seller', '2025-09-28 13:28:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(57, 'Sha', 'sha@gmail.com', '$2b$10$Ldven2LhAtXNdzKlL9pIXOkzrnSeHGlwquaVWbb7.DDU4tbH0ck5K', 'customer', '2025-09-29 01:30:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(58, 'erika', 'erika@gmail.com', '$2b$10$vS48gZpjSN8qrQy/e1EyceDCa6jnn.2E9srK09ChWJ.rqGN8.Cij.', 'seller', '2025-09-29 01:35:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(59, 'evan', 'evan@gmail.com', '$2b$10$nIfgHQ1QBdEe2dOrQI8pDerXet374kJlXlxtdD6XGrczKJVFUgsIW', 'seller', '2025-10-01 00:55:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(60, 'kimm', 'kimm@gmail.com', '$2b$10$TGWnhTCyKldY8E8bzwF55ugNhFIjZNZSXT3UKqBWgdVGBuWRTeENK', 'seller', '2025-10-02 05:31:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(61, 'van', 'van@gmail.com', '$2b$10$YzTV81v7nDYOB9D2b3kN4u8dIktzeHaAF/EZPh14vd/ekVILDXzcq', 'customer', '2025-10-02 07:22:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(62, 'ger', 'ger@gmail.com', '$2b$10$3md0f/sJeZRMg5uwCX9aQuktjFaBnCqC9PgJjKgjUlzbhYs9srOJG', 'customer', '2025-10-07 01:18:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(63, 'ka', 'ka@gmail.com', '$2b$10$Bg4n8a1vRT2GJJQf.kFgfuUxwOfAs/.IZoLlJaKAS6m1JLLQbU7mS', 'seller', '2025-10-07 01:51:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
(65, 'ss', 'ss@gmail.com', '$2b$10$/F1UPkAealMfmRxju66PXOEhAtatsOXlI4Q/BSzu/tdr8v.LpLND2', 'seller', '2025-10-07 02:11:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'rejected'),
(66, 'kiki', 'kiki@gmail.com', '$2b$10$PJ7shLQHSDh6bflaSM7DKe3x9ieYOUAfjBx5g8ScIUH8hLpFM32AW', 'seller', '2025-10-07 02:33:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'rejected'),
(67, 'kuku', 'kuku@gmail.com', '$2b$10$70VbZYyu4EpfPBORDMqZ/.wAuqqCbnDMvYrTA8ztJ9oq5oJUmO36i', 'seller', '2025-10-07 02:33:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`listing_id`),
  ADD KEY `seller_id` (`seller_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`pet_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_products_category` (`category_id`),
  ADD KEY `fk_products_seller` (`seller_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`reward_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `listing_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `pet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `reward_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listings_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listings_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_order_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `rewards`
--
ALTER TABLE `rewards`
  ADD CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rewards_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
