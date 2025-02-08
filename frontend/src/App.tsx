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
  const editRef = useRef<HTMLSpanElement | null>(null);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [tasks]);
  useEffect(() => {
    if (isEditMode && editRef.current) {
      // Focus the element.
      editRef.current.innerText = newTask;
      editRef.current.focus();
      // Create a range and collapse it to the end.
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      // Update the selection.
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [isEditMode]);

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
  };

  const editTask = async (index: number | undefined) => {
    if (index === undefined) return;
    const taskData = {
      index: index, // Use the correct index for the task
      todo: newTask,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/getTodo/${index}`, {
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

  // When the edit button is clicked, set edit mode for that task.
  // This copies the current todo text to state and marks the task for editing.
  const focus = (index: number) => {
    setId(index);
    setNewTask(tasks.find((task) => task.index === index)?.todo || "");
    setEditMode(true);
  };

  return (
    <div className="to-do-list">
      <h1 className="header">To-Do-List</h1>
      <input
        ref={input}
        type="text"
        value={isEditMode ? "" : newTask}
        id="task"
        placeholder="Enter a task"
        onChange={change}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTask();
          }
        }}
      />
      <button className="add-button" onClick={addTask}>
        Add
      </button>
      <ol>
        {tasks.map((task) => (
          <li key={task.id}>
            {isEditMode && task.index === id ? (
              // Using a contentEditable span for inline editing.
              <span
                className="list"
                contentEditable
                suppressContentEditableWarning
                // Focus the element and set the caret to the end.
                ref={editRef}
                // Update state as the content changes.
                onInput={(e) => setNewTask(e.currentTarget.textContent || "")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent newline insertion.
                    editTask(task.index);
                  }
                }}
                onBlur={() => editTask(task.index)}
              ></span>
            ) : (
              <span className="list">{task.todo}</span>
            )}
            <button
              className="delete-button"
              onClick={() => deleteTask(task.index)}
            >
              <RiDeleteBinLine />
            </button>
            <button className="edit-button" onClick={() => focus(task.index)}>
              <FaRegEdit />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;
