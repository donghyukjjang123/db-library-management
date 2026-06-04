-- 회원 500명

INSERT INTO users (name, email)
SELECT
    'User' || i,
    'user' || i || '@test.com'
FROM generate_series(1,500) AS s(i);

-- 도서 1000권

INSERT INTO books (title, author, publisher, available)
SELECT
    'Book ' || i,
    'Author ' || i,
    'Publisher ' || i,
    true
FROM generate_series(1,1000) AS s(i);

-- 대출 기록 10000건

INSERT INTO loans (user_id, book_id, loan_date, status)
SELECT
    floor(random()*500 + 1)::int,
    floor(random()*1000 + 1)::int,
    NOW() - (random()*365 || ' days')::interval,
    CASE
        WHEN random() < 0.7 THEN 'BORROWED'
        ELSE 'RETURNED'
    END
FROM generate_series(1,10000);