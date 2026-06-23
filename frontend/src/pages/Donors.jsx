import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DonorForm from "../components/DonorForm";
import {
  getDonors,
  createDonor,
  updateDonor,
  deleteDonor,
} from "../services/donorService";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDonors();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const response = await getDonors(search);
      setDonors(response.data);
    } catch (error) {
      toast.error("Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingDonor(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (donor) => {
    setEditingDonor(donor);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingDonor) {
        await updateDonor(editingDonor._id, formData);
        toast.success("Donor updated successfully");
      } else {
        await createDonor(formData);
        toast.success("Donor added successfully");
      }
      setIsModalOpen(false);
      fetchDonors();
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDonor(deleteId);
      toast.success("Donor deleted");
      setDeleteId(null);
      fetchDonors();
    } catch (error) {
      toast.error("Failed to delete donor");
    }
  };

  // Format date nicely (e.g. "12 Jun 2026") instead of raw ISO string
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Donors</h1>
          <p className="text-gray-500">Manage your donor records</p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
        >
          + Add Donor
        </button>
      </div>

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email..."
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading donors...</p>
        ) : donors.length === 0 ? (
          <p className="p-6 text-gray-500">No donors found.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Mode</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donors.map((d) => (
                <tr key={d._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 font-medium">{d.name}</td>
                  <td className="px-6 py-4">{d.email}</td>
                  <td className="px-6 py-4">{d.phone}</td>
                  <td className="px-6 py-4 font-medium text-green-700">
                    ₹{d.donationAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{formatDate(d.donationDate)}</td>
                  <td className="px-6 py-4">{d.paymentMode}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditClick(d)}
                        className="text-primary-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(d._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDonor ? "Edit Donor" : "Add Donor"}
      >
        <DonorForm
          initialData={editingDonor}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this donor record? This action cannot be undone."
      />
    </DashboardLayout>
  );
};

export default Donors;
