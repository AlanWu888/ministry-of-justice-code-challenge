"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

const initialTasks: Task[] = [
    {
        id: 1,
        title: "Task 1",
        description: "Description",
        status: "TODO",
        dueDate: "2025-06-15T10:00:00.000Z",
        createdAt: "2025-06-09T14:09:30.507Z",
        updatedAt: "2025-06-09T14:09:30.507Z"
    },
    {
        id: 2,
        title: "Task 2",
        description: "Description",
        status: "IN_PROGRESS",
        dueDate: "2025-06-15T10:00:00.000Z",
        createdAt: "2025-06-09T14:09:30.507Z",
        updatedAt: "2025-06-09T14:09:30.507Z"
    },
    {
        id: 3,
        title: "Task 3",
        description: "Description",
        status: "DONE",
        dueDate: "2025-06-15T10:00:00.000Z",
        createdAt: "2025-06-09T14:09:30.507Z",
        updatedAt: "2025-06-09T14:09:30.507Z"
    },
    {
        id: 4,
        title: "Task 4",
        description: "Description",
        status: "DONE",
        dueDate: "2025-06-15T10:00:00.000Z",
        createdAt: "2025-06-09T14:09:30.507Z",
        updatedAt: "2025-06-09T14:09:30.507Z"
    },
];

const statuses = ["TODO", "IN_PROGRESS", "DONE"];

const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
  
    if (!destination || destination.droppableId === source.droppableId) return;
  
    setTasks((prev) =>
      prev.map((task) =>
        task.id.toString() === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );
  };  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                className="p-4 bg-gray-100 rounded"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-xl font-bold mb-2">{status.replace("_", " ")}</h2>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
