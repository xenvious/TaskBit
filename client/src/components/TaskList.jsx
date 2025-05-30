import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskModal from "./TaskModal";

const statusFilters = ["all", "todo", "in-progress", "done"];
const priorityFilters = ["all", "low", "medium", "high"];

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [alert, setAlert] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [comments, setComments] = useState({});
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  useEffect(() => {
    let t = [...tasks];
    if (status !== "all") t = t.filter((task) => task.status === status);
    if (priority !== "all") t = t.filter((task) => task.priority === priority);
    if (search.trim())
      t = t.filter((task) => task.title.toLowerCase().includes(search.trim().toLowerCase()));

    if (sortField) {
      t.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === "due_date" || sortField === "updated_at") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (sortOrder === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
    }
    setFiltered(t);
  }, [tasks, status, priority, search, sortField, sortOrder]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch {
      setAlert({ type: "error", msg: "Failed to load tasks." });
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch {
      setAlert({ type: "error", msg: "Failed to load employees." });
    }
  };

  const handleAddOrEdit = async (form) => {
    try {
      const res = await fetch(
        editTask ? `/api/tasks/${editTask.id}` : "/api/tasks",
        {
          method: editTask ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error();
      await fetchTasks();
      setAlert({ type: "success", msg: `Task ${editTask ? "updated" : "created"}!` });
      setShowForm(false);
      setEditTask(null);
    } catch {
      setAlert({ type: "error", msg: "Failed to save task." });
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchTasks();
      setAlert({ type: "success", msg: "Task deleted." });
      setSelectedTask(null);
    } catch {
      setAlert({ type: "error", msg: "Failed to delete task." });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const addComment = (taskId, comment) => {
    if (comment.trim()) {
      setComments((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), { id: Date.now(), text: comment, timestamp: new Date().toLocaleString() }],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-['Inter'] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">TaskBit</h1>
        {alert && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg ${
              alert.type === "success" ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"
            } transition-all duration-200`}
          >
            {alert.msg}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex space-x-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
            >
              {statusFilters.map((f) => (
                <option key={f} value={f} className="bg-gray-900">
                  {f === "all" ? "All Statuses" : f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
            >
              {priorityFilters.map((f) => (
                <option key={f} value={f} className="bg-gray-900">
                  {f === "all" ? "All Priorities" : f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search by title..."
              className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200 sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-200"
            onClick={() => {
              setShowForm(true);
              setEditTask(null);
            }}
          >
            + Add Task
          </button>
        </div>
        <div className="bg-gray-900/80 rounded-xl border border-gray-800/50 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("title")}
                >
                  Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("status")}
                >
                  Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("priority")}
                >
                  Priority {sortField === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("due_date")}
                >
                  Due Date {sortField === "due_date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("updated_at")}
                >
                  Updated {sortField === "updated_at" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("assigned_to")}
                >
                  Assigned To {sortField === "assigned_to" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filtered.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className="px-4 py-3 text-white">{task.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          task.status === "todo"
                            ? "bg-gray-400/20 text-gray-300"
                            : task.status === "in-progress"
                            ? "bg-blue-400/20 text-blue-300"
                            : "bg-green-400/20 text-green-300"
                        }`}
                      >
                        {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          task.priority === "low"
                            ? "bg-green-400/20 text-green-300"
                            : task.priority === "medium"
                            ? "bg-yellow-400/20 text-yellow-300"
                            : "bg-red-400/20 text-red-300"
                        }`}
                      >
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(task.updated_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {employees.find((emp) => emp.id === task.assigned_to)?.first_name +
                        " " +
                        employees.find((emp) => emp.id === task.assigned_to)?.last_name || "-"}
                    </td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTask(task);
                          setShowForm(true);
                        }}
                        className="px-3 py-1 bg-blue-400/20 text-blue-300 rounded-lg hover:bg-blue-400/30 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task);
                        }}
                        className="px-3 py-1 bg-red-400/20 text-red-300 rounded-lg hover:bg-red-400/30 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TaskForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditTask(null);
          }}
          onSubmit={handleAddOrEdit}
          initialData={editTask}
          employees={employees}
        />
        <TaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          comments={comments[selectedTask?.id] || []}
          addComment={(comment) => addComment(selectedTask.id, comment)}
          employees={employees}
        />
      </div>
    </div>
  );
}