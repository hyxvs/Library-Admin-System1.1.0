USE library_system;

-- 添加更多用户数据
INSERT INTO `users` (`username`, `password`, `role`, `real_name`, `phone`, `status`) VALUES
('librarian3', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'librarian', 'librarian4', '13800138003', 1),
('librarian4', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'librarian', 'librarian5', '13800138004', 1);

-- 添加更多分类数据
INSERT INTO `categories` (`category_name`, `description`) VALUES
('Medicine', 'Medicine and Healthcare'),
('Engineering', 'Engineering and Technology'),
('Law', 'Law and Legal Studies'),
('Psychology', 'Psychology and Mental Health');

-- 添加更多读者数据
INSERT INTO `readers` (`reader_no`, `name`, `phone`, `email`, `id_card`, `credit_status`, `max_borrow_count`, `max_borrow_days`, `current_borrow_count`, `debt_amount`, `status`) VALUES
('R2024006', 'Chen Ba', '13900000006', 'chenba@example.com', '110101199006066789', 'normal', 5, 30, 0, 0.00, 1),
('R2024007', 'Liu Jiu', '13900000007', 'liujin@example.com', '110101199007077890', 'normal', 5, 30, 0, 0.00, 1),
('R2024008', 'Zhao Shi', '13900000008', 'zhaoshi@example.com', '110101199008088901', 'normal', 5, 30, 0, 0.00, 1),
('R2024009', 'Wu Shiyi', '13900000009', 'wushiyi@example.com', '110101199009099012', 'normal', 5, 30, 0, 0.00, 1),
('R2024010', 'Zheng Ershi', '13900000010', 'zhengerling@example.com', '110101199010100123', 'normal', 5, 30, 0, 0.00, 1);

-- 添加更多图书数据
INSERT INTO `books` (`isbn`, `title`, `author`, `publisher`, `publish_date`, `price`, `category_id`, `total_count`, `available_count`, `borrow_count`, `location`, `description`, `status`) VALUES
('9787111111121', '计算机网络', '谢希仁', '电子工业出版社', '2021-01-01', 68.00, 1, 5, 5, 0, 'A-04', '计算机网络教程', 1),
('9787111111122', '操作系统原理', '汤小丹', '西安电子科技大学出版社', '2020-08-01', 58.00, 1, 4, 4, 0, 'A-05', '操作系统原理教程', 1),
('9787111111123', '数据库系统概论', '王珊', '高等教育出版社', '2021-03-01', 78.00, 1, 5, 5, 0, 'A-06', '数据库系统教程', 1),
('9787111111124', '活着', '余华', '作家出版社', '2020-05-01', 38.00, 2, 8, 8, 0, 'B-05', '当代文学小说', 1),
('9787111111125', '围城', '钱钟书', '人民文学出版社', '2020-07-01', 45.00, 2, 6, 6, 0, 'B-06', '现代文学小说', 1),
('9787111111126', '中国通史', '白寿彝', '上海人民出版社', '2019-12-01', 198.00, 3, 3, 3, 0, 'C-03', '中国历史通史', 1),
('9787111111127', '西方哲学史', '罗素', '商务印书馆', '2020-09-01', 128.00, 4, 4, 4, 0, 'D-02', '西方哲学通史', 1),
('9787111111128', '经济学原理', '曼昆', '北京大学出版社', '2021-02-01', 89.00, 5, 5, 5, 0, 'E-01', '经济学入门教程', 1),
('9787111111129', '艺术概论', '王宏建', '文化艺术出版社', '2020-06-01', 58.00, 6, 4, 4, 0, 'F-01', '艺术理论教程', 1),
('9787111111130', '自然科学概论', '张功耀', '中南大学出版社', '2021-04-01', 68.00, 7, 3, 3, 0, 'G-01', '自然科学入门', 1);

-- 添加借阅记录数据
INSERT INTO `borrow_records` (`borrow_no`, `reader_id`, `book_id`, `borrow_date`, `due_date`, `return_date`, `renew_count`, `max_renew_count`, `status`, `overdue_days`, `fine_amount`, `fine_paid`, `operator_id`) VALUES
('B1700000000001', 1, 1, '2024-01-01 10:00:00', '2024-01-31 10:00:00', '2024-01-25 14:00:00', 0, 2, 'returned', 0, 0.00, 0, 1),
('B1700000000002', 2, 2, '2024-01-05 14:00:00', '2024-02-04 14:00:00', '2024-02-01 10:00:00', 0, 2, 'returned', 0, 0.00, 0, 1),
('B1700000000003', 3, 3, '2024-01-10 09:00:00', '2024-02-09 09:00:00', NULL, 1, 2, 'borrowed', 0, 0.00, 0, 1),
('B1700000000004', 4, 4, '2024-01-15 11:00:00', '2024-02-14 11:00:00', NULL, 0, 2, 'borrowed', 0, 0.00, 0, 1),
('B1700000000005', 5, 5, '2024-01-20 15:00:00', '2024-02-19 15:00:00', '2024-02-25 10:00:00', 0, 2, 'returned', 6, 12.00, 1, 1),
('B1700000000006', 1, 6, '2024-01-25 10:00:00', '2024-02-24 10:00:00', NULL, 0, 2, 'borrowed', 0, 0.00, 0, 1),
('B1700000000007', 2, 7, '2024-01-30 14:00:00', '2024-03-01 14:00:00', NULL, 0, 2, 'borrowed', 0, 0.00, 0, 1),
('B1700000000008', 3, 8, '2024-02-05 09:00:00', '2024-03-06 09:00:00', NULL, 0, 2, 'borrowed', 0, 0.00, 0, 1),
('B1700000000009', 4, 9, '2024-02-10 11:00:00', '2024-03-11 11:00:00', NULL, 0, 2, 'borrowed', 0, 0.00, 0, 1),
('B1700000000010', 5, 10, '2024-02-15 15:00:00', '2024-03-16 15:00:00', NULL, 0, 2, 'borrowed', 0, 0.00, 0, 1);

-- 添加更多预约记录数据
INSERT INTO `appointments` (`appointment_no`, `reader_id`, `book_id`, `appointment_date`, `completed_date`, `cancelled_date`, `status`, `reminder_sent`, `operator_id`) VALUES
('A1700000000006', 1, 11, '2024-02-25 10:00:00', '2024-02-26 14:00:00', NULL, 'completed', 1, 1),
('A1700000000007', 2, 12, '2024-02-26 14:00:00', NULL, '2024-02-27 10:00:00', 'cancelled', 0, 1),
('A1700000000008', 3, 13, '2024-02-27 09:00:00', NULL, NULL, 'pending', 0, 1),
('A1700000000009', 4, 14, '2024-02-28 11:00:00', NULL, NULL, 'pending', 1, 1),
('A1700000000010', 5, 15, '2024-02-29 15:00:00', NULL, NULL, 'pending', 0, 1);

-- 添加操作日志数据
INSERT INTO `operation_logs` (`user_id`, `username`, `module`, `action`, `description`, `ip_address`) VALUES
(1, 'admin', 'users', 'create', '创建新用户 librarian3', '192.168.1.100'),
(1, 'admin', 'users', 'create', '创建新用户 librarian4', '192.168.1.100'),
(1, 'admin', 'categories', 'create', '创建新分类 Medicine', '192.168.1.100'),
(1, 'admin', 'categories', 'create', '创建新分类 Engineering', '192.168.1.100'),
(1, 'admin', 'categories', 'create', '创建新分类 Law', '192.168.1.100'),
(1, 'admin', 'categories', 'create', '创建新分类 Psychology', '192.168.1.100'),
(2, 'librarian1', 'readers', 'create', '创建新读者 Chen Ba', '192.168.1.101'),
(2, 'librarian1', 'readers', 'create', '创建新读者 Liu Jiu', '192.168.1.101'),
(2, 'librarian1', 'books', 'create', '创建新图书 计算机网络', '192.168.1.101'),
(2, 'librarian1', 'books', 'create', '创建新图书 操作系统原理', '192.168.1.101'),
(2, 'librarian1', 'borrow', 'create', '创建新借阅记录 B1700000000001', '192.168.1.101'),
(2, 'librarian1', 'borrow', 'update', '更新借阅记录 B1700000000001 为已归还', '192.168.1.101'),
(2, 'librarian1', 'appointment', 'create', '创建新预约记录 A1700000000001', '192.168.1.101'),
(2, 'librarian1', 'appointment', 'update', '更新预约记录 A1700000000001 为已完成', '192.168.1.101'),
(2, 'librarian1', 'appointment', 'update', '更新预约记录 A1700000000005 为已取消', '192.168.1.101');

-- 更新图书的可借数量和借阅次数
UPDATE `books` b
JOIN (
  SELECT `book_id`, COUNT(*) as borrow_count
  FROM `borrow_records`
  WHERE `status` = 'returned'
  GROUP BY `book_id`
) br ON b.id = br.book_id
SET b.borrow_count = br.borrow_count;

-- 更新图书的可借数量
UPDATE `books` SET available_count = total_count - (
  SELECT COUNT(*) FROM `borrow_records` 
  WHERE `book_id` = books.id AND `status` = 'borrowed'
);

-- 查看所有表的数据量
SELECT 'users' as table_name, COUNT(*) as count FROM `users` UNION ALL
SELECT 'categories' as table_name, COUNT(*) as count FROM `categories` UNION ALL
SELECT 'readers' as table_name, COUNT(*) as count FROM `readers` UNION ALL
SELECT 'books' as table_name, COUNT(*) as count FROM `books` UNION ALL
SELECT 'borrow_records' as table_name, COUNT(*) as count FROM `borrow_records` UNION ALL
SELECT 'appointments' as table_name, COUNT(*) as count FROM `appointments` UNION ALL
SELECT 'operation_logs' as table_name, COUNT(*) as count FROM `operation_logs`;