# Library Management System

PostgreSQL을 활용한 도서 대출 관리 웹 서비스입니다.

## 프로젝트 개요

본 프로젝트는 React, Express, PostgreSQL, Docker를 이용하여 구현한 도서 대출 관리 시스템입니다.

사용자는 도서를 조회, 검색, 추가, 대출, 반납할 수 있으며 회원별 대출 현황을 확인할 수 있습니다.

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

### Container
- Docker
- Docker Compose

---

## 시스템 구조

```text
React (Frontend)
        ↓ HTTP Request
Express REST API (Backend)
        ↓ SQL Query
PostgreSQL (Database)

Docker
├── Frontend Container
├── Backend Container
└── PostgreSQL Container
```

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

```text
USERS (1)
   |
   | user_id
   |
   v
LOANS (N)
   ^
   |
   | book_id
   |
BOOKS (1)

USERS
- user_id (PK)
- name
- email

BOOKS
- book_id (PK)
- title
- author
- publisher
- available

LOANS
- loan_id (PK)
- user_id (FK)
- book_id (FK)
- loan_date
- return_date
- status
```

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

- 회원당 최대 2권까지 대출 가능

### 데이터베이스 연동

- PostgreSQL 연동
- REST API 구현
- 실시간 데이터 조회

---

## Query 활용

### 도서 검색

```sql
SELECT *
FROM books
WHERE title ILIKE '%검색어%';
```

### 회원별 대출 현황 조회

```sql
SELECT
    users.name,
    books.title,
    loans.loan_date
FROM loans
JOIN users
ON loans.user_id = users.user_id
JOIN books
ON loans.book_id = books.book_id
WHERE loans.status = 'BORROWED';
```

### 회원별 대출 제한 확인

```sql
SELECT COUNT(*)
FROM loans
WHERE user_id = ?
AND status = 'BORROWED';
```

---

## Transaction 활용

### 도서 대출

1. 현재 대출 가능 여부 확인
2. 회원 대출 한도 확인
3. loans 테이블에 대출 기록 추가
4. books.available = false 변경
5. COMMIT

오류 발생 시 ROLLBACK 수행

### 도서 반납

1. 대출 상태 확인
2. loans 상태를 RETURNED로 변경
3. books.available = true 변경
4. COMMIT

오류 발생 시 ROLLBACK 수행

---

## Docker 실행 방법

### 프로젝트 실행

```bash
docker compose up --build
```

### 접속 주소

```text
Frontend
http://localhost:5173

Backend API
http://localhost:3000
```

### 종료

```bash
docker compose down
```

### 데이터 초기화

```bash
docker compose down -v
docker compose up --build
```

---

## Benchmark

### Benchmark Environment

- PostgreSQL 18
- Docker Container Environment
- Benchmark Tool: pgbench
- Test Duration: 30 seconds
- Threads: 4

### Test Query

회원별 대출 현황 조회 Query를 대상으로 성능을 측정하였다.

```sql
SELECT
    users.name,
    books.title,
    loans.loan_date,
    loans.status
FROM loans
JOIN users ON loans.user_id = users.user_id
JOIN books ON loans.book_id = books.book_id
WHERE loans.status = 'BORROWED';
```

### Large Dataset Generation

벤치마크를 위해 추가 데이터를 생성하였다.

- Users: 500명 추가
- Books: 1000권 추가
- Loans: 10000건 추가

### Benchmark Execution

```bash
./benchmark/run_benchmark.sh
```

실행 시 다음 테스트가 자동으로 수행된다.

- 10 Clients
- 50 Clients
- 100 Clients

결과는 다음 파일에 저장된다.

```text
benchmark/result_10.txt
benchmark/result_50.txt
benchmark/result_100.txt
```

### Benchmark Results

| Clients | TPS | Average Latency (ms) |
|----------|----------:|----------:|
| 10 | 728.04 | 13.74 |
| 50 | 1224.37 | 40.84 |
| 100 | 1023.93 | 97.66 |

### Result Analysis

벤치마크 결과, 동시 접속자 수가 증가함에 따라 TPS는 증가하였으며 50명의 클라이언트 환경에서 가장 높은 처리량(1224.37 TPS)을 기록하였다.

100명의 클라이언트 환경에서는 평균 지연 시간(Latency)이 크게 증가하였고, TPS는 오히려 감소하였다. 이는 데이터베이스가 동시에 처리해야 하는 요청 수가 증가하면서 시스템 자원 경쟁이 발생하였기 때문으로 분석된다.

또한 모든 테스트에서 실패한 트랜잭션이 발생하지 않아 데이터 무결성이 유지됨을 확인할 수 있었다.

이를 통해 PostgreSQL이 다수의 동시 요청을 안정적으로 처리할 수 있음을 확인하였으며, 과도한 동시 접속 환경에서는 지연 시간이 증가할 수 있음을 확인하였다.

---

## 학습 내용

본 프로젝트를 통해 다음 내용을 학습하였다.

- React와 Express를 이용한 웹 서비스 구현
- PostgreSQL을 이용한 데이터베이스 설계
- Relation, Query, Transaction 활용
- REST API 개발
- Docker 기반 컨테이너 환경 구축
- 웹 서비스와 DBMS 연동 과정 이해