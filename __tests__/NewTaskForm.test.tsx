import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewTaskForm from "@/app/(components)/NewTaskForm";

describe("NewTaskForm", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  it("renders all form inputs and buttons", () => {
    render(<NewTaskForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/create/i)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(<NewTaskForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Task" } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Test description" } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: "2025-12-31T23:59" } });
    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "DONE" } });

    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => expect(mockOnSave).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      "/api/tasks",
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Object),
        body: expect.stringContaining("Test Task"),
      })
    );
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<NewTaskForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("shows alert on submission failure", async () => {
    // this should throw an Error, when running unit tests, we should expect to see a console.error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    window.alert = jest.fn();

    render(<NewTaskForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Failing Task" } });
    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Could not create task."));
    expect(mockOnSave).not.toHaveBeenCalled();
  });
});
