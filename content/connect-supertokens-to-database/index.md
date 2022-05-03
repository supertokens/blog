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
  ```
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
  ```
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