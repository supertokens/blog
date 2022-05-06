---
title: How to connect SuperTokens to a MySQL or to a PostgreSQL database
date: "2022-04-24"
description: "Learn how to connect a self-hosted SuperTokens core to a database with or without Docker"
cover: "TODO.png"
category: "programming"
author: "SuperTokens Team"
---

This blog will take you through connecting the SuperTokens core service with a MySQL or a PostgreSQL database with and without Docker.

> This is only applicable if you are self-hosting the SuperTokens core service.

There are several methods for how you might want to run SuperTokens along with a database. In this blog, we will cover:
- 1) Running with MySQL:
  - a) Running SuperTokens and MySQL without docker
  - b) Running SuperTokens with Docker and MySQL without docker
  - c) Running SuperTokens without Docker and MySQL with docker
  - d) Running SuperTokens and MySQL with docker, but without docker-compose
  - e) Running SuperTokens and MySQL with docker, with docker-compose
- 2) Running with PostgreSQL:
  - a) Running SuperTokens and PostgreSQL without docker
  - b) Running SuperTokens with Docker and PostgreSQL without docker
  - c) Running SuperTokens without Docker and PostgreSQL with docker
  - d) Running SuperTokens and PostgreSQL with docker, but without docker-compose
  - e) Running SuperTokens and PostgreSQL with docker, with docker-compose

Please feel free to navigate to the correct section based on your setup. In each section, we will be linking to the SuperTokens documentation wherever applicable so that this blog is not very lengthy.

> All the sections below assume that you will be using a Linux based operating system. For Windows, the syntax for some of the steps might be different, but the overall steps that need to be performed will be the same.

## 1a) Running SuperTokens and MySQL without docker
- Install SuperTokens on your local machine by following the [self-hosted, without docker, instructions in the SuperTokens’ documentation](https://supertokens.com/docs/thirdpartyemailpassword/quick-setup/core/without-docker).
- Connect to the MySQL server on your local machine and create a database for SuperTokens to write to:

  ```sql
  create database supertokens;
  ```

  If you already have a database for your application and want SuperTokens to create tables in that, you can skip this step.
- Create a MySQL user that has full access to the database created in the previous step. This user will be used by SuperTokens to create and write to the database tables:

  ```sql
  CREATE USER 'supertokens_user'@'localhost' IDENTIFIED BY 'somePassword';
  ```

  ```sql
  GRANT ALL ON supertokens.* TO 'supertokens_user'@'localhost';
  ```

  ```sql
  FLUSH PRIVILEGES;
  ```

  Notice that we only allow this user to work via `'localhost'`. This would only work if the SuperTokens core is running locally as well. If you are running the core in a different location, then you would need to replace `'localhost'` in the above with `'%'`.
- Edit the SuperTokens `config.yaml` file (located in `/usr/lib/supertokens/config.yaml`) to add the following config:

  ```yaml
  mysql_connection_uri: "mysql://supertokens_user:somePassword@localhost:3306/supertokens"
  ```
  > Make sure that you put in the right values for the user, password, database name and location of your MySQL instance in the above connection uri string.
- Run SuperTokens by running `supertokens start` on your terminal:
  
  ```bash
  supertokens start

  Loading storage layer.
  Loading MySQL config.
  ...
  Started SuperTokens on localhost:3567 with PID: ...
  ```
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!


## 1b) Running SuperTokens with Docker and MySQL without docker
For this setup to work, we must connect SuperTokens and MySQL via the host machine's network. For this, we will have to expose the MySQL db to the local IP.

- Start by pulling the SuperTokens docker image that is compatible with MySQL:
  ```bash
  docker pull registry.supertokens.io/supertokens/supertokens-mysql
  ```

- Expose MySQL server to all network interfaces on your machine. To do this, edit the `my.cnf` file (MySQL config file) to include:
  ```
  bind-address = 0.0.0.0
  ```

  Be sure to restart your MySQL server after saving the file.

- Connect to the MySQL server on your local machine and create a database for SuperTokens to write to:

  ```sql
  create database supertokens;
  ```

  If you already have a database for your application and want SuperTokens to create tables in that, you can skip this step.
- Create a MySQL user that has full access to the database created in the previous step. This user will be used by SuperTokens to create and write to the database tables:

  ```sql
  CREATE USER 'supertokens_user'@'%' IDENTIFIED BY 'somePassword';
  ```

  ```sql
  GRANT ALL ON supertokens.* TO 'supertokens_user'@'%';
  ```

  ```sql
  FLUSH PRIVILEGES;
  ```

- Run the SuperTokens docker image with the env var specifying the MySQL connection URI:
  ```bash
  docker run \
    -p 3567:3567 \
    --network=host \
    -e MYSQL_CONNECTION_URI="mysql://supertokens_user:somePassword@192.168.1.1:3306/supertokens" \
    -d registry.supertokens.io/supertokens/supertokens-mysql
  ```

  > Be sure to replace `192.168.1.1` with the correct IP of your system.

  This will start the docker image in the background. You can find it by running:
  ```
  docker ps
  ```

  If you want to run it in the foreground, you can remove the `-d` option from the `docker run` command.
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!

## 1c) Running SuperTokens without Docker and MySQL with docker
- Install SuperTokens on your local machine by following the [self-hosted, without docker, instructions in the SuperTokens’ documentation](https://supertokens.com/docs/thirdpartyemailpassword/quick-setup/core/without-docker).

- Start the MySQL docker container:
  ```bash
  docker run \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_USER=supertokens_user \
    -e MYSQL_PASSWORD=somePassword \
    -e MYSQL_DATABASE=supertokens \
    --network=host \
    -p 3306:3306 \
    -d mysql
  ```

  The above will start the mysql db with a new database called `supertokens`. SuperTokens core will store the data in this database. If instead, you want the data to be stored in an existing db, please provide that db's name instead.

- Edit the SuperTokens `config.yaml` file (located in `/usr/lib/supertokens/config.yaml`) to add the following config:

  ```yaml
  mysql_connection_uri: "mysql://supertokens_user:somePassword@localhost:3306/supertokens"
  ```
  > Make sure that you put in the right values for the user, password, database name and location of your MySQL instance in the above connection uri string.
- Run SuperTokens by running `supertokens start` on your terminal:
  
  ```bash
  supertokens start

  Loading storage layer.
  Loading MySQL config.
  ...
  Started SuperTokens on localhost:3567 with PID: ...
  ```
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!

## 1d) Running SuperTokens and MySQL with docker, but without docker-compose
- Start by pulling the SuperTokens docker image that is compatible with MySQL:
  ```bash
  docker pull registry.supertokens.io/supertokens/supertokens-mysql
  ```

- Start the MySQL docker container:
  ```bash
  docker run \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_USER=supertokens_user \
    -e MYSQL_PASSWORD=somePassword \
    -e MYSQL_DATABASE=supertokens \
    --network=host \
    -p 3306:3306 \
    -d mysql
  ```

  The above will start the mysql db with a new database called `supertokens`. SuperTokens core will store the data in this database. If instead, you want the data to be stored in an existing db, please provide that db's name instead.

- Run the SuperTokens docker image with the env var specifying the MySQL connection URI:
  ```bash
  docker run \
    -p 3567:3567 \
    --network=host \
    -e MYSQL_CONNECTION_URI="mysql://supertokens_user:somePassword@192.168.1.1:3306/supertokens" \
    -d registry.supertokens.io/supertokens/supertokens-mysql
  ```

  > Be sure to replace `192.168.1.1` with the correct IP of your system.

  This will start the docker image in the background. You can find it by running:
  ```
  docker ps
  ```

  If you want to run it in the foreground, you can remove the `-d` option from the `docker run` command.
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!

## 1e) Running SuperTokens and MySQL with docker, with docker-compose
- Use the following docker compose file. You can call it `docker-compose.yaml`
  ```yaml
  version: '3'

  services:
    db:
      image: mysql:latest
      environment:
        MYSQL_ROOT_PASSWORD: root
        MYSQL_USER: supertokens_user
        MYSQL_PASSWORD: somePassword
        MYSQL_DATABASE: supertokens
      ports:
        - 3306:3306
      networks:
        - app_network
      restart: unless-stopped
      healthcheck:
        test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]
        timeout: 20s
        retries: 10

    supertokens:
      image: registry.supertokens.io/supertokens/supertokens-mysql
      depends_on:
        - db
      ports:
        - 3567:3567
      environment:
        MYSQL_CONNECTION_URI: mysql://supertokens_user:somePassword@db:3306/supertokens
      networks:
        - app_network
      restart: unless-stopped
      healthcheck:
        test: >
          bash -c 'exec 3<>/dev/tcp/127.0.0.1/3567 && echo -e "GET /hello HTTP/1.1\r\nhost: 127.0.0.1:3567\r\nConnection: close\r\n\r\n" >&3 && cat <&3 | grep "Hello"'
        interval: 10s
        timeout: 5s
        retries: 5

  networks:
    app_network:
      driver: bridge
  ```

- You can run the following command to start the service:
  ```
  docker-compose up
  ```

- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!


## 2a) Running SuperTokens and PostgreSQL without docker
- Install SuperTokens on your local machine by following the [self-hosted, without docker, instructions in the SuperTokens’ documentation](https://supertokens.com/docs/thirdpartyemailpassword/quick-setup/core/without-docker).
- Connect to the PostgreSQL server on your local machine and create a database for SuperTokens to write to:

  ```sql
  CREATE DATABASE supertokens;
  ```

  If you already have a database for your application and want SuperTokens to create tables in that, you can skip this step.
- Create a PostgreSQL user that has full access to the database created in the previous step. This user will be used by SuperTokens to create and write to the database tables:

  ```sql
  CREATE USER supertokens_user WITH ENCRYPTED PASSWORD 'somePassword';
  ```

  ```sql
  GRANT ALL PRIVILEGES ON DATABASE supertokens TO supertokens_user;
  ```

- Edit the SuperTokens `config.yaml` file (located in `/usr/lib/supertokens/config.yaml`) to add the following config:

  ```yaml
  postgresql_connection_uri: "postgresql://supertokens_user:somePassword@localhost:5432/supertokens"
  ```
  > Make sure that you put in the right values for the user, password, database name and location of your postgreSQL instance in the above connection uri string.

- Run SuperTokens by running supertokens start on your terminal:

  ```bash
  supertokens start

  Loading storage layer.
  Loading PostgreSQL config.
  ...
  Started SuperTokens on localhost:3567 with PID: ...
  ```
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!

## 2b) Running SuperTokens with Docker and PostgreSQL without docker

For this setup to work, we must connect SuperTokens and PostgreSQL via the host machine’s network. For this, we will have to allow PostgreSQL to allow incomming client connections over the network.

- Start by pulling the SuperTokens docker image that is compatible with PostgreSQL:

  ```bash
  docker pull registry.supertokens.io/supertokens/supertokens-postgresql
  ```

- Allow incoming client connections to your PostgreSQL database over your network by adding the following lines to the `postgresql.conf`and  `pg_hba.conf` file.

  `postgresql.conf`
  ```
  listen_addresses = '0.0.0.0'
  ```

  `pg_hba.conf`
  ```
  host all all 0.0.0.0/0 md5
  ```

- Connect to the PostgreSQL server on your local machine and create a database for SuperTokens to write to:

  ```sql
  CREATE DATABASE supertokens;
  ```

  If you already have a database for your application and want SuperTokens to create tables in that, you can skip this step.
- Create a PostgreSQL user that has full access to the database created in the previous step. This user will be used by SuperTokens to create and write to the database tables:

  ```sql
  CREATE USER supertokens_user with encrypted password 'somePassword';
  ```

  ```sql
  GRANT ALL PRIVILEGES ON DATABASE supertokens TO supertokens_user;
  ```

- Run the SuperTokens docker image with the env var specifying the PostgreSQL connection URI:

  ```bash
  docker run \              
    -p 3567:3567 \
    --network=host \
    -e POSTGRESQL_CONNECTION_URI="postgresql://supertokens_user:somePassword@192.168.1.1:5432/supertokens" \
    -d registry.supertokens.io/supertokens/supertokens-postgresql

  ```
  > Be sure to replace `192.168.1.1` with the correct IP of your system.

  This will start the docker image in the background. You can find it by running:
  ```
  docker ps
  ```

  If you want to run it in the foreground, you can remove the `-d` option from the `docker run` command.
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!

## 2c) Running SuperTokens without Docker and PostgreSQL with docker
- Install SuperTokens on your local machine by following the [self-hosted, without docker, instructions in the SuperTokens’ documentation](https://supertokens.com/docs/thirdpartyemailpassword/quick-setup/core/without-docker).

- Start the PostgreSQL docker container:
  ```bash
  docker run \
    -e POSTGRES_USER=root \
    -e POSTGRES_PASSWORD=root \
    --network=host \
    -p 5432:5432 \
    -d postgres \
    -c listen_addresses=0.0.0.0
  ```

  The above will start the PostgreSQL db. You will need to connect to the database and create a user with the privileges.

    ```sql
    CREATE DATABASE supertokens;
    ```

  If you already have a database for your application and want SuperTokens to create tables in that, you can skip this step.
- Create a PostgreSQL user that has full access to the database created in the previous step. This user will be used by SuperTokens to create and write to the database tables:

  ```sql
  CREATE USER supertokens_user with encrypted password 'somePassword';
  ```

  ```sql
  GRANT ALL PRIVILEGES ON DATABASE supertokens TO supertokens_user;
  ```


- Edit the SuperTokens `config.yaml` file (located in `/usr/lib/supertokens/config.yaml`) to add the following config:

  ```yaml
  postgresql_connection_uri: "postgresql://supertokens_user:somePassword@localhost:5432/supertokens"
  ```
  > Make sure that you put in the right values for the user, password, database name and location of your PostgreSQL instance in the above connection uri string.
- Run SuperTokens by running `supertokens start` on your terminal:
  
  ```bash
  supertokens start

  Loading storage layer.
  Loading PostgreSQL config.
  ...
  Started SuperTokens on localhost:3567 with PID: ...
  ```
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!


## 2d) Running SuperTokens and PostgreSQL with docker, but without docker-compose
- Start by pulling the SuperTokens docker image that is compatible with PostgreSQL:
  ```bash
  docker pull registry.supertokens.io/supertokens/supertokens-postgresql
  ```

- Start the PostgreSQL docker container:
  ```bash
  docker run \
    -e POSTGRES_USER=root \
    -e POSTGRES_PASSWORD=root \
    --network=host \
    -p 5432:5432 \
    -d postgres \
    -c listen_addresses=0.0.0.0
  ```

  The above will start the PostgreSQL db. You will need to connect to the database and create a user with the privileges.

    ```sql
    CREATE DATABASE supertokens;
    ```

  If you already have a database for your application and want SuperTokens to create tables in that, you can skip this step.
- Create a PostgreSQL user that has full access to the database created in the previous step. This user will be used by SuperTokens to create and write to the database tables:

  ```sql
  CREATE USER supertokens_user with encrypted password 'somePassword';
  ```

  ```sql
  GRANT ALL PRIVILEGES ON DATABASE supertokens TO supertokens_user;
  ```

- Run the SuperTokens docker image with the env var specifying the PostgreSQL connection URI:

  ```bash
  docker run \              
    -p 3567:3567 \
    --network=host \
    -e POSTGRESQL_CONNECTION_URI="postgresql://supertokens_user:somePassword@192.168.1.1:5432/supertokens" \
    -d registry.supertokens.io/supertokens/supertokens-postgresql

  ```
  > Be sure to replace `192.168.1.1` with the correct IP of your system.

  This will start the docker image in the background. You can find it by running:
  ```
  docker ps
  ```

  If you want to run it in the foreground, you can remove the `-d` option from the `docker run` command.
- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!


  ## 2e) Running SuperTokens and PostgreSQL with docker, with docker-compose
- Use the following docker compose file. You can call it `docker-compose.yaml`
  ```yaml
  version: '3'

  services:
    db:
      image: 'postgres:latest'
      environment:
        POSTGRES_USER: supertokens_user 
        POSTGRES_PASSWORD: somePassword 
        POSTGRES_DB: supertokens
      ports:
        - 5432:5432
      networks:
        - app_network
      restart: unless-stopped
      healthcheck:
        test: ['CMD', 'pg_isready -U supertokens_user']
        interval: 5s
        timeout: 5s
        retries: 5

    supertokens:
      image: registry.supertokens.io/supertokens/supertokens-postgresql
      depends_on:
        - db
      ports:
        - 3567:3567
      environment:
        POSTGRESQL_CONNECTION_URI: "postgresql://supertokens_user:somePassword@db:5432/supertokens"
      networks:
        - app_network
      restart: unless-stopped
      healthcheck:
        test: >
          bash -c 'exec 3<>/dev/tcp/127.0.0.1/3567 && echo -e "GET /hello HTTP/1.1\r\nhost: 127.0.0.1:3567\r\nConnection: close\r\n\r\n" >&3 && cat <&3 | grep "Hello"'
        interval: 10s
        timeout: 5s
        retries: 5

  networks:
    app_network:
      driver: bridge
    
  ```

- You can run the following command to start the service:
  ```
  docker-compose up
  ```

- Verify that it is setup correctly by querying the core service:
  
  ```bash
  curl http://localhost:3567/hello
  ```

  If you get back a `Hello` reply, the core setup is done!