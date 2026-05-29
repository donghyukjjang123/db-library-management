INSERT INTO users (name, email) VALUES
('김민수', 'minsu@example.com'),
('이서연', 'seoyeon@example.com'),
('박지훈', 'jihoon@example.com');

INSERT INTO books (title, author, publisher) VALUES
('데이터베이스 개론', '김연희', '한빛아카데미'),
('운영체제', 'Abraham Silberschatz', 'Wiley'),
('컴퓨터 네트워크', 'James Kurose', 'Pearson'),
('자바스크립트 입문', '윤인성', '한빛미디어'),
('PostgreSQL 실습', '홍길동', 'DB Press');

INSERT INTO loans (user_id, book_id, status) VALUES
(1, 1, 'BORROWED'),
(2, 3, 'BORROWED');

UPDATE books
SET available = false
WHERE book_id IN (1, 3);
