import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ArchivePanel from "@/app/(components)/ArchivePanel";
import { Task } from "@/types/task";

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Archived Task",
    description: "This task is archived",
    dueDate: "2025-07-01T00:00",
    status: "TODO",
    archived: false,
    createdAt: "2025-06-01T00:00",
    updatedAt: "2025-06-10T00:00",
  },
  {
    id: 2,
    title: "Non-Archived Task",
    description: "This task is not archived",
    dueDate: "2025-07-01T00:00",
    status: "DONE",
    archived: true,
    createdAt: "2025-06-01T00:00",
    updatedAt: "2025-06-10T00:00",
  },
];

const mockFetch = (data: any) =>
  jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });

describe("ArchivePanel", () => {
  beforeEach(() => {
    global.fetch = mockFetch(mockTasks.filter((t) => t.archived));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ArchivePanel
        isOpen={false}
        onClose={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        refreshSignal={0}
      />
    );

    expect(container.querySelector(".-translate-x-full")).toBeInTheDocument();
  });

  it("renders and displays archived tasks when open", async () => {
    render(
      <ArchivePanel
        isOpen={true}
        onClose={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        refreshSignal={0}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Non-Archived Task" })
      ).toBeInTheDocument();
    });
  });

  it("shows message when no archived tasks are found", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(mockFetch([]));

    render(
      <ArchivePanel
        isOpen={true}
        onClose={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        refreshSignal={0}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No archived tasks found.")
      ).toBeInTheDocument();
    });
  });

  it("calls onEditTask and onDeleteTask when edit/delete buttons are clicked", async () => {
    const onEditTask = jest.fn();
    const onDeleteTask = jest.fn();

    render(
      <ArchivePanel
        isOpen={true}
        onClose={jest.fn()}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        refreshSignal={0}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Non-Archived Task" })
      ).toBeInTheDocument();
    });

    const editButton = screen
      .getAllByRole("button")
      .find((btn) =>
        btn.querySelector("svg")?.classList.contains("lucide-pencil")
      );
    fireEvent.click(editButton!);
    expect(onEditTask).toHaveBeenCalledWith(mockTasks[1]);

    const deleteButton = screen
      .getAllByRole("button")
      .find((btn) =>
        btn.querySelector("svg")?.classList.contains("lucide-trash")
      );
    fireEvent.click(deleteButton!);
    expect(onDeleteTask).toHaveBeenCalledWith(mockTasks[1]);
  });
});
