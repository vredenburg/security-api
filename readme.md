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

For other options refer to: https://www.postgresql.org/download/

## Get started

**1. Install dependencies.**

```bash
cd security-api
npm install
```

**2. Install uuid extension for postgres to allow for automatic uuid generation.**

```bash
psql postgres
CREATE extension IF NOT EXISTS "uuid-ossp";
```

Check if the extension was installed succesfully.

```bash
SELECT * FROM pg_available_extensions;
```

**3. Run migrations.**
Run the following command from the root folder. If there's no database present, it'll be generated automatically.

```bash
ts-node ./node_modules/typeorm/cli.js migration:run
```

**4. Generate private keys.**
Create a /certs folders and add a certificate and 2 private keys to it:

- cert.pem
- key-rsa.pem
- jwtSecretKey.pem

Done! You are now ready to run the application.
