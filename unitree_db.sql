-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2025 at 11:23 AM
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(26, 5, 'groot1', 3, 1, '1758628487182.jpg', '1758628487182.png', '1758628487182.jpg', NULL, 0),
(28, 15, 'a', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(29, 15, 'a', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(30, 16, 'kulet1', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(32, 17, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(33, 20, 'mans', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(34, 21, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(35, 21, 'man', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(36, 22, 'asasas', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(37, 22, 'asasas', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(38, 23, 'tite', 1, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
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
(62, 43, 'blue', 1, 0, '1as.png', '2as.png', '3as.png', NULL, 0);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `category_id`, `created_at`) VALUES
(1, 'Wireless Mouse', 'Ergonomic wireless mouse with 2.4GHz USB receiver.', 599.00, 50, NULL, '2025-09-25 05:19:07'),
(2, 'Mechanical Keyboard', 'RGB backlit mechanical keyboard with blue switches.', 2499.00, 20, NULL, '2025-09-25 05:19:07'),
(3, 'USB-C Charger', 'Fast-charging 65W USB-C wall charger compatible with laptops and phones.', 999.00, 35, NULL, '2025-09-25 05:19:07'),
(4, 'Bluetooth Headphones', 'Over-ear noise-cancelling Bluetooth headphones with 20-hour battery life.', 3499.00, 15, NULL, '2025-09-25 05:19:07'),
(5, 'Smartphone Stand', 'Adjustable aluminum alloy desk stand for smartphones and tablets.', 399.00, 60, NULL, '2025-09-25 05:19:07'),
(6, 'Gaming Monitor', '27-inch FHD gaming monitor with 144Hz refresh rate.', 8999.00, 10, NULL, '2025-09-25 05:19:07'),
(7, 'External SSD 1TB', 'Portable high-speed external SSD with USB 3.2 interface.', 5999.00, 12, NULL, '2025-09-25 05:19:07'),
(8, 'Webcam 1080p', 'Full HD webcam with built-in microphone and privacy cover.', 1299.00, 25, NULL, '2025-09-25 05:19:07'),
(9, 'Portable Speaker', 'Compact Bluetooth speaker with waterproof design and 12-hour playtime.', 1799.00, 30, NULL, '2025-09-25 05:19:07'),
(10, 'Smartwatch', 'Fitness tracking smartwatch with heart-rate monitor and sleep tracking.', 2999.00, 18, NULL, '2025-09-25 05:19:07');

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
  `token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `created_at`, `token`) VALUES
(5, 'flint', 'flintaxl.celetaria@gmail.com', '$2b$10$nNlIhzJA9ja1ektzbApOee2U2zdk7tA7s.vZyZ3RKvtitq6NKUzuG', 'admin', '2025-09-23 02:12:36', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTg4NjkzNDZ9.lkqNAtklP8vZJu6zu0k14GDCeS_C31-H-BUUd2IVWwo'),
(6, 'bea', 'bea@gmail.com', '$2b$10$VvcXKPSLhVkcrT/Nb5a36eRquGTfFRO0sfv3oJkkMHwVaFpqBS0qG', 'customer', '2025-09-23 02:28:37', NULL),
(7, 'ash', 'ash@gmail.com', '$2b$10$Th0GH9.IPiSb5J.uWIJmaeSR.zSHRFPdsvJo6Lq3Rsr4lWrt2kURm', 'customer', '2025-09-23 02:33:36', NULL),
(10, 'gab1', 'gab@gmail.com', '$2b$10$.GsVcQs.dKSklYWBIFYfb.B6SM0UeToTyFhl2VhcWs7Gjt2vw39LK', 'customer', '2025-09-23 04:32:42', NULL),
(12, 'a', 'a@gmail.com', '$2b$10$R5Rphq8YYSQMeWhsnbb/TeS1ISchse29gKt4aJCbO/LYs23YnQZZm', 'customer', '2025-09-23 04:35:50', NULL),
(15, 'kim', 'kim@gmail.com', '$2b$10$VU45G1S23LalvwTpnmLRAOGeVzyHWRPEvKaLUrIL/dGc4rmcRGsDO', 'seller', '2025-09-23 14:09:37', NULL),
(16, 'bab', 'bab@gmail.com', '$2b$10$JR7USHa4BnULcRibeDGxzebMHmG8WgD6aW0EVpIXwFFMfSePV48tO', 'seller', '2025-09-23 14:21:25', NULL),
(17, 'lol', 'lol@gmail.com', '$2b$10$wMVaedIGbR8vEAMwhXfQAe7CTaWABOF2uk4hBQN.3wEdRtJcTUZsO', 'seller', '2025-09-23 14:40:11', NULL),
(20, 'lola', 'lola@gmail.com', '$2b$10$zmSA5KWCArw7EimmFSrdS.7.DouAdvgBLKPdZo5i.qiJYgmEEsWda', 'seller', '2025-09-23 14:42:22', NULL),
(21, 'pau', 'pau@gmail.com', '$2b$10$31s0PLx5neNqzOAvo4Pro.Ea5sTY387VihZpBHOZfFognt5EWJCey', 'seller', '2025-09-24 05:53:51', NULL),
(22, 'kc', 'kc@gmail.com', '$2b$10$a0ef96isa5ERfHlFTQCvg.KNrLU/cl3.m9uaV4XTeNrkxli0YDsg.', 'seller', '2025-09-24 05:56:01', NULL),
(23, 'juli', 'juli@gmail.com', '$2b$10$qgwBJUqHAzE/aEzEOCICCe6/oOCks8UA5D7uONqqct4PKkWYGWZq2', 'customer', '2025-09-25 05:28:31', ''),
(24, 'shelley', 'shelley@gmail.com', '$2b$10$zCU.XNLQLK9ucghKrwV8YuOqwKKeeEAXKR7dwCwqpyYTUHDJ20Mea', 'customer', '2025-09-25 05:39:45', ''),
(32, 'jet', 'jet@gmail.com', '$2b$10$k918lNAwTmuHJfjB7A4qh.HQhup/Wumgqe.5zfICXkSw7wxFOkH.u', 'customer', '2025-09-25 06:23:01', NULL),
(33, 'je', 'je', '$2b$10$bieJqWP05WxmQ1AcMBWEkekzmui19wOD/frnO.leojNiPSfh8auRK', 'customer', '2025-09-25 06:59:34', NULL),
(34, 'min', 'minggay@gmail.com', '$2b$10$bzOTzvrZmSu/REu8.DwOAeoRoED6VbVArEL6W5CuF/cgEJciIHmh6', 'customer', '2025-09-25 07:20:29', NULL),
(35, 'mari', 'mari@gmail.com', '$2b$10$QD0Rt3O.jPNl67xHojUZH.O7D7xZbjhL/FgYcTiaoAyZajVYduTXq', 'customer', '2025-09-26 03:32:28', NULL),
(36, 'eli', 'eli@gmail.com', '$2b$10$sKde3sa.W1iPXAX836acxuasI7olWOLRmoci/7zMZX0yfQXz0Hn36', 'customer', '2025-09-26 04:12:27', ''),
(38, 'butchi', 'butchi@gmail.com', '$2b$10$VPbmqyBA4KRzsiEtZ1fSr./UfhoXCz1ZQ4v4VyOYKFnurnW7ovUfy', 'customer', '2025-09-26 04:39:02', NULL),
(39, 'lili', 'lili@gmail.com', '$2b$10$ow.GpMzMoz6mpC90bnWDFO6lTcuzdkItVwi/KkyL1NR0Jq2VyDbS2', 'customer', '2025-09-26 04:42:44', ''),
(40, 'mimi', 'mimi@gmail.com', '$2b$10$gD2gAFPM9C50E2AH6.bhnuFPHltwlVaHnmB/1hWVW3Ji1y9i4/uwC', 'customer', '2025-09-26 04:52:03', NULL),
(41, 'mimiyuh', 'mimiyuh@gmail.com', '$2b$10$Hb/q3BaFXMrqKoxwf2cSi.xG1mhVl6/mUfPybSiAGJbaik9yIfDgS', 'customer', '2025-09-26 04:55:07', NULL),
(42, 'taylor', 'taylor@gmail.com', '$2b$10$5ZGVNcbB.eTqa8E5b81a/OZMSPw0SiKetJ0G5KY601gu8MGnu/ME6', 'customer', '2025-09-26 04:58:55', ''),
(43, 'candy', 'candy@gmail.com', '$2b$10$6iPe8vrDEtOOo6t/nlms3uCuWZzLLnc96i5ROAYc9awGGuWEEEbUa', 'customer', '2025-09-26 06:24:34', '');

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
  ADD KEY `fk_products_category` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_id` (`product_id`);

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
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `pet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

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
