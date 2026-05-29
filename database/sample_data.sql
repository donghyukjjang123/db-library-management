INSERT INTO users (name, email) VALUES
('김민수', 'minsu@example.com'),
('이서연', 'seoyeon@example.com'),
('박지훈', 'jihoon@example.com'),
('최유진', 'yujin@example.com'),
('정현우', 'hyunwoo@example.com');

INSERT INTO books (title, author, publisher) VALUES
('데이터베이스 개론', '김연희', '한빛아카데미'),
('운영체제', 'Abraham Silberschatz', 'Wiley'),
('컴퓨터 네트워크', 'James Kurose', 'Pearson'),
('자바스크립트 입문', '윤인성', '한빛미디어'),
('PostgreSQL 실습', '홍길동', 'DB Press'),
('인공지능 개론', 'Andrew Ng', 'AI Press'),
('자료구조', 'Mark Allen Weiss', 'Pearson'),
('알고리즘', 'Thomas Cormen', 'MIT Press'),
('웹 프로그래밍', '김철수', 'IT Books'),
('리액트 실전', '이영희', 'Frontend Press');

INSERT INTO loans (user_id, book_id, status) VALUES
(1, 1, 'BORROWED'),
(2, 3, 'BORROWED'),
(3, 6, 'BORROWED'),
(4, 8, 'BORROWED');

UPDATE books
SET available = false
WHERE book_id IN (1, 3, 6, 8);