import { useState, useEffect } from "react";

export default function EmployeeModal({ isOpen, onClose, employee, onSave, comments, addComment, roles }) {
  const [form, setForm] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    department: "",
    phone: "",
    hire_date: "",
    is_active: true,
    role_id: null,
  });
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (employee) {
      const role = roles.find((r) => r.id === employee.role_id);
      setForm({
        id: employee.id || "",
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        job_title: role ? role.name : "", // Set job title from role name
        department: employee.department || "",
        phone: employee.phone || "",
        hire_date: employee.hire_date ? new Date(employee.hire_date).toISOString().split("T")[0] : "",
        is_active: employee.is_active || true,
        role_id: employee.role_id || null,
      });
      setIsEditing(!!employee.id); // Enable editing for existing employees
    } else {
      setForm({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        job_title: "",
        department: "",
        phone: "",
        hire_date: "",
        is_active: true,
        role_id: null,
      });
      setIsEditing(false); // New employee starts in edit mode
    }
  }, [employee, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "job_title") {
      const selectedRole = roles.find((r) => r.name === value);
      setForm((prev) => ({
        ...prev,
        job_title: value,
        role_id: selectedRole ? selectedRole.id : null,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleAddComment = () => {
    addComment(newComment);
    setNewComment("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-800/50 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {form.id ? `${form.first_name} ${form.last_name}` : "New Employee"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-all duration-200">
            ×
          </button>
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">First Name</label>
                <input
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Last Name</label>
                <input
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Job Title</label>
                <select
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="job_title"
                  value={form.job_title}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Department</label>
                <input
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Phone</label>
                <input
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Hire Date</label>
                <input
                  type="date"
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="hire_date"
                  value={form.hire_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Status</label>
                <select
                  className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                  name="is_active"
                  value={form.is_active}
                  onChange={handleChange}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
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
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <strong className="text-gray-200">Name:</strong> {form.first_name} {form.last_name}
            </div>
            <div>
              <strong className="text-gray-200">Email:</strong> {form.email}
            </div>
            <div>
              <strong className="text-gray-200">Job Title:</strong> {form.job_title}
            </div>
            <div>
              <strong className="text-gray-200">Department:</strong> {form.department}
            </div>
            <div>
              <strong className="text-gray-200">Phone:</strong> {form.phone}
            </div>
            <div>
              <strong className="text-gray-200">Hire Date:</strong>{" "}
              {new Date(form.hire_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div>
              <strong className="text-gray-200">Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  form.is_active ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"
                }`}
              >
                {form.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <strong className="text-gray-200">Role ID:</strong> {form.role_id || "-"}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-400/20 text-blue-300 rounded-lg hover:bg-blue-400/30 transition-all duration-200"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}