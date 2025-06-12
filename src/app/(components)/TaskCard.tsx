import React, { useState } from "react";
import { Pencil } from "lucide-react";

import { Task } from "@/types/task";
import Button from "./Button";
import Modal from "./Modal";
import EditForm from "./EditForm";

interface TaskCardProps {
  task: Task;
  onSave: (updatedTask: Task) => Promise<void>;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSave }) => {
  const { title, description, status, dueDate } = task;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "10px",
        padding: "10px",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between"}}>
        <h2 style={{ margin: 0, fontWeight: "bold" }}>{title}</h2>
        <Button onClick={() => setIsModalOpen(true)} icon={<Pencil size={"16px"} />} />
      </div>

      <div style={{ borderTop: "1px solid black", marginTop: "10px", paddingTop: "10px" }}>
        <p style={{ fontSize: "0.75rem", margin: 0 }}>Description:</p>
        <p style={{ marginTop: "5px" }}>{description}</p>
      </div>

      <div style={{ marginTop: "10px", fontSize: "0.75rem" }}>
        Due: {new Date(dueDate).toISOString().split("T").join(" ").slice(0, 16)}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
        <EditForm
          task={task}
          onSave={async (updatedTask) => {
            await onSave(updatedTask);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TaskCard;
