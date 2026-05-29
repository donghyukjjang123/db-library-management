-- 1. 전체 도서 조회
SELECT * FROM books;

-- 2. 대출 가능한 도서 조회
SELECT *
FROM books
WHERE available = true;

-- 3. 현재 대출 중인 목록 조회
SELECT
    loans.loan_id,
    users.name AS user_name,
    books.title AS book_title,
    loans.loan_date,
    loans.status
FROM loans
JOIN users ON loans.user_id = users.user_id
JOIN books ON loans.book_id = books.book_id
WHERE loans.status = 'BORROWED';

-- 4. 특정 회원의 대출 목록 조회
SELECT
    users.name,
    books.title,
    loans.loan_date,
    loans.return_date,
    loans.status
FROM loans
JOIN users ON loans.user_id = users.user_id
JOIN books ON loans.book_id = books.book_id
WHERE users.user_id = 1;

-- 5. 책 대출 Transaction 예시
BEGIN;

INSERT INTO loans (user_id, book_id, status)
VALUES (3, 2, 'BORROWED');

UPDATE books
SET available = false
WHERE book_id = 2;

COMMIT;

-- 6. 책 반납 Transaction 예시
BEGIN;

UPDATE loans
SET return_date = CURRENT_TIMESTAMP,
    status = 'RETURNED'
WHERE loan_id = 1;

UPDATE books
SET available = true
WHERE book_id = 1;

COMMIT;