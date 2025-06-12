"use client"

import { useEffect, useState } from "react";
import NavBar from "./(components)/NavBar";
import TaskBoard from "./(components)/TaskBoard";
import { Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <NavBar onTaskCreated={fetchTasks} />
      <br />
      <div className="px-20">
        <TaskBoard tasks={tasks} loading={loading} setTasks={setTasks} />
      </div>
    </div>
  );
}