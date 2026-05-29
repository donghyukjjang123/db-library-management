erDiagram
    USERS ||--o{ LOANS : borrows
    BOOKS ||--o{ LOANS : loaned

    USERS {
        int user_id PK
        varchar name
        varchar email
    }

    BOOKS {
        int book_id PK
        varchar title
        varchar author
        varchar publisher
        boolean available
    }

    LOANS {
        int loan_id PK
        int user_id FK
        int book_id FK
        timestamp loan_date
        timestamp return_date
        varchar status
    }