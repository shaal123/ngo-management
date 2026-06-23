import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-sm">
      <button onClick={onMenuClick} className="md:hidden text-gray-500 text-2xl">☰</button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-gray-800 font-medium text-sm">{user?.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={isAdmin
              ? { background: "#dbeafe", color: "#1e3a8f" }
              : { background: "#e0f2fe", color: "#0369a1" }}>
            {isAdmin ? "Admin" : `Supervisor · ${user?.department?.name || ""}`}
          </span>
        </div>
        <button onClick={handleLogout}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ background: "#fee2e2", color: "#b91c1c" }}
          onMouseEnter={e => e.target.style.background = "#fecaca"}
          onMouseLeave={e => e.target.style.background = "#fee2e2"}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
