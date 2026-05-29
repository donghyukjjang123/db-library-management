# Library Management System

PostgreSQL을 활용한 도서 대출 관리 웹 서비스입니다.

## 프로젝트 개요

본 프로젝트는 React, Express, PostgreSQL을 이용하여 구현한 도서 대출 관리 시스템입니다.

사용자는 도서를 조회, 검색, 대출, 반납할 수 있으며 회원별 대출 현황을 확인할 수 있습니다.

## 기술 스택

### Frontend
- React
- Axios
- Vite

### Backend
- Node.js
- Express

### Database
- PostgreSQL

---

## 데이터베이스 설계

### Users

| Column | Description |
|----------|----------|
| user_id | 회원 ID (PK) |
| name | 회원 이름 |
| email | 이메일 |
| created_at | 생성일 |

### Books

| Column | Description |
|----------|----------|
| book_id | 도서 ID (PK) |
| title | 도서명 |
| author | 저자 |
| publisher | 출판사 |
| available | 대출 가능 여부 |
| created_at | 생성일 |

### Loans

| Column | Description |
|----------|----------|
| loan_id | 대출 ID (PK) |
| user_id | 회원 ID (FK) |
| book_id | 도서 ID (FK) |
| loan_date | 대출일 |
| return_date | 반납일 |
| status | 대출 상태 |

---

## ERD

mermaid erDiagram     USERS ||--o{ LOANS : borrows     BOOKS ||--o{ LOANS : loaned      USERS {         int user_id PK         varchar name         varchar email     }      BOOKS {         int book_id PK         varchar title         varchar author         varchar publisher         boolean available     }      LOANS {         int loan_id PK         int user_id FK         int book_id FK         timestamp loan_date         timestamp return_date         varchar status     } 

---

## 주요 기능

### 도서 관리

- 전체 도서 조회
- 도서 검색
- 신규 도서 등록

### 대출 관리

- 도서 대출
- 도서 반납
- 회원별 대출 현황 조회

### 대출 제한

회원당 최대 2권까지 대출 가능하도록 구현

### 데이터베이스 연동

- PostgreSQL 연동
- REST API 구현
- 실시간 데이터 조회

---

## Query 활용

### 도서 검색

sql SELECT * FROM books WHERE title ILIKE '%검색어%'; 

### 회원별 대출 현황 조회

sql SELECT     users.name,     books.title,     loans.loan_date FROM loans JOIN users ON loans.user_id = users.user_id JOIN books ON loans.book_id = books.book_id; 

---

## Transaction 활용

### 도서 대출

1. 현재 대출 가능 여부 확인
2. 회원 대출 한도 확인
3. loans 테이블에 대출 기록 추가
4. books.available = false 변경
5. COMMIT

실패 시 ROLLBACK 수행

### 도서 반납

1. 대출 상태 확인
2. loans 상태 변경
3. books.available = true 변경
4. COMMIT

실패 시 ROLLBACK 수행

---

## 실행 방법

### Backend

bash cd backend npm install node server.js 

### Frontend

bash cd frontend npm install npm run dev 