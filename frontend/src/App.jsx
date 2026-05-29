import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchLoans();
  }, []);

  const fetchBooks = () => {
    axios.get("http://localhost:3000/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchLoans = () => {
    axios.get("http://localhost:3000/loans")
      .then((response) => {
        setLoans(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const borrowBook = async (bookId) => {
    try {
      await axios.post("http://localhost:3000/loans", {
        user_id: 1,
        book_id: bookId,
      });

      fetchBooks();
      fetchLoans();

      alert("대출 성공!");
    } catch (error) {
      console.error(error);
      alert("대출 실패");
    }
  };

  const returnBook = async (loanId) => {
    try {
      await axios.put(`http://localhost:3000/loans/${loanId}/return`);

      fetchBooks();
      fetchLoans();

      alert("반납 성공!");
    } catch (error) {
      console.error(error);
      alert("반납 실패");
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Library Management System</h1>

      <h2>도서 목록</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>저자</th>
            <th>대출 가능</th>
            <th>기능</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.book_id}>
              <td>{book.book_id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.available ? "가능" : "대출중"}</td>
              <td>
                {book.available && (
                  <button
                    onClick={() => borrowBook(book.book_id)}
                  >
                    대출
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2>대출 현황</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>대출 ID</th>
            <th>회원명</th>
            <th>도서명</th>
            <th>상태</th>
            <th>대출일</th>
            <th>기능</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((loan) => (
            <tr key={loan.loan_id}>
              <td>{loan.loan_id}</td>
              <td>{loan.user_name}</td>
              <td>{loan.book_title}</td>
              <td>{loan.status}</td>
              <td>{new Date(loan.loan_date).toLocaleString()}</td>
              <td>
                {loan.status === "BORROWED" && (
                  <button onClick={() => returnBook(loan.loan_id)}>
                    반납
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;