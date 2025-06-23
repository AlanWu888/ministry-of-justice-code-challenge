import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "@/app/(components)/TaskForm";
import { mockTask } from "../__mocks__/mockTasks";

describe("TaskForm Component", () => {
  test("renders all input fields", () => {
    render(<TaskForm mode="new" onSave={() => {}} onCancel={() => {}} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/create/i)).toBeInTheDocument();
  });

  test("shows validation errors for empty and invalid fields", async () => {
    render(<TaskForm mode="new" onSave={() => {}} onCancel={() => {}} />);

    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/due date is required/i)).toBeInTheDocument();
    });
  });

  test("calls onSave with form data in 'new' mode", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    ) as any;

    const mockOnSave = jest.fn();
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

    render(<TaskForm mode="new" onSave={mockOnSave} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "New Task" } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Detailed description" } });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: futureDate },
    });

    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  test("renders with task data in 'edit' mode", () => {
    render(
      <TaskForm
        mode="edit"
        task={mockTask}
        onSave={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.dueDate.slice(0, 16))).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.status)).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
  });

  test("calls onSave with updated task in 'edit' mode", async () => {
    const mockOnSave = jest.fn();
    render(
      <TaskForm
        mode="edit"
        task={mockTask}
        onSave={mockOnSave}
        onCancel={() => {}}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Updated Task" } });
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({ title: "Updated Task" }));
    });
  });

  test("renders Archive button only in edit mode and calls onToggleArchive", () => {
    const mockToggle = jest.fn();
    render(
      <TaskForm
        mode="edit"
        task={mockTask}
        onSave={() => {}}
        onCancel={() => {}}
        onToggleArchive={mockToggle}
      />
    );

    const archiveButton = screen.getByText(/archive/i);
    expect(archiveButton).toBeInTheDocument();

    fireEvent.click(archiveButton);
    expect(mockToggle).toHaveBeenCalledWith(mockTask);
  });
});
