"use client";

import React, { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import NewTaskForm from "./NewTaskForm";
import { Task } from "@/types/task";

interface NavBarProps {
  onTaskCreated: () => void;
  onEditTask: (task: Task) => void;
  onOpenArchive: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onTaskCreated, onEditTask, onOpenArchive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center px-20 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex gap-4 text-sm font-medium">
          <a href="/" className="hover:text-blue-600">Home</a>
          <button onClick={onOpenArchive} className="hover:text-blue-600">Archive</button>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="px-3">
          + New Task
        </Button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
          <NewTaskForm
            onSave={() => {
              setIsModalOpen(false);
              onTaskCreated();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </nav>
    </>
  );
};

export default NavBar;
