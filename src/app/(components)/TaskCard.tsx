import React from "react";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { title, description, status, dueDate } = task;

  const statusColor = {
    TODO: "#fbbf24",        // yellow
    IN_PROGRESS: "#60a5fa", // blue
    DONE: "#4ade80",        // green
  };

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            padding: "5px 10px",
            border: `2px solid ${statusColor[status]}`,
            borderRadius: "5px",
            backgroundColor: statusColor[status],
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "bold",
            marginRight: "10px",
            textTransform: "capitalize",
          }}
        >
          {status.replace("_", " ")}
        </span>
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>

      <div
        style={{
          borderTop: "1px solid black",
          marginTop: "10px",
          paddingTop: "10px",
        }}
      >
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
