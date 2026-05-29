# Library Management System

PostgreSQL을 활용한 도서 대출 관리 웹 서비스입니다.

## 기술 스택

- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: PostgreSQL

## 데이터베이스 구조

### users

| Column | Type |
|----------|----------|
| user_id | SERIAL PRIMARY KEY |
| name | VARCHAR(50) |
| email | VARCHAR(100) |

### books

| Column | Type |
|----------|----------|
| book_id | SERIAL PRIMARY KEY |
| title | VARCHAR(100) |
| author | VARCHAR(50) |
| publisher | VARCHAR(50) |
| available | BOOLEAN |

### loans

| Column | Type |
|----------|----------|
| loan_id | SERIAL PRIMARY KEY |
| user_id | FOREIGN KEY |
| book_id | FOREIGN KEY |
| loan_date | TIMESTAMP |
| return_date | TIMESTAMP |
| status | VARCHAR(20) |

## 주요 기능

### 도서 조회

- 전체 도서 목록 조회
- 대출 가능 여부 확인

### 도서 대출

- 대출 버튼 클릭
- Transaction 처리
- books.available 자동 변경

### 도서 반납

- 반납 버튼 클릭
- return_date 저장
- books.available 자동 변경

### 대출 현황 조회

- users, books, loans JOIN 사용

## Transaction 예시

도서 대출 시

1. loans 테이블에 대출 기록 추가
2. books.available = false
3. COMMIT

실패 시 ROLLBACK 수행

## 실행 방법

### Backend

bash cd backend npm install node server.js 

### Frontend

bash cd frontend npm install npm run dev 

## 학습 내용

- PostgreSQL 데이터베이스 설계
- Foreign Key 관계 설정
- SQL JOIN
- Transaction 처리
- Express와 PostgreSQL 연동
- React와 Backend API 연동