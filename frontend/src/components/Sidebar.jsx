import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "📊", adminOnly: false },
    { to: "/volunteers", label: "Volunteers", icon: "🙋", adminOnly: false },
    { to: "/tasks", label: "Tasks", icon: "📋", adminOnly: false },
    { to: "/donors", label: "Donors", icon: "💰", adminOnly: true },
    { to: "/departments", label: "Departments", icon: "🏢", adminOnly: true },
    { to: "/supervisors", label: "Supervisors", icon: "👔", adminOnly: true },
  ].filter(link => !link.adminOnly || isAdmin);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />
      )}
      <aside className={`fixed md:static top-0 left-0 h-full w-64 z-30 transform transition-transform duration-200 flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
        style={{ background: "#1e3a5f" }}>

        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "#1d4ed8", color: "#fff" }}>N</div>
            <h1 className="text-white text-lg font-bold tracking-tight">NGO Manager</h1>
          </div>
          <p className="text-xs ml-11" style={{ color: "#93c5fd" }}>
            {isAdmin ? "Admin Panel" : "Supervisor Panel"}
          </p>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive ? "text-white shadow-sm" : "hover:bg-white/10"
                }`
              }
              style={({ isActive }) => isActive
                ? { background: "#1d4ed8", color: "#fff" }
                : { color: "#bfdbfe" }}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          NGO Manager v1.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;