import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { getDepartments } from "../services/departmentService";
import { getVolunteers } from "../services/volunteerService";
import { useAuth } from "../context/AuthContext";

const PRIORITY_STYLES = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",
};

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

const TaskForm = ({ initialData, onSubmit, onCancel, departments, volunteers }) => {
  const [formData, setFormData] = useState({
    title: "", description: "", priority: "Medium",
    dueDate: "", assignedTo: "", department: "", status: "Pending",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "Medium",
        dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
        assignedTo: initialData.assignedTo?._id || "",
        department: initialData.department?._id || "",
        status: initialData.status || "Pending",
      });
    } else {
      setFormData(prev => ({
        ...prev,
        dueDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required
          placeholder="e.g. Prepare monthly report"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
          placeholder="What needs to be done?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <select name="department" value={formData.department} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">-- Select Department --</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (Volunteer)</label>
        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">-- Select Volunteer --</option>
          {volunteers.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name} {v.department?.name ? `(${v.department.name})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          {initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchDepartments();
    fetchVolunteers();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch { toast.error("Failed to load tasks"); }
    finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try { const res = await getDepartments(); setDepartments(res.data); } catch {}
  };

  const fetchVolunteers = async () => {
    try { const res = await getVolunteers(); setVolunteers(res.data); } catch {}
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        toast.success("Task updated");
      } else {
        await createTask(formData);
        toast.success("Task created and assigned");
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(deleteId);
      toast.success("Task deleted");
      setDeleteId(null);
      fetchTasks();
    } catch { toast.error("Failed to delete task"); }
  };

  // Quick status update without opening the full edit modal
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      fetchTasks();
    } catch { toast.error("Failed to update status"); }
  };

  const filteredTasks = filterStatus === "All" ? tasks : tasks.filter(t => t.status === filterStatus);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const isOverdue = (task) => task.status !== "Completed" && task.status !== "Cancelled" && new Date(task.dueDate) < new Date();

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-500">Assign and track tasks for volunteers</p>
        </div>
        <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 whitespace-nowrap">
          + Assign Task
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", "Pending", "In Progress", "Completed", "Cancelled"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === s ? "bg-primary-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}>
            {s} {s === "All" ? `(${tasks.length})` : `(${tasks.filter(t => t.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? <p className="p-6 text-gray-500">Loading tasks...</p>
          : filteredTasks.length === 0 ? <p className="p-6 text-gray-500">No tasks found.</p>
          : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Task</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <tr key={task._id} className={`text-sm text-gray-700 ${isOverdue(task) ? "bg-red-50" : ""}`}>
                  <td className="px-6 py-4">
                    <p className="font-medium">{task.title}</p>
                    {task.description && <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{task.description}</p>}
                    {isOverdue(task) && <span className="text-red-500 text-xs font-medium">⚠ Overdue</span>}
                  </td>
                  <td className="px-6 py-4">{task.assignedTo?.name || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full">
                      {task.department?.name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(task.dueDate)}</td>
                  <td className="px-6 py-4">
                    {/* Inline status dropdown for quick updates */}
                    <select value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none ${STATUS_STYLES[task.status]}`}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                        className="text-primary-600 hover:underline">Edit</button>
                      {isAdmin && (
                        <button onClick={() => setDeleteId(task._id)}
                          className="text-red-600 hover:underline">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Edit Task" : "Assign New Task"}>
        <TaskForm initialData={editingTask} departments={departments} volunteers={volunteers}
          onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm} message="Delete this task permanently?" />
    </DashboardLayout>
  );
};

export default Tasks;
