CREATE DATABASE IF NOT EXISTS library_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE library_system;

DROP TABLE IF EXISTS `operation_logs`;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `borrow_records`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `readers`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'librarian') NOT NULL DEFAULT 'librarian',
  `real_name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20),
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (`username`),
  INDEX idx_role (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_category_name (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `readers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `reader_no` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100),
  `id_card` VARCHAR(18),
  `credit_status` ENUM('normal', 'overdue', 'debt') NOT NULL DEFAULT 'normal',
  `max_borrow_count` INT NOT NULL DEFAULT 5,
  `max_borrow_days` INT NOT NULL DEFAULT 30,
  `current_borrow_count` INT NOT NULL DEFAULT 0,
  `debt_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reader_no (`reader_no`),
  INDEX idx_phone (`phone`),
  INDEX idx_credit_status (`credit_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `books` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `isbn` VARCHAR(20) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `publisher` VARCHAR(100),
  `publish_date` DATE,
  `price` DECIMAL(10, 2),
  `category_id` INT NOT NULL,
  `total_count` INT NOT NULL DEFAULT 1,
  `available_count` INT NOT NULL DEFAULT 1,
  `borrow_count` INT NOT NULL DEFAULT 0,
  `location` VARCHAR(50),
  `description` TEXT,
  `cover` VARCHAR(255),
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_isbn (`isbn`),
  INDEX idx_title (`title`),
  INDEX idx_author (`author`),
  INDEX idx_category_id (`category_id`),
  CONSTRAINT fk_book_category FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `borrow_records` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `borrow_no` VARCHAR(30) NOT NULL UNIQUE,
  `reader_id` INT NOT NULL,
  `book_id` INT NOT NULL,
  `borrow_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` TIMESTAMP NOT NULL,
  `return_date` TIMESTAMP NULL,
  `renew_count` INT NOT NULL DEFAULT 0,
  `max_renew_count` INT NOT NULL DEFAULT 2,
  `status` ENUM('borrowed', 'returned', 'overdue') NOT NULL DEFAULT 'borrowed',
  `overdue_days` INT NOT NULL DEFAULT 0,
  `fine_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `fine_paid` TINYINT NOT NULL DEFAULT 0,
  `operator_id` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_borrow_no (`borrow_no`),
  INDEX idx_reader_id (`reader_id`),
  INDEX idx_book_id (`book_id`),
  INDEX idx_status (`status`),
  INDEX idx_borrow_date (`borrow_date`),
  CONSTRAINT fk_borrow_reader FOREIGN KEY (`reader_id`) REFERENCES `readers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_borrow_book FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_borrow_operator FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `appointments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `appointment_no` VARCHAR(30) NOT NULL UNIQUE,
  `reader_id` INT NOT NULL,
  `book_id` INT NOT NULL,
  `appointment_date` TIMESTAMP NOT NULL,
  `completed_date` TIMESTAMP NULL,
  `cancelled_date` TIMESTAMP NULL,
  `status` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `reminder_sent` TINYINT NOT NULL DEFAULT 0,
  `operator_id` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_appointment_no (`appointment_no`),
  INDEX idx_reader_id (`reader_id`),
  INDEX idx_book_id (`book_id`),
  INDEX idx_status (`status`),
  INDEX idx_appointment_date (`appointment_date`),
  CONSTRAINT fk_appointment_reader FOREIGN KEY (`reader_id`) REFERENCES `readers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_appointment_book FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_appointment_operator FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `operation_logs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `username` VARCHAR(50),
  `module` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255),
  `ip_address` VARCHAR(50),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (`user_id`),
  INDEX idx_module (`module`),
  INDEX idx_created_at (`created_at`),
  CONSTRAINT fk_log_user FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`username`, `password`, `role`, `real_name`, `phone`, `status`) VALUES
('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'librarian1', '13800138000', 1),
('librarian1', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'librarian', 'librarian2', '13800138001', 1),
('librarian2', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'librarian', 'librarian3', '13800138002', 1);

UPDATE `users` SET `role` = 'admin' WHERE `username` = 'admin';

INSERT INTO `categories` (`category_name`, `description`) VALUES
('Computer', 'Computer Science and Technology'),
('Literature', 'Literature and Fiction'),
('History', 'History and Humanities'),
('Philosophy', 'Philosophy and Thought'),
('Economics', 'Economics and Management'),
('Art', 'Art and Design'),
('Science', 'Natural Science'),
('Education', 'Education and Learning');

INSERT INTO `readers` (`reader_no`, `name`, `phone`, `email`, `id_card`, `credit_status`, `max_borrow_count`, `max_borrow_days`, `current_borrow_count`, `debt_amount`, `status`) VALUES
('R2024001', 'Zhang San', '13900000001', 'zhangsan@example.com', '110101199001011234', 'normal', 5, 30, 0, 0.00, 1),
('R2024002', 'Li Si', '13900000002', 'lisi@example.com', '110101199002022345', 'normal', 5, 30, 0, 0.00, 1),
('R2024003', 'Wang Wu', '13900000003', 'wangwu@example.com', '110101199003033456', 'normal', 5, 30, 0, 0.00, 1),
('R2024004', 'Zhao Liu', '13900000004', 'zhaoliu@example.com', '110101199004044567', 'normal', 5, 30, 0, 0.00, 1),
('R2024005', 'Sun Qi', '13900000005', 'sunqi@example.com', '110101199005055678', 'normal', 5, 30, 0, 0.00, 1);

INSERT INTO `books` (`isbn`, `title`, `author`, `publisher`, `publish_date`, `price`, `category_id`, `total_count`, `available_count`, `borrow_count`, `location`, `description`, `status`) VALUES
('9787111111111', 'JavaScript高级程序设计', 'Nicholas C. Zakas', 'Posts & Telecom Press', '2020-09-01', 99.00, 1, 5, 5, 0, 'A-01', 'JavaScript Tutorial', 1),
('9787111111112', '深入理解计算机系统', 'Randal E. Bryant', 'China Machine Press', '2019-11-01', 139.00, 1, 3, 3, 0, 'A-02', 'Computer System Principles', 1),
('9787111111113', '算法导论', 'Thomas H. Cormen', 'China Machine Press', '2018-01-01', 128.00, 1, 4, 4, 0, 'A-03', 'Algorithm Design and Analysis', 1),
('9787111111114', '红楼梦', '曹雪芹', 'People Literature Publishing House', '2021-03-01', 68.00, 2, 10, 10, 0, 'B-01', 'Chinese Classical Literature', 1),
('9787111111115', '三国演义', '罗贯中', 'People Literature Publishing House', '2021-04-01', 58.00, 2, 8, 8, 0, 'B-02', 'Chinese Classical Literature', 1),
('9787111111116', '西游记', '吴承恩', 'People Literature Publishing House', '2021-05-01', 55.00, 2, 8, 8, 0, 'B-03', 'Chinese Classical Literature', 1),
('9787111111117', '水浒传', '施耐庵', 'People Literature Publishing House', '2021-06-01', 60.00, 2, 8, 8, 0, 'B-04', 'Chinese Classical Literature', 1),
('9787111111118', '史记', '司马迁', 'Zhonghua Book Company', '2020-08-01', 128.00, 3, 5, 5, 0, 'C-01', 'Chinese History Classics', 1),
('9787111111119', '资治通鉴', '司马光', 'Zhonghua Book Company', '2020-09-01', 168.00, 3, 4, 4, 0, 'C-02', 'Chinese History Classics', 1),
('9787111111120', '论语', '孔子', 'Zhonghua Book Company', '2019-10-01', 38.00, 4, 6, 6, 0, 'D-01', 'Confucian Classics', 1);

INSERT INTO `appointments` (`appointment_no`, `reader_id`, `book_id`, `appointment_date`, `status`, `operator_id`) VALUES
('A1700000000001', 1, 1, '2024-02-01 10:00:00', 'completed', 1),
('A1700000000002', 2, 2, '2024-02-05 14:00:00', 'completed', 1),
('A1700000000003', 3, 3, '2024-02-10 09:00:00', 'pending', 1),
('A1700000000004', 4, 4, '2024-02-15 11:00:00', 'pending', 1),
('A1700000000005', 5, 5, '2024-02-20 15:00:00', 'cancelled', 1);
