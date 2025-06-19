import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditForm from "@/app/(components)/EditForm";
import { Task } from "@/types/task";

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "A test description",
  dueDate: "2025-06-20T10:00",
  status: "TODO",
  archived: false,
  createdAt: '2025-06-01T00:00', 
  updatedAt: '2025-06-10T00:00'
};

const setup = (overrides = {}) => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  const onToggleArchive = jest.fn();

  render(
    <EditForm
      task={{ ...mockTask, ...overrides }}
      onSave={onSave}
      onCancel={onCancel}
      onToggleArchive={onToggleArchive}
    />
  );

  return { onSave, onCancel, onToggleArchive };
};

describe("EditForm", () => {
  test("renders with task values", () => {
    setup();
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A test description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-06-20T10:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TODO")).toBeInTheDocument();
  });

  test("updates input values and calls onSave on submit", () => {
    const { onSave } = setup();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Title" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Updated Description" },
    });

    fireEvent.submit(screen.getByRole("form"));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Updated Title",
        description: "Updated Description",
        status: "TODO",
      })
    );
  });

  test("calls onCancel when Cancel button is clicked", () => {
    const { onCancel } = setup();
    fireEvent.click(screen.getByText(/cancel/i));
    expect(onCancel).toHaveBeenCalled();
  });

  test("calls onToggleArchive when Archive button is clicked", () => {
    const { onToggleArchive } = setup();
    fireEvent.click(screen.getByText(/archive/i));
    expect(onToggleArchive).toHaveBeenCalledWith(mockTask);
  });

  test("shows 'Un-archive' if task is archived", () => {
    setup({ archived: true });
    expect(screen.getByText(/un-archive/i)).toBeInTheDocument();
  });
});
