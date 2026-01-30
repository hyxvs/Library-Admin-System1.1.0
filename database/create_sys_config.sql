USE library_system;

CREATE TABLE IF NOT EXISTS sys_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  value VARCHAR(255),
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO sys_config (`key`, value, description) VALUES
('library_name', 'Library Management System', 'Library Name'),
('max_borrow_days', '30', 'Max Borrow Days'),
('max_borrow_count', '5', 'Max Borrow Count'),
('max_renew_count', '1', 'Max Renew Count'),
('fine_per_day', '0.5', 'Fine Per Day'),
('reservation_limit', '3', 'Reservation Limit');