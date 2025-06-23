import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ArchivePanel from "@/app/(components)/ArchivePanel";
import { mockTasks } from "../__mocks__/mockTasks";

const archivedMockTasks = mockTasks.filter((t) => t.archived);

const mockFetch = (data: any) =>
  jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });

describe("ArchivePanel", () => {
  beforeEach(() => {
    global.fetch = mockFetch(archivedMockTasks);
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
      archivedMockTasks.forEach((task) => {
        expect(screen.getByRole("heading", { name: task.title })).toBeInTheDocument();
      });
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
      expect(screen.getByText("No archived tasks found.")).toBeInTheDocument();
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
        screen.getByRole("heading", { name: archivedMockTasks[0].title })
      ).toBeInTheDocument();
    });

    const editButton = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg")?.classList.contains("lucide-pencil"));
    fireEvent.click(editButton!);
    expect(onEditTask).toHaveBeenCalledWith(archivedMockTasks[0]);

    const deleteButton = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg")?.classList.contains("lucide-trash"));
    fireEvent.click(deleteButton!);
    expect(onDeleteTask).toHaveBeenCalledWith(archivedMockTasks[0]);
  });
});
