// import TaskCard from "./(components)/TaskCard";
import TaskBoard from "./(components)/TaskBoard";
import { Task } from "@/types/task";

export default function Home() {
  // const task: Task = {
  //   id: 1,
  //   title: "Visit the shops",
  //   description: "Milk, eggs, bread",
  //   status: "TODO",
  //   dueDate: "2025-06-15T10:00:00.000Z",
  //   createdAt: "2025-06-09T14:09:30.507Z",
  //   updatedAt: "2025-06-09T14:09:30.507Z"
  // };

  return (
    <div>
      <TaskBoard/>
    </div>
  );
}
