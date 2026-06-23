import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import VolunteerForm from "../components/VolunteerForm";
import { getVolunteers, createVolunteer, updateVolunteer, deleteVolunteer } from "../services/volunteerService";
import { getDepartments } from "../services/departmentService";
import { useAuth } from "../context/AuthContext";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => { fetchDepartments(); }, []);
  useEffect(() => {
    const timer = setTimeout(() => fetchVolunteers(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch {}
  };

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await getVolunteers(search);
      setVolunteers(res.data);
    } catch { toast.error("Failed to load volunteers"); }
    finally { setLoading(false); }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingVolunteer) {
        await updateVolunteer(editingVolunteer._id, formData);
        toast.success("Volunteer updated successfully");
      } else {
        await createVolunteer(formData);
        toast.success("Volunteer added successfully");
      }
      setIsModalOpen(false);
      fetchVolunteers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteVolunteer(deleteId);
      toast.success("Volunteer deleted");
      setDeleteId(null);
      fetchVolunteers();
    } catch { toast.error("Failed to delete volunteer"); }
  };

  const getDeptName = (v) => v.department?.name || "—";

  const priorityColor = (status) =>
    status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Volunteers</h1>
          <p className="text-gray-500">Manage volunteer records and department assignments</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditingVolunteer(null); setIsModalOpen(true); }}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors whitespace-nowrap">
            + Add Volunteer
          </button>
        )}
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? <p className="p-6 text-gray-500">Loading volunteers...</p>
          : volunteers.length === 0 ? <p className="p-6 text-gray-500">No volunteers found.</p>
          : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Skills</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Status</th>
                {isAdmin && <th className="px-6 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volunteers.map((v) => (
                <tr key={v._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 font-medium">{v.name}</td>
                  <td className="px-6 py-4">{v.email}</td>
                  <td className="px-6 py-4">{v.phone}</td>
                  <td className="px-6 py-4">
                    {v.skills ? (
                      <div className="flex flex-wrap gap-1">
                        {v.skills.split(",").map((s, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
                      {getDeptName(v)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingVolunteer(v); setIsModalOpen(true); }}
                          className="text-primary-600 hover:underline">Edit</button>
                        <button onClick={() => setDeleteId(v._id)}
                          className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingVolunteer ? "Edit Volunteer" : "Add Volunteer"}>
        <VolunteerForm initialData={editingVolunteer} departments={departments}
          onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this volunteer?" />
    </DashboardLayout>
  );
};

export default Volunteers;
