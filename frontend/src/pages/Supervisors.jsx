import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { getSupervisors, createSupervisor, updateSupervisor, deleteSupervisor } from "../services/supervisorService";
import { getDepartments } from "../services/departmentService";

const SupervisorForm = ({ initialData, onSubmit, onCancel, departments }) => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", department: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "", // never pre-fill password
        phone: initialData.phone || "",
        department: initialData.department?._id || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {initialData ? "New Password (leave blank to keep current)" : "Password"}
        </label>
        <input type="password" name="password" value={formData.password} onChange={handleChange}
          required={!initialData} placeholder={initialData ? "Leave blank to keep unchanged" : "Min 6 characters"}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <select name="department" value={formData.department} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">-- Select Department --</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        {departments.length === 0 && (
          <p className="text-orange-500 text-xs mt-1">⚠ Create a department first before adding a supervisor.</p>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          {initialData ? "Update Supervisor" : "Create Supervisor"}
        </button>
      </div>
    </form>
  );
};

const Supervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSupervisors();
    fetchDepartments();
  }, []);

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const res = await getSupervisors();
      setSupervisors(res.data);
    } catch { toast.error("Failed to load supervisors"); }
    finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch {}
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Remove password field if blank (editing without changing password)
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      if (editingSupervisor) {
        await updateSupervisor(editingSupervisor._id, payload);
        toast.success("Supervisor updated");
      } else {
        await createSupervisor(payload);
        toast.success("Supervisor account created");
      }
      setIsModalOpen(false);
      fetchSupervisors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSupervisor(deleteId);
      toast.success("Supervisor deleted");
      setDeleteId(null);
      fetchSupervisors();
    } catch { toast.error("Failed to delete supervisor"); }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Supervisors</h1>
          <p className="text-gray-500">Manage supervisor accounts — they can log in and assign tasks</p>
        </div>
        <button onClick={() => { setEditingSupervisor(null); setIsModalOpen(true); }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 whitespace-nowrap">
          + Add Supervisor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? <p className="p-6 text-gray-500">Loading...</p>
          : supervisors.length === 0 ? <p className="p-6 text-gray-500">No supervisors yet. Create one above.</p>
          : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {supervisors.map((s) => (
                <tr key={s._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 font-medium">{s.name}</td>
                  <td className="px-6 py-4">{s.email}</td>
                  <td className="px-6 py-4">{s.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
                      {s.department?.name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => { setEditingSupervisor(s); setIsModalOpen(true); }}
                        className="text-primary-600 hover:underline">Edit</button>
                      <button onClick={() => setDeleteId(s._id)}
                        className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingSupervisor ? "Edit Supervisor" : "Add Supervisor"}>
        <SupervisorForm initialData={editingSupervisor} departments={departments}
          onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        message="Delete this supervisor account? They will no longer be able to log in." />
    </DashboardLayout>
  );
};

export default Supervisors;
