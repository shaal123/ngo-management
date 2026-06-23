import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../services/departmentService";

const DepartmentForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (initialData) setFormData({ name: initialData.name || "", description: initialData.description || "" });
  }, [initialData]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required placeholder="e.g. Education, Health, Fundraising"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3} placeholder="What does this department do?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          {initialData ? "Update Department" : "Create Department"}
        </button>
      </div>
    </form>
  );
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch { toast.error("Failed to load departments"); }
    finally { setLoading(false); }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingDept) {
        await updateDepartment(editingDept._id, formData);
        toast.success("Department updated");
      } else {
        await createDepartment(formData);
        toast.success("Department created");
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDepartment(deleteId);
      toast.success("Department deleted");
      setDeleteId(null);
      fetchDepartments();
    } catch { toast.error("Failed to delete department"); }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-500">Organise your NGO into departments</p>
        </div>
        <button onClick={() => { setEditingDept(null); setIsModalOpen(true); }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 whitespace-nowrap">
          + New Department
        </button>
      </div>

      {loading ? <p className="text-gray-500">Loading...</p> : departments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">🏢</p>
          <p className="text-gray-600 font-medium">No departments yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first department to start organising volunteers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-lg">🏢</div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingDept(dept); setIsModalOpen(true); }}
                    className="text-primary-600 text-sm hover:underline">Edit</button>
                  <button onClick={() => setDeleteId(dept._id)}
                    className="text-red-600 text-sm hover:underline">Delete</button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{dept.name}</h3>
              {dept.description && <p className="text-gray-500 text-sm mt-1">{dept.description}</p>}
              <p className="text-gray-400 text-xs mt-3">
                Created {new Date(dept.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingDept ? "Edit Department" : "New Department"}>
        <DepartmentForm initialData={editingDept} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        message="Delete this department? Volunteers assigned to it will become unassigned." />
    </DashboardLayout>
  );
};

export default Departments;
