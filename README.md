## Getting Started


1. Install the npm dependencies:

```bash
npm install
```


2. Install postgresql dependencies:

- Ref: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)


For Ubuntu, run:

```bash
apt install postgresql
```


3. Setup the default postgres user and create a new database:

For Ubuntu, run:

```bash
sudo -u postgres psql

ALTER USER postgres WITH PASSWORD 'postgres';

CREATE DATABASE tourism_dapp;

\q
```


4. Import the database structure using prisma 

```bash
npx prisma db push
```


5. Setup all .env variables

- DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tourism_dapp?schema=public"       // Copy paste
- NEXTAUTH_SECRET="YOUR_SECRET_HERE"
- AUTH_TRUST_HOST=true      // Copy paste
- NEXTAUTH_URL=http://localhost:3000/       // Copy paste
- UPLOADTHING_TOKEN="YOUR_TOKEN_HERE"       // Ref: [https://docs.uploadthing.com/](https://docs.uploadthing.com/)


6. Run and test

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

*Required*: needs to install the Metamask plugin on chrome and connect a wallet. 