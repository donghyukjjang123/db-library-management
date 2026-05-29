import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [userLoans, setUserLoans] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newPublisher, setNewPublisher] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchLoans();
    fetchUsers();
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


  const searchBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/books/search/${searchKeyword}`
      );

      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetBooks = () => {
    setSearchKeyword("");
    fetchBooks();
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

  const fetchUserLoans = (userId) => {
    axios.get(`http://localhost:3000/users/${userId}/loans`)
      .then((response) => {
        setUserLoans(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchUsers = () => {
    axios.get("http://localhost:3000/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const borrowBook = async (bookId) => {
    try {
      await axios.post("http://localhost:3000/loans", {
        user_id: selectedUserId,
        book_id: bookId,
      });

      fetchBooks();
      fetchLoans();
      fetchUserLoans(selectedUserId);

      alert("대출 완료");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.error || "대출 실패";

      alert(message);
    }
  };

  const returnBook = async (loanId) => {
    try {
      await axios.put(`http://localhost:3000/loans/${loanId}/return`);

      fetchBooks();
      fetchLoans();
      fetchUserLoans(selectedUserId);

      alert("반납 성공!");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.error || "반납 실패";

      alert(message);
    }
  };

  const addBook = async () => {
    try {
      await axios.post("http://localhost:3000/books", {
        title: newTitle,
        author: newAuthor,
        publisher: newPublisher,
      });

      setNewTitle("");
      setNewAuthor("");
      setNewPublisher("");

      fetchBooks();

      alert("도서 추가 성공!");
    } catch (error) {
      console.error(error);
      alert("도서 추가 실패");
    }
};

  return (
    <div className="container">
      <h1>📚 Library Management System</h1>
      
      <div>
        <label>대출 회원 선택: </label>
        <select
          value={selectedUserId}
          onChange={(e) => {
            const userId = Number(e.target.value);
            setSelectedUserId(userId);
            fetchUserLoans(userId);
          }}
        >
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <h2>선택 회원 대출 현황</h2>
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
          {userLoans.map((loan) => (
            <tr key={loan.loan_id}>
              <td>{loan.loan_id}</td>
              <td>{loan.user_name}</td>
              <td>{loan.book_title}</td>
              <td className="borrowed">{loan.status}</td>
              <td>{new Date(loan.loan_date).toLocaleString()}</td>
              <td>
                <button onClick={() => returnBook(loan.loan_id)}>
                  반납
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>도서 검색</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="도서명 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <button onClick={searchBooks}>
          검색
        </button>

        <button onClick={resetBooks}>
          전체보기
        </button>
      </div>
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
              <td className={book.available ? "available" : "borrowed"}>
                {book.available ? "가능" : "대출중"}
              </td>
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
      <h2>도서 추가</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="도서명"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="저자"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />

        <input
          type="text"
          placeholder="출판사"
          value={newPublisher}
          onChange={(e) => setNewPublisher(e.target.value)}
        />

        <button onClick={addBook}>
          도서 추가
        </button>
      </div>

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
              <td className={loan.status === "RETURNED" ? "returned" : "borrowed"}>
                {loan.status}
              </td>
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