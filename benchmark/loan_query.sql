SELECT
    users.name,
    books.title,
    loans.loan_date,
    loans.status
FROM loans
JOIN users ON loans.user_id = users.user_id
JOIN books ON loans.book_id = books.book_id
WHERE loans.status = 'BORROWED';