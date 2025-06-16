import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <p className="text-base">{message || "Are you sure you want to delete this task?"}</p>
        <div className="flex justify-end gap-3">
          <Button className="bg-gray-400 hover:bg-gray-500" onClick={onClose}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
