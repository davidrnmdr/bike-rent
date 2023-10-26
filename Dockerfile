FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=david
ENV MYSQL_DATABASE=bike_rent

COPY ./bike-rent-db.sql /docker-entrypoint-initdb.d/
