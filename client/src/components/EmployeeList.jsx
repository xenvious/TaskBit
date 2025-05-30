import { useState, useEffect } from "react";
import EmployeeModal from "./EmployeeModal";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [alert, setAlert] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [comments, setComments] = useState({});
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  useEffect(() => {
    let e = [...employees];
    if (search.trim()) {
      e = e.filter(
        (emp) =>
          `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search.trim().toLowerCase()) ||
          emp.email.toLowerCase().includes(search.trim().toLowerCase()) ||
          emp.job_title.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    if (sortField) {
      e.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === "hire_date" || sortField === "created_at") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (sortOrder === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
    }
    setFiltered(e);
  }, [employees, search, sortField, sortOrder]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setAlert({ type: "error", msg: "Failed to load employees." });
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      setAlert({ type: "error", msg: "Failed to load roles." });
    }
  };

  const handleAddOrEdit = async (form) => {
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `/api/employees/${form.id}` : "/api/employees";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          job_title: form.job_title, // Note: This will be set from roles, but kept for compatibility
          department: form.department,
          phone: form.phone,
          hire_date: form.hire_date,
          is_active: form.is_active,
          role_id: form.role_id,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchEmployees();
      setAlert({
        type: "success",
        msg: `Employee ${form.id ? "updated" : "added"}!`,
      });
      setSelectedEmployee(null);
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await fetchEmployees();
      setAlert({ type: "success", msg: "Employee deleted." });
      setSelectedEmployee(null);
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
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

  const addComment = (employeeId, comment) => {
    if (comment.trim()) {
      setComments((prev) => ({
        ...prev,
        [employeeId]: [...(prev[employeeId] || []), { id: Date.now(), text: comment, timestamp: new Date().toLocaleString() }],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-['Inter'] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Employee Management</h1>
        {alert && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg ${
              alert.type === "success" ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"
            } transition-all duration-200`}
          >
            {alert.msg}
          </div>
        )}
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or job title..."
            className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200 w-full sm:w-96"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-200 ml-4"
            onClick={() => setSelectedEmployee({})}
          >
            + Add Employee
          </button>
        </div>
        <div className="bg-gray-900/80 rounded-xl border border-gray-800/50 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("id")}
                >
                  ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("first_name")}
                >
                  Name {sortField === "first_name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("job_title")}
                >
                  Job Title {sortField === "job_title" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("department")}
                >
                  Department {sortField === "department" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("email")}
                >
                  Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("phone")}
                >
                  Phone {sortField === "phone" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("hire_date")}
                >
                  Hire Date {sortField === "hire_date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-200 cursor-pointer hover:text-cyan-400 transition-all duration-200"
                  onClick={() => handleSort("is_active")}
                >
                  Status {sortField === "is_active" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-400">
                    No employees found.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="px-4 py-3 text-white">{emp.id}</td>
                    <td className="px-4 py-3 text-white">{`${emp.first_name} ${emp.last_name}`}</td>
                    <td className="px-4 py-3 text-gray-400">{emp.job_title}</td>
                    <td className="px-4 py-3 text-gray-400">{emp.department}</td>
                    <td className="px-4 py-3 text-gray-400">{emp.email}</td>
                    <td className="px-4 py-3 text-gray-400">{emp.phone}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(emp.hire_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          emp.is_active ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"
                        }`}
                      >
                        {emp.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(emp);
                        }}
                        className="px-3 py-1 bg-blue-400/20 text-blue-300 rounded-lg hover:bg-blue-400/30 transition-all duration-200"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(emp.id);
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
        <EmployeeModal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
          onSave={handleAddOrEdit}
          comments={comments[selectedEmployee?.id] || []}
          addComment={(comment) => addComment(selectedEmployee?.id, comment)}
          roles={roles}
        />
      </div>
    </div>
  );
}