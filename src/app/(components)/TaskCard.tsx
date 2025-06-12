import React from "react";
import { Pencil } from "lucide-react";
import { Task } from "@/types/task";
import Button from "./Button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { title, description, dueDate } = task;

  return (
    <div style={{ border: "1px solid black", borderRadius: "10px", padding: "10px", backgroundColor: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontWeight: "bold" }}>{title}</h2>
        <Button onClick={() => onEdit(task)} icon={<Pencil size={"16px"} />} />
      </div>
      <div style={{ borderTop: "1px solid black", marginTop: "10px", paddingTop: "10px" }}>
        <p style={{ fontSize: "0.75rem", margin: 0 }}>Description:</p>
        <p style={{ marginTop: "5px" }}>{description}</p>
      </div>
      <div style={{ marginTop: "10px", fontSize: "0.75rem" }}>
        Due: {new Date(dueDate).toISOString().split("T").join(" ").slice(0, 16)}
      </div>
    </div>
  );
};

export default TaskCard;