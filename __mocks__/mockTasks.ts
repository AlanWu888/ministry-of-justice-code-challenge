import { Task } from "@/types/task";

export const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),  // 24 hours into the future
  status: "TODO",
  archived: false,
  createdAt: new Date(Date.now()).toISOString(),
  updatedAt: new Date(Date.now()).toISOString(),
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
