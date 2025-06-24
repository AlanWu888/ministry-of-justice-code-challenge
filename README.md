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

This project includes a preconfigured local database. If you prefer not to use the default setup, you can manually seed the database with initial data.

### Optional: Seed the Database

To seed the database, run the following command:

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

---

### Dependency Warnings

You may see warnings like the following when running `npm install`:

```bash
npm WARN deprecated inflight@1.0.6: This module is not supported...
npm WARN deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
```
These warnings are from indirect dependencies of jest and cannot be resolved until its upstream packages are updated. They do not affect functionality, and it is safe to proceed with installation and development.