import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

const statuses = ["TODO", "IN_PROGRESS", "DONE"];
const authHeader = `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`;

interface TaskBoardProps {
  tasks: Task[];
  loading: boolean;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onEditTask: (task: Task) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, loading, setTasks, onEditTask }) => {
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      task.id.toString() === draggableId ? { ...task, status: destination.droppableId } : task
    );

    setTasks(updatedTasks);

    try {
      await fetch(`/api/tasks/${draggableId}/patch`, {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });
    } catch (error) {
      console.error("Failed to update task:", error);
      setTasks(tasks); // Revert
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div className="p-4 bg-gray-100 rounded-2xl border border-black" ref={provided.innerRef} {...provided.droppableProps}>
                <h2 className="text-xl font-bold mb-2">{status.replace("_", " ")}</h2>
                <div>
                  {tasks.filter((task) => task.status === status).map((task, index) => (
                    <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                      {(provided) => (
                        <div className="mb-2" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskCard task={task} onEdit={onEditTask} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <div className="mb-2">{provided.placeholder}</div>
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;