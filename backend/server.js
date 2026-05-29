const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "hyuk",
    host: "localhost",
    database: "library_db",
    port: 5432
});

app.get("/", (req, res) => {
    res.send("Library Management Server is Running!");
});

app.get("/books", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM books ORDER BY book_id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY user_id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/loans", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                loans.loan_id,
                users.name AS user_name,
                books.title AS book_title,
                loans.loan_date,
                loans.return_date,
                loans.status
            FROM loans
            JOIN users ON loans.user_id = users.user_id
            JOIN books ON loans.book_id = books.book_id
            ORDER BY loans.loan_id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/users/:id/loans", async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT
                loans.loan_id,
                users.name AS user_name,
                books.title AS book_title,
                loans.loan_date,
                loans.status
             FROM loans
             JOIN users ON loans.user_id = users.user_id
             JOIN books ON loans.book_id = books.book_id
             WHERE users.user_id = $1
               AND loans.status = 'BORROWED'
             ORDER BY loans.loan_date DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/loans", async (req, res) => {
    const { user_id, book_id } = req.body;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const bookResult = await client.query(
            "SELECT available FROM books WHERE book_id = $1",
            [book_id]
        );
        if (bookResult.rows.length === 0) {
            throw new Error("Book not found");
        }
        if (bookResult.rows[0].available === false) {
            throw new Error("이미 대출 중인 도서입니다.");
        }

        const countResult = await client.query(
            `SELECT COUNT(*) AS borrowed_count
            FROM loans
            WHERE user_id = $1
            AND status = 'BORROWED'`,
            [user_id]
        );

        const borrowedCount = Number(countResult.rows[0].borrowed_count);

        if (borrowedCount >= 2) {
            throw new Error("회원당 최대 2권까지 대출할 수 있습니다.");
        }
        const loanResult = await client.query(
            `INSERT INTO loans (user_id, book_id, status)
             VALUES ($1, $2, 'BORROWED')
             RETURNING *`,
            [user_id, book_id]
        );
        await client.query(
            "UPDATE books SET available = false WHERE book_id = $1",
            [book_id]
        );
        await client.query("COMMIT");
        res.status(201).json(loanResult.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
});


app.put("/loans/:id/return", async (req, res) => {
    const loanId = req.params.id;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const loanResult = await client.query(
            "SELECT book_id, status FROM loans WHERE loan_id = $1",
            [loanId]
        );

        if (loanResult.rows.length === 0) {
            throw new Error("Loan not found");
        }

        if (loanResult.rows[0].status === "RETURNED") {
            throw new Error("Book is already returned");
        }

        const bookId = loanResult.rows[0].book_id;

        const returnResult = await client.query(
            `UPDATE loans
             SET return_date = CURRENT_TIMESTAMP,
                 status = 'RETURNED'
             WHERE loan_id = $1
             RETURNING *`,
            [loanId]
        );

        await client.query(
            "UPDATE books SET available = true WHERE book_id = $1",
            [bookId]
        );

        await client.query("COMMIT");

        res.json(returnResult.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
});

const PORT = 3000;

app.get("/books/search/:keyword", async (req, res) => {
    const keyword = req.params.keyword;

    try {
        const result = await pool.query(
            `SELECT *
             FROM books
             WHERE title ILIKE $1
             ORDER BY book_id`,
            [`%${keyword}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "검색 실패" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/books", async (req, res) => {
    const { title, author, publisher } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO books (title, author, publisher)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [title, author, publisher]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "도서 추가 실패" });
    }
});