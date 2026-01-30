USE library_system;

-- 更新reader_info表中的reader_no，使其与readers表中的reader_no对应
UPDATE reader_info ri
SET ri.reader_no = (
  SELECT r.reader_no
  FROM readers r
  WHERE r.id_card = ri.id_card
)
WHERE EXISTS (
  SELECT 1 FROM readers r WHERE r.id_card = ri.id_card AND r.reader_no != ri.reader_no
);

-- 验证更新结果
SELECT ri.reader_no, ri.name, r.name as readers_name, ri.id_card
FROM reader_info ri
LEFT JOIN readers r ON ri.reader_no = r.reader_no
WHERE ri.id_card IN ('110101199001011234', '110101199002022345', '110101199003033456', '110101199004044567', '110101199005055678');