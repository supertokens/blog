---
title: Connecting ST core docker image to MySQL / PostgreSQL
date: "2022-02-10"
description: "This tutorial will take you through connecting the SuperTokens core service with a MySQL or a PostgreSQL database."
cover: "revoking-access-with-a-jwt-blacklist.png"
category: "programming"
author: "SuperTokens Team"
---

## 1b) Running SuperTokens with Docker and MySQL without docker

### Run SuperTokens with Docker

To run SuperTokens with Docker, follow the steps below:

- Run the SuperTokens Docker image.

```
docker run -p 3567:3567 -d registry.supertokens.io/supertokens/supertokens-mysql
```

The above command will start the container with an in-memory database. You do not need to connect to MySQL before testing with SuperTokens.

- Open a browser and visit `http://localhost:3567/hello`. The core setup is done if you get a `Hello` reply!

> If you are having issues with starting the docker image, please feel free to reach out to us over [email](founders@supertokens.com) or via [Discord](https://supertokens.com/discord).

- Connect the backend to the SuperTokens SDK by adding the connection in the SuperTokens object in the init function on your backend:

```
connection_uri='http://localhost:3567',
```

> The default port for SuperTokens is `3567`. However, you can change this by binding a different port in the docker run command. For example, `docker run -p 8080:3567` will run SuperTokens on port `8080` on your machine.

### Run MySQL without Docker

To run MySQL without Docker, follow the steps below:

- Install SuperTokens from the [open source download page](https://supertokens.com/use-oss). Next, click on the "Binary" tab, choose and download the SuperTokens Zip for your OS.

- Extract the downloaded file, and install it with the install command below:

> Run the below command as an administrator so that the SuperTokens REM will be added to your system PATH.

```
cd supertokens
install.bat
```

- Start the SuperTokens service.

```
supertokens start [--host=...] [--port=...]
```

The above command will start the container with an in-memory database. Please run SuperTokens `start --help` to see all available options.

> From here, you can proceed to connect your database by visiting the [Database setup section](https://supertokens.com/docs/emailpassword/quick-setup/database-setup/mysql) section.


- Open a browser and visit `http://localhost:3567/hello`.The core setup is done if you get a `Hello` reply!

You can also stop the SuperTokens service. For example, run the command `supertokens stop`.


- Connect the backend to the SuperTokens SDK by adding the connection in the SuperTokens object in the init function on your backend:

```
connection_uri='http://localhost:3567',
```

> The default port for SuperTokens is `localhost:3567`. Perhaps, you can change this by passing a `--host` and `--port` flag to the start command.

## 1c) Running SuperTokens without Docker and MySQL with docker

### Run SuperTokens without Docker

To run SuperTokens without Docker, follow the steps below:

- Install SuperTokens from the [open source download page](https://supertokens.com/use-oss). Next, click on the "Binary" tab, choose and download the SuperTokens Zip for your OS.

- Extract the downloaded file, and install it with the install command below:

> Run the below command as an administrator so that the SuperTokens REM will be added to your system PATH.

```
cd supertokens
install.bat
```

- Start the SuperTokens service.

```
supertokens start [--host=...] [--port=...]
```

The above command will start the container with an in-memory database. Please run SuperTokens `start --help` to see all available options.

> From here, you can proceed to connect your database by visiting the [Database setup section](https://supertokens.com/docs/emailpassword/quick-setup/database-setup/mysql) section.


- Open a browser and visit `http://localhost:3567/hello`.The core setup is done if you get a `Hello` reply!

You can also stop the SuperTokens service. For example, run the command `supertokens stop`.


- Connect the backend to the SuperTokens SDK by adding the connection in the SuperTokens object in the init function on your backend:

```
connection_uri='http://localhost:3567',
```

> The default port for SuperTokens is `localhost:3567`. Perhaps, you can change this by passing a `--host` and `--port` flag to the start command.



### Run MySQL with Docker

To run MySQL with Docker, follow the steps below:

- Run the SuperTokens MySQL Docker image.

```
docker run -p 3567:3567 -d registry.supertokens.io/supertokens/supertokens-mysql
```

The above command will start the container with an in-memory database. You do not need to connect to MySQL before testing with SuperTokens.

- Open a browser and visit `http://localhost:3567/hello`. The core setup is done if you get a `Hello` reply!

> If you are having issues with starting the docker image, please feel free to reach out to us over [email](founders@supertokens.com) or via [Discord](https://supertokens.com/discord).

- Connect the backend to the SuperTokens SDK by adding the connection in the SuperTokens object in the init function on your backend:

```
connection_uri='http://localhost:3567',
```

> The default port for SuperTokens is `3567`. However, you can change this by binding a different port in the docker run command. For example, `docker run -p 8080:3567` will run SuperTokens on port `8080` on your machine.


## 1d) Running SuperTokens and MySQL with docker, but without docker-compose
