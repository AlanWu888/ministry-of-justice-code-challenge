set up env file:
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_API_SECRET="super-secret-token"
```

npm install

seed database
1. run prisma migrations `npx prisma migrate deploy`
2. seed the Database `npx prisma db seed`

npm run dev