# Task Manager App

A full-stack task management application built with **Next.js**, **Prisma**, and **React**. Supports task creation, editing, archiving, and drag-and-drop.

---

## Getting Started

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Copy the following into your `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_API_SECRET="super-secret-token"
```

Your NEXT_PUBLIC_API_SECRET key can be anything you want. During development, I have used "super-secret-token" (very secure, i know)

---

## Database Setup

1. **Run Prisma migrations:**

```bash
npx prisma migrate deploy
```

2. **Seed the database:**

```bash
npx prisma db seed
```

---

## Running Tests

### Unit tests:
```bash
npm run test
```

### With coverage report:
```bash
npm run test:coverage
```

---

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## API Documentation

Full API reference is available here:  
-> [docs/API.md](docs/API.md)

---

## Tech Stack

- **Next.js 14+**
- **React 19**
- **Prisma ORM**
- **TypeScript**
- **Tailwind CSS**
- **Jest** for unit testing

---

## License

MIT — feel free to use, modify, and share.