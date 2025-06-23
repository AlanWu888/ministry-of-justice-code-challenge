import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "@/app/(components)/TaskCard";
import { Task } from "@/types/task";

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  dueDate: "2025-06-30T15:00:00Z",
  status: "TODO",
  archived: false,
  createdAt: '2025-06-01T00:00', 
  updatedAt: '2025-06-10T00:00'
};

describe("TaskCard", () => {
  it("renders title, description, and due date", () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText(/Due: 2025-06-30 15:00/)).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEditMock = jest.fn();
    render(<TaskCard task={mockTask} onEdit={onEditMock} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onEditMock).toHaveBeenCalledWith(mockTask);
  });

  it("renders delete button and calls onDelete when task is archived", () => {
    const archivedTask = { ...mockTask, archived: true };
    const onDeleteMock = jest.fn();
    render(<TaskCard task={archivedTask} onEdit={jest.fn()} onDelete={onDeleteMock} />);

    // check for 2 buttons (edit and delete), then press second button (delete)
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[1]);
    expect(onDeleteMock).toHaveBeenCalledWith(archivedTask);
  });
});
