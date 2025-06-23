import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "@/app/(components)/TaskCard";
import { mockTask } from "../__mocks__/mockTasks";

describe("TaskCard", () => {
  it("renders title, description, and due date", () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} />);

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(
      screen.getByText(
        `Due: ${new Date(mockTask.dueDate).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })}`
      )
    ).toBeInTheDocument();
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

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[1]);
    expect(onDeleteMock).toHaveBeenCalledWith(archivedTask);
  });
});
