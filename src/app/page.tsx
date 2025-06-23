"use client";

import React, { useState, useEffect } from "react";
import NavBar from "./(components)/NavBar";
import TaskBoard from "./(components)/TaskBoard";
import Modal from "./(components)/Modal";
import TaskForm from "./(components)/TaskForm";
import ArchivePanel from "./(components)/ArchivePanel";
import { Task } from "@/types/task";
import ConfirmModal from "./(components)/ConfirmationModal";

export default function Home() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [archiveRefreshSignal, setArchiveRefreshSignal] = useState(0);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => setEditingTask(task);

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const res = await fetch(`/api/tasks/${updatedTask.id}/patch`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) throw new Error("Update failed");

      const savedTask = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === savedTask.id ? savedTask : t))
      );

      setArchiveRefreshSignal((prev) => prev + 1);

      setEditingTask(null);
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const handleToggleArchive = async (task: Task) => {
    const updated = { ...task, archived: !task.archived };
  
    try {
      const res = await fetch(`/api/tasks/${task.id}/patch`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
  
      if (!res.ok) throw new Error("Archive toggle failed");
  
      await fetchTasks();
  
      setArchiveRefreshSignal((prev) => prev + 1);
      setEditingTask(null);
    } catch (err) {
      console.error("Error toggling archive:", err);
    }
  };  

  const handleDeleteTask = (task: Task) => {
    setConfirmDeleteTask(task);
  };
  
  const confirmDelete = async () => {
    if (!confirmDeleteTask) return;
  
    try {
      const res = await fetch(`/api/tasks/${confirmDeleteTask.id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      });
  
      if (!res.ok) throw new Error("Delete failed");
  
      await fetchTasks();
      setArchiveRefreshSignal((prev) => prev + 1);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setConfirmDeleteTask(null);
    }
  };
    
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <NavBar
        onTaskCreated={fetchTasks}
        onEditTask={handleEdit}
        onOpenArchive={() => setShowArchive(true)}
        tasks={tasks}
      />
      <div className="px-20">
        <br />
        <TaskBoard
          tasks={tasks.filter((task) => !task.archived)}
          loading={loading}
          setTasks={setTasks}
          onEditTask={handleEdit}
        />
        <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)}>
          {editingTask && (
            <>
              <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
              <TaskForm
                mode="edit"
                task={editingTask}
                onSave={(task) => {
                  if (task) handleTaskUpdate(task);
                }}
                onCancel={() => setEditingTask(null)}
                onToggleArchive={handleToggleArchive}
              />
            </>
          )}
        </Modal>
      </div>

      <ArchivePanel
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        onEditTask={handleEdit}
        onDeleteTask={handleDeleteTask}
        refreshSignal={archiveRefreshSignal}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteTask}
        onClose={() => setConfirmDeleteTask(null)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to permanently delete "${confirmDeleteTask?.title}"?`}
      />

    </div>
  );
}