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
  tasks: Task[];
}

const NavBar: React.FC<NavBarProps> = ({ onTaskCreated, onEditTask, onOpenArchive, tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      const results = tasks
        .filter((task) =>
          task.title.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3);
      setSearchResults(results);
    }
  };
  
  
  const handleSelectTask = (task: Task) => {
    setSearchTerm("");
    setSearchResults([]);
    onEditTask(task);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-20 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex gap-4 text-sm font-medium">
          <a href="/" className="hover:text-blue-600">Home</a>
          <button onClick={onOpenArchive} className="hover:text-blue-600">Archive</button>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            className="border rounded px-3 py-1 w-full"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-50 w-full bg-white border mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className="cursor-pointer hover:bg-gray-100 px-3 py-2 flex justify-between items-center"
                >
                  <span>{task.title}</span>
                  {task.archived ? (
                    <span className="text-xs text-red-600 font-semibold ml-2">ARCHIVED</span>
                  ) : (
                    <span className="text-xs text-green-600 font-semibold ml-2">ACTIVE</span>
                  )}
                </div>
              ))}
            </div>
          )}
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
