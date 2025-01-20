import { ChangeEvent, useEffect, useRef, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

interface Task {
  id: number;
  index: number;
  todo: string;
}

function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const input = useRef<HTMLInputElement | null>(null);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const focus = (index: number) => {
    setId(index);
    setEditMode(true);
    if (input.current) input.current.focus();
  };
  useEffect(() => {
    fetchTasks();
  }, [tasks]);
  const [newTask, setNewTask] = useState("");

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const addTask = async () => {
    if (!newTask) {
      return;
    }
    try {
      const taskData = {
        index: tasks.length, // Use the correct index for new task
        todo: newTask,
      };

      const response = await fetch("http://127.0.0.1:8000/addTodo/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      setTasks((prev) => [...prev, data]); // Add new task to the list
      setNewTask(""); // Clear the input field
    } catch (e: any) {
      console.log(e);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/getTodos/");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setTasks(data); // Set the fetched tasks to state
    } catch (err: any) {
      console.log(err); // Handle error
    }
  };

  const deleteTask = async (index: number) => {
    const response = await fetch(`http://127.0.0.1:8000/getTodo/${index}`, {
      method: "DELETE",
    });
    await response.json();

    fetchTasks();
    // Correct index for deletion
  };
  const editTask = async (index: number | undefined) => {
    const taskData = {
      index: index, // Use the correct index for new task
      todo: newTask,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/getTodo/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.index === index ? data : task))
      );
    } catch (e) {
      console.log(e);
    }
    setEditMode(false);
    setNewTask("");
    fetchTasks();
  };

  return (
    <div className="to-do-list">
      <h1 className="header">To-Do-List</h1>
      <input
        ref={input}
        type="text"
        value={newTask}
        id="task"
        placeholder="Enter a task"
        onChange={change}
      />
      <button
        className="add-button"
        onClick={() => {
          isEditMode ? editTask(id) : addTask();
        }}
      >
        {isEditMode ? "Edit" : "Add"}
      </button>
      <ol>
        {tasks.map((task) => (
          <li key={task.id}>
            {" "}
            {/* Use `task.id` instead of `index` for unique key */}
            <span className="list">{task.todo} </span>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.index)} // Use `task.id` for deletion
            >
              <RiDeleteBinLine />
            </button>
            <button
              className="edit-button"
              onClick={() => focus(task.index)} // Use `task.id` for editing
            >
              <FaRegEdit />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;
