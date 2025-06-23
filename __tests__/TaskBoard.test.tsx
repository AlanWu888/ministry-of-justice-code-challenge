import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import TaskBoard, { handleDragEnd } from "@/app/(components)/TaskBoard";
import { Task } from "@/types/task";
import { DropResult } from "@hello-pangea/dnd";
import { mockTasks } from "../__mocks__/mockTasks";

jest.mock("@/app/(components)/TaskCard", () => ({ task }: { task: Task }) => (
  <div data-testid="task-card">{task.title}</div>
));

describe("TaskBoard", () => {
  const setTasks = jest.fn();
  const mockOnEditTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state", () => {
    render(
      <TaskBoard
        tasks={[]}
        loading={true}
        setTasks={setTasks}
        onEditTask={mockOnEditTask}
      />
    );
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it("renders tasks under correct columns", () => {
    render(
      <TaskBoard
        tasks={mockTasks}
        loading={false}
        setTasks={setTasks}
        onEditTask={mockOnEditTask}
      />
    );

    expect(screen.getByText("TODO")).toBeInTheDocument();
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();

    expect(screen.getAllByTestId("task-card")).toHaveLength(mockTasks.length);
    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it("handles drag and drop with status update", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    const dragResult: DropResult = {
      draggableId: mockTasks[0].id.toString(),
      source: { droppableId: mockTasks[0].status, index: 0 },
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
        `/api/tasks/${mockTasks[0].id}/patch`,
        expect.objectContaining({
          method: "PATCH",
          headers: expect.any(Object),
          body: JSON.stringify({ status: "DONE" }),
        })
      );
    });
  });
});
