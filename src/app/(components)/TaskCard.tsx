import React from "react";
import { Pencil, Trash } from "lucide-react";
import { Task } from "@/types/task";
import Button from "./Button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { title, description, dueDate, archived } = task;

  return (
    <div style={{ border: "1px solid black", borderRadius: "10px", padding: "10px", backgroundColor: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h2 style={{ margin: 0, fontWeight: "bold" }}>{title}</h2>
        <div style={{ display: "flex", gap: "5px" }}>
          <Button onClick={() => onEdit(task)} icon={<Pencil size={"16px"} />} />
          {archived && onDelete && (
            <Button
              onClick={() => onDelete(task)}
              icon={<Trash size={"16px"} />}
              className="bg-red-600 hover:bg-red-700"
            />
          )}
        </div>
      </div>
      <div style={{ borderTop: "1px solid black", marginTop: "10px", paddingTop: "10px" }}>
        <p style={{ fontSize: "0.75rem", margin: 0 }}>Description:</p>
        <p style={{ marginTop: "5px" }}>{description}</p>
      </div>
      <div style={{ marginTop: "10px", fontSize: "0.75rem" }}>
        Due:{" "}
        {new Date(dueDate).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </div>
    </div>
  );
};

export default TaskCard;
