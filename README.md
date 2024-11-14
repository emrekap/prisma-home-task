# PrismaIO Home Task Interview


> DATABASE_URL with password included in **.env.example** file ONLY for easier interview process.

> Test postgres server is running on a Supabase instance





## Setup

```
cp .env.example .env

npm ci

npx prisma migrate dev

```


## Development Server

```
npm run dev
```


## !!RESET TEST DATABASE!!
```
npx prisma migrate reset
```
