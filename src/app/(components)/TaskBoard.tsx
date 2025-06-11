"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

const statuses = ["TODO", "IN_PROGRESS", "DONE"];
const authHeader = `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`;

const Board = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks", {
          headers: {
            "Authorization": authHeader,
          },
        });
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      task.id.toString() === draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );

    setTasks(updatedTasks);

    try {
      await fetch(`/api/tasks/${draggableId}/patch`, {
        method: "PATCH",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });
    } catch (error) {
      console.error("Failed to update task:", error);
      setTasks(tasks);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

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
                <div className="space-y-2">
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
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
