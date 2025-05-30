import { useState, useEffect } from "react";

const statusOptions = ["todo", "in-progress", "done"];
const priorityOptions = ["low", "medium", "high"];

export default function TaskForm({ onSubmit, onClose, initialData, isOpen }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    due_date: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ title: "", description: "", status: "todo", priority: "medium", due_date: "" });
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-800/50 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        <h2 className="text-xl font-bold text-white mb-4">{initialData ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">Title <span className="text-red-400">*</span></label>
            <input
              className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Description <span className="text-red-400">*</span></label>
            <textarea
              className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-200">Status</label>
              <select
                className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-gray-900">
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-200">Priority</label>
              <select
                className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {priorityOptions.map((opt) => (
                  <option key={opt} value={opt} max-w-sm className="bg-gray-900">
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Due Date</label>
            <input
              type="date"
              name="due_date"
              className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
              value={form.due_date ? form.due_date.split("T")[0] : ""}
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/70 transition-all duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-200"
            >
              {initialData ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}