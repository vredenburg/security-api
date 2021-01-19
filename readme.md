## Prerequisites

You will need to have Node.js and Postgres installed.

**Node.js**

MacOS (homebrew)

```bash
brew install node
```

Debian and Ubuntu base Linux distributions

```bash
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Then update npm to the latest version.

```bash
npm install npm@latest -g
```

For other options refer to: https://nodejs.org/en/

**Postgres**

MacOS (homebrew)

```bash
brew install postgresql
```

Debian and Ubuntu base Linux distributions

```bash
sudo apt-get -y install postgresql
```

Initialise database.

```bash
sudo service postgresql initdb
```

Start the postgres service.

```bash
sudo service postgresql start
```

For other options refer to: https://www.postgresql.org/download/

## Get started

**1. Install dependencies**

```bash
cd security-api
npm install
```

**2. Create new user and database**

First, connect to postgres.

```bash
psql postgres
```

Then, create a new user. Obviously this example is just a placeholder, and will have to be changed before actually going live.

```bash
CREATE USER security WITH PASSWORD 'security' CREATEDB;
```

After that, create a new database for our project.

```bash
CREATE DATABASE security_api;
```

Disconnect by typing `exit`.

**2. Install uuid extension for postgres to allow for automatic uuid generation**

Connect to the new security_api database.

```bash
psql security_api
```

Install the uuid extension.

```bash
CREATE extension IF NOT EXISTS "uuid-ossp";
```

Check whether the extension was installed succesfully.

```bash
SELECT * FROM pg_available_extensions;
```

Disconnect again by typing `exit`.

**4. Run migrations**
Run the following command from the root folder.

```bash
npx ts-node ./node_modules/typeorm/cli.js migration:run
```

**5. Generate private keys**
Create a `/certs` folder in the root directory of the project and add a certificate and 2 private keys to it:

- cert.pem
- key-rsa.pem
- jwtSecretKey.pem

**6. Create a .env file**
Currently, only the port to be used is stored in the .env file. So all you need to do is:

Create a .env file in the root directory of the project.

```bash
touch .env
```

And add `PORT=7000` to the file. Of course, any other port number could be used in stead of 7000.

**Done!**
You are now ready to run the application.

## Running the application

```bash
npm run start:dev
```

Runs the application using nodemon. This tool allows the developer by automatically restarting the application if any changes in the code are deteted.

```bash
npm run build
```

Builds the application.

```bash
npm run start
```

Runs the application.
