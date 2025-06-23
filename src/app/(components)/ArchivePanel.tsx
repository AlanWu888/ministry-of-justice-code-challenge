"use client";

import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

interface ArchivePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  refreshSignal: number;
}

const ArchivePanel: React.FC<ArchivePanelProps> = ({ isOpen, onClose, onEditTask, onDeleteTask, refreshSignal }) => {
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchArchivedTasks = async () => {
      try {
        const res = await fetch("/api/tasks?status=ARCHIVED", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch archived tasks");
        const data = await res.json();
        setArchivedTasks(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchArchivedTasks();
  }, [isOpen, refreshSignal]);

  return (
    <div className={`fixed top-0 left-0 h-full w-96 bg-white shadow-xl z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between pt-4.5 pb-5 pl-4 pr-4 border-b">
        <h2 className="text-lg font-bold">Archived Tasks</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
      {archivedTasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No archived tasks found.</p>
      ) : (
        archivedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))
      )}
      </div>
    </div>
  );
};

export default ArchivePanel;
