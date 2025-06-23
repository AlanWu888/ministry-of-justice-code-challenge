# 📘 Task API Documentation

This document describes the full API for managing tasks in the application.

---

## 🔹 GET `/api/tasks`

**Description:** Fetch all tasks. Supports optional status filtering via query string.

**Query Params:**
- `status` (optional): `"TODO"`, `"IN_PROGRESS"`, `"DONE"`, or `"ARCHIVED"`

**Auth:** `Bearer` token required in header  
**Header:**
```
Authorization: Bearer <your_api_secret>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Create wireframes",
    "description": "For landing page",
    "dueDate": "2025-06-30T10:00:00.000Z",
    "status": "TODO",
    "archived": false,
    "createdAt": "2025-06-23T10:00:00.000Z",
    "updatedAt": "2025-06-25T10:00:00.000Z",
  },
    {
    "id": 2,
    "title": "Create wireframes",
    "description": "For login page",
    "dueDate": "2025-06-30T10:00:00.000Z",
    "status": "TODO",
    "archived": false,
    "createdAt": "2025-06-23T10:00:00.000Z",
    "updatedAt": "2025-06-25T10:00:00.000Z",
  }
]
```

---

## 🔹 POST `/api/tasks`

**Description:** Create a new task.

**Auth:** `Bearer` token required in header  
**Header:**
```
Authorization: Bearer <your_api_secret>
```

**Request Body:**
```json
{
  "title": "Design UI",
  "description": "Use Figma",
  "dueDate": "2025-06-25T12:00:00.000Z",
  "status": "TODO"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Design UI",
  "description": "Use Figma",
  "dueDate": "2025-06-25T12:00:00.000Z",
  "status": "IN_PROGRESS",
  "archived": false,
  "createdAt": "2025-06-23T10:00:00.000Z",
  "updatedAt": "2025-06-25T10:00:00.000Z",
}
```

---


## 🔹 PATCH `/api/tasks/:id/patch`

**Description:** Update an existing task. Send only the fields you want to update.

**Auth:** `Bearer` token required in header  
**Header:**
```
Authorization: Bearer <your_api_secret>
```

**Request Body (example):**
```json
{
  "status": "DONE",
  "title": "Updated title"
}
```

**Response:**
```json
{
  "id": 123,
  "title": "Updated title",
  "description": "Use Figma",
  "dueDate": "2025-06-25T12:00:00.000Z",
  "status": "DONE",
  "archived": false,
  "createdAt": "2025-06-23T10:00:00.000Z",
  "updatedAt": "2025-06-25T10:00:00.000Z",
}
```

---

## 🔹 DELETE `/api/tasks/:id/delete`

**Description:** Permanently delete a task (task can only be deleted if archived).

**Auth:** `Bearer` token required in header  
**Header:**
```
Authorization: Bearer <your_api_secret>
```

**Responses:**
If the task exists and is archived
```json
{
    "message": "Task deleted"
}
```

If the task exists and is NOT archived
```json
{
    "error": "Only archived tasks can be deleted",
    "status": 403 
}
```

If the task does not exist
```json
{
    "error": "ask not found",
    "status": 404
}
```

---

## Auth Format

All routes require this header:

```
Authorization: Bearer <your_api_secret>
```

<your_api_secret> is set up in your environment variables :)

---

## Status Values

- `TODO`
- `IN_PROGRESS`
- `DONE`
- `ARCHIVED` (used only as a query filter)

---

## Notes

Authorisation is done through a util function found at `src/utils/api.ts`. The function checks if the incoming request is authorised using the Authorization header.
