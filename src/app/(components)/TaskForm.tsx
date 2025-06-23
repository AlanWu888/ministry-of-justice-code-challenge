import React, { useState, useEffect } from "react";
import { Task } from "@/types/task";
import Button from "./Button";

interface TaskFormProps {
  mode: "new" | "edit";
  task?: Task;
  onSave: (updatedTask?: Task) => void;
  onCancel: () => void;
  onToggleArchive?: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ mode, task, onSave, onCancel, onToggleArchive }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [status, setStatus] = useState<Task["status"]>(task?.status || "TODO");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setStatus(task.status);
    }
  }, [task, mode]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    else if (title.length < 3) newErrors.title = "Title must be at least 3 characters.";

    if (description && description.length < 10)
      newErrors.description = "Description must be at least 10 characters.";

    if (!dueDate) newErrors.dueDate = "Due date is required.";
    else if (new Date(dueDate) <= new Date())
      newErrors.dueDate = "Due date must be in the future.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      status,
    };    

    if (mode === "new") {
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create task");
        onSave();
      } catch (err) {
        console.error(err);
        alert("Could not create task.");
      }
    } else if (mode === "edit" && task) {
      onSave({ ...task, ...payload });
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
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium">Due Date</label>
        <input
          id="dueDate"
          type="datetime-local"
          className="w-full border px-3 py-2 rounded"
          value={dueDate.slice(0, 16)}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">Status</label>
        <select
          id="status"
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      <div className="flex justify-between items-center pt-4 border-t mt-4">
        {mode === "edit" && task && onToggleArchive && (
          <Button
            type="button"
            onClick={() => onToggleArchive(task)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {task.archived ? "Un-archive" : "Archive"}
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" onClick={onCancel} className="bg-gray-400 hover:bg-gray-500">
            Cancel
          </Button>
          <Button type="submit">{mode === "new" ? "Create" : "Save"}</Button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
