#!/bin/bash

docker cp benchmark/large_data.sql library_postgres:/tmp/

docker exec library_postgres psql \
-U hyuk \
-d library_db \
-f /tmp/large_data.sql