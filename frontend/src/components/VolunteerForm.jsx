import { useState, useEffect } from "react";

const VolunteerForm = ({ initialData, onSubmit, onCancel, departments = [] }) => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", skills: "",
    address: "", status: "Active", department: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        skills: initialData.skills || "",
        address: initialData.address || "",
        status: initialData.status || "Active",
        department: initialData.department?._id || initialData.department || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { label: "Full Name", name: "name", type: "text", required: true },
        { label: "Email", name: "email", type: "email", required: true },
        { label: "Phone", name: "phone", type: "tel", required: true },
        { label: "Skills (comma-separated)", name: "skills", type: "text", placeholder: "e.g. Teaching, First Aid" },
        { label: "Address", name: "address", type: "text" },
      ].map(({ label, name, type, required, placeholder }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input type={type} name={name} value={formData[name]} onChange={handleChange}
            required={required} placeholder={placeholder || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select name="department" value={formData.department} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">-- Unassigned --</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
        <button type="submit"
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
          {initialData ? "Update Volunteer" : "Add Volunteer"}
        </button>
      </div>
    </form>
  );
};

export default VolunteerForm;
