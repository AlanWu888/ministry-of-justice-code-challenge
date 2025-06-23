import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import TaskBoard, { handleDragEnd } from "@/app/(components)/TaskBoard";
import { Task } from "@/types/task";
import { DropResult } from "@hello-pangea/dnd";

jest.mock("@/app/(components)/TaskCard", () => ({ task }: { task: Task }) => (
  <div data-testid="task-card">{task.title}</div>
));

describe("TaskBoard", () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      status: "TODO",
      dueDate: new Date().toISOString(),
      archived: false,
      createdAt: "2025-06-01T00:00",
      updatedAt: "2025-06-10T00:00",
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      status: "IN_PROGRESS",
      dueDate: new Date().toISOString(),
      archived: false,
      createdAt: "2025-06-01T00:00",
      updatedAt: "2025-06-10T00:00",
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description 3",
      status: "DONE",
      dueDate: new Date().toISOString(),
      archived: false,
      createdAt: "2025-06-01T00:00",
      updatedAt: "2025-06-10T00:00",
    },
  ];

  const setTasks = jest.fn();
  const mockOnEditTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state", () => {
    render(
      <TaskBoard tasks={[]} loading={true} setTasks={setTasks} onEditTask={mockOnEditTask} />
    );
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it("renders tasks under correct columns", () => {
    render(
      <TaskBoard tasks={mockTasks} loading={false} setTasks={setTasks} onEditTask={mockOnEditTask} />
    );

    expect(screen.getByText("TODO")).toBeInTheDocument();
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();

    expect(screen.getAllByTestId("task-card")).toHaveLength(3);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("handles drag and drop with status update", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    const dragResult: DropResult = {
      draggableId: "1",
      source: { droppableId: "TODO", index: 0 },
      destination: { droppableId: "DONE", index: 0 },
      reason: "DROP",
      type: "DEFAULT",
      mode: "FLUID",
      combine: null,
    };

    await act(async () => {
      await handleDragEnd(dragResult, mockTasks, setTasks);
    });

    await waitFor(() => {
      expect(setTasks).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        "/api/tasks/1/patch",
        expect.objectContaining({
          method: "PATCH",
          headers: expect.any(Object),
          body: JSON.stringify({ status: "DONE" }),
        })
      );
    });
  });
});
