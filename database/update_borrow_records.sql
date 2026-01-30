USE library_system;

-- 1. 删除外键约束
ALTER TABLE borrow_records DROP FOREIGN KEY fk_borrow_reader;

-- 2. 修改borrow_records表的reader_id字段类型
ALTER TABLE borrow_records MODIFY COLUMN reader_id VARCHAR(20) NOT NULL;

-- 3. 更新borrow_records表中的数据，将reader_id从数字ID改为对应的reader_no
UPDATE borrow_records br
SET br.reader_id = (
  SELECT r.reader_no
  FROM readers r
  WHERE r.id = CAST(br.reader_id AS UNSIGNED)
)
WHERE br.reader_id REGEXP '^[0-9]+$';

-- 4. 添加新的外键约束，关联到reader_info表
ALTER TABLE borrow_records ADD CONSTRAINT fk_borrow_reader_info FOREIGN KEY (reader_id) REFERENCES reader_info(reader_no) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 5. 验证更新结果
SELECT br.borrow_no, br.reader_id, ri.name as reader_name, ri.reader_no
FROM borrow_records br
LEFT JOIN reader_info ri ON br.reader_id = ri.reader_no
LIMIT 10;