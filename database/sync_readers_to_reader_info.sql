USE library_system;

-- 修改reader_info表，使user_id字段可以为NULL
ALTER TABLE reader_info MODIFY COLUMN user_id INT NULL;

-- 将readers表中的数据同步到reader_info表中（跳过重复的身份证号）
INSERT INTO reader_info (user_id, reader_no, name, gender, id_card, email, credit_status, arrears_amount, create_time, update_time)
SELECT 
  NULL as user_id,
  r.reader_no,
  r.name,
  'male' as gender,
  r.id_card,
  r.email,
  CASE WHEN r.credit_status = 'normal' THEN 'good' ELSE r.credit_status END as credit_status,
  r.debt_amount as arrears_amount,
  r.created_at as create_time,
  r.updated_at as update_time
FROM readers r
WHERE NOT EXISTS (
  SELECT 1 FROM reader_info ri WHERE ri.reader_no = r.reader_no
)
AND NOT EXISTS (
  SELECT 1 FROM reader_info ri WHERE ri.id_card = r.id_card
);

-- 验证同步结果
SELECT ri.reader_no, ri.name, r.name as readers_name
FROM reader_info ri
LEFT JOIN readers r ON ri.reader_no = r.reader_no
WHERE ri.reader_no IN ('R2024001', 'R2024002', 'R2024003', 'R2024004', 'R2024005');