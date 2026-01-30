USE library_system;

-- 更新图书名字为中文
UPDATE `books` SET `title` = 'JavaScript高级程序设计' WHERE `isbn` = '9787111111111';
UPDATE `books` SET `title` = '深入理解计算机系统' WHERE `isbn` = '9787111111112';
UPDATE `books` SET `title` = '算法导论' WHERE `isbn` = '9787111111113';

-- 查看更新结果
SELECT `id`, `isbn`, `title`, `author`, `publisher` FROM `books`;