USE library_system;

-- 检查 operation_logs 表是否存在
SHOW TABLES LIKE 'operation_logs';

-- 如果存在，查看表结构
DESCRIBE operation_logs;

-- 查看表中的数据
SELECT * FROM operation_logs LIMIT 10;