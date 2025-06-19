import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "@/app/(components)/ConfirmationModal";

describe("ConfirmModal", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
      message: "Confirm delete task?",
      ...props,
    };
    render(<ConfirmModal {...defaultProps} />);
    return defaultProps;
  };

  it("renders with custom message", () => {
    setup();
    expect(screen.getByText("Confirm delete task?")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when Delete is clicked", () => {
    const { onConfirm } = setup();
    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    setup({ isOpen: false });
    expect(screen.queryByText("Confirm delete task?")).not.toBeInTheDocument();
  });

  it("renders default message when none provided", () => {
    setup({ message: undefined });
    expect(screen.getByText("Are you sure you want to delete this task?")).toBeInTheDocument();
  });
});
