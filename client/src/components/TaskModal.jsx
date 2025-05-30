import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function TaskModal({ isOpen, onClose, task, comments, addComment, employees }) {
  const [newComment, setNewComment] = useState("");

  if (!isOpen || !task) return null;

  const priorityColors = {
    low: "bg-green-400/20 text-green-300",
    medium: "bg-yellow-400/20 text-yellow-300",
    high: "bg-red-400/20 text-red-300",
  };

  const statusColors = {
    todo: "bg-gray-400/20 text-gray-300",
    "in-progress": "bg-blue-400/20 text-blue-300",
    done: "bg-green-400/20 text-green-300",
  };

  const handleAddComment = () => {
    addComment(newComment);
    setNewComment("");
  };

  const assignedEmployee = employees.find((emp) => emp.id === task.assigned_to);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-800/50 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-200"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex space-x-3 mb-2">
              <span
                className={`px-2 py-1 rounded-lg text-sm font-medium ${statusColors[task.status] || ""}`}
              >
                {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
              </span>
              <span
                className={`px-2 py-1 rounded-lg text-sm font-medium ${priorityColors[task.priority] || ""}`}
              >
                {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
              </span>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>
                <strong className="text-gray-200">Assigned To:</strong>{" "}
                {assignedEmployee ? `${assignedEmployee.first_name} ${assignedEmployee.last_name}` : "-"}
              </div>
              <div>
                <strong className="text-gray-200">Due:</strong>{" "}
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </div>
              <div>
                <strong className="text-gray-200">Updated:</strong>{" "}
                {new Date(task.updated_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white mb-2">Comments</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800/50 p-2 rounded-lg text-gray-300 text-sm"
                  >
                    {comment.text} <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No comments yet.</p>
              )}
            </div>
            <form
                className="relative w-full"
                onSubmit={e => {
                    e.preventDefault();
                    if (newComment.trim()) handleAddComment();
                }}
                >
                <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full pr-12 pl-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all duration-200"
                    onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (newComment.trim()) handleAddComment();
                    }
                    }}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white rounded-full p-2 hover:bg-cyan-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                    disabled={!newComment.trim()}
                    aria-label="Send comment"
                    tabIndex={0}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </form>
          </div>
        <div className="flex justify-end space-x-4 space-y-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/70 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}