USE library_system;

-- 将readers表中缺失的读者数据插入到reader_info表中
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
WHERE r.reader_no IN ('R2024002', 'R2024003', 'R2024004', 'R2024005')
AND NOT EXISTS (
  SELECT 1 FROM reader_info ri WHERE ri.reader_no = r.reader_no
);

-- 验证插入结果
SELECT ri.reader_no, ri.name, r.name as readers_name
FROM reader_info ri
LEFT JOIN readers r ON ri.reader_no = r.reader_no
WHERE ri.reader_no IN ('R2024001', 'R2024002', 'R2024003', 'R2024004', 'R2024005');