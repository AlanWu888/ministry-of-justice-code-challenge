"use client"

import React, { useState } from "react";
import Button from "./Button";

interface NewTaskFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, dueDate, status })
      });

      if (!res.ok) throw new Error("Failed to create task");
      onSave();
    } catch (err) {
      console.error(err);
      alert("Could not create task.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input
          id="title"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium">Due Date</label>
        <input
          id="dueDate"
          type="datetime-local"
          className="w-full border px-3 py-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">Status</label>
        <select
          id="status"
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onCancel} className="bg-gray-400 hover:bg-gray-500">Cancel</Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
};

export default NewTaskForm;
