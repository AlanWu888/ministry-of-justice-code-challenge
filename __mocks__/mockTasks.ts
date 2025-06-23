import { Task } from "@/types/task";

export const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  dueDate: "2025-06-20T12:00:00",
  status: "TODO",
  archived: false,
  createdAt: "2025-06-01T00:00",
  updatedAt: "2025-06-10T00:00",
};

export const mockTasks: Task[] = [
  mockTask,
  {
    ...mockTask,
    id: 2,
    title: "Task 2",
    status: "IN_PROGRESS",
  },
  {
    ...mockTask,
    id: 3,
    title: "Task 3",
    status: "DONE",
  },
  {
    ...mockTask,
    id: 4,
    title: "Task 4",
    status: "DONE",
    archived: true,
  },
];
