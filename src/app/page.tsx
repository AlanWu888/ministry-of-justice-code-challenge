"use client";

import React, { useState } from "react";
import NavBar from "./(components)/NavBar";
import TaskBoard from "./(components)/TaskBoard";
import Modal from "./(components)/Modal";
import EditForm from "./(components)/EditForm";
import { Task } from "@/types/task";

export default function Home() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

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
      setTasks((prev) => prev.map((t) => (t.id === savedTask.id ? savedTask : t)));
      setEditingTask(null);
    } catch (err) {
      console.error("Update error", err);
    }
  };

  return (
    <div>
      <NavBar onTaskCreated={() => {}} onEditTask={handleEdit} />
      <br />
      <TaskBoard tasks={tasks} loading={loading} setTasks={setTasks} onEditTask={handleEdit} />
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)}>
        {editingTask && (
          <>
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            <EditForm
              task={editingTask}
              onSave={handleTaskUpdate}
              onCancel={() => setEditingTask(null)}
            />
          </>
        )}
      </Modal>
    </div>
  );
}