import { useState } from "react";
import TaskList from "./components/TaskList";
import EmployeeList from "./components/EmployeeList";

export default function App() {
  const [view, setView] = useState("tasks");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-['Inter']">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            className={`px-4 py-2 rounded-lg mr-2 ${
              view === "tasks" ? "bg-cyan-600 text-white" : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
            } transition-all duration-200`}
            onClick={() => setView("tasks")}
          >
            Tasks
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              view === "employees" ? "bg-cyan-600 text-white" : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
            } transition-all duration-200`}
            onClick={() => setView("employees")}
          >
            Employees
          </button>
        </div>
        {view === "tasks" ? <TaskList /> : <EmployeeList />}
      </div>
    </div>
  );
}