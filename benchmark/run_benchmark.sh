#!/bin/bash

echo "===== Loading Benchmark Data ====="

docker cp benchmark/large_data.sql library_postgres:/tmp/

docker exec library_postgres psql \
-U hyuk \
-d library_db \
-f /tmp/large_data.sql

echo "===== Benchmark Start ====="

echo "10 Clients Transaction Test"
docker exec library_postgres pgbench \
-U hyuk \
-d library_db \
-n \
-f /benchmark/loan_query.sql \
-c 10 \
-j 4 \
-T 30 \
> benchmark/result_10.txt

echo "50 Clients Transaction Test"
docker exec library_postgres pgbench \
-U hyuk \
-d library_db \
-n \
-f /benchmark/loan_query.sql \
-c 50 \
-j 4 \
-T 30 \
> benchmark/result_50.txt

echo "100 Clients Transaction Test"
docker exec library_postgres pgbench \
-U hyuk \
-d library_db \
-n \
-f /benchmark/loan_query.sql \
-c 100 \
-j 4 \
-T 30 \
> benchmark/result_100.txt

echo "===== Benchmark Complete ====="