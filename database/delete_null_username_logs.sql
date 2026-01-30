USE library_system;

-- 查看当前 operation_logs 表中 username 为 null 的记录数量
SELECT COUNT(*) AS null_username_count
FROM operation_logs
WHERE username IS NULL;

-- 删除 operation_logs 表中 username 为 null 的记录
DELETE FROM operation_logs
WHERE username IS NULL;

-- 验证删除结果，查看剩余记录数量
SELECT COUNT(*) AS remaining_count
FROM operation_logs;

-- 查看删除后的前 10 条记录，确保没有 username 为 null 的记录
SELECT * FROM operation_logs
LIMIT 10;