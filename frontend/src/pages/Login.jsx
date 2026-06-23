import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f172a" }}>

      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2"
        style={{ background: "#1e3a5f" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white mb-6"
          style={{ background: "#1d4ed8" }}>N</div>
        <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
          NGO Volunteer &<br />Donor Management
        </h1>
        <p className="text-lg" style={{ color: "#93c5fd" }}>
          Streamline your operations, manage volunteers and donors from one place.
        </p>
        <div className="mt-10 flex gap-8">
          {[["Volunteers", "Track skills & departments"], ["Donors", "Manage contributions"], ["Tasks", "Assign & monitor work"]].map(([title, desc]) => (
            <div key={title}>
              <p className="text-white font-semibold text-sm">{title}</p>
              <p className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-1 text-sm" style={{ color: "#94a3b8" }}>Sign in to your admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#cbd5e1" }}>
                Email address
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="admin@ngo.com"
                className="w-full px-4 py-2.5 rounded-lg text-white placeholder-gray-500 border outline-none transition-colors"
                style={{ background: "#1e293b", borderColor: "#334155", fontSize: "14px" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#334155"} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#cbd5e1" }}>
                Password
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg text-white placeholder-gray-500 border outline-none transition-colors"
                style={{ background: "#1e293b", borderColor: "#334155", fontSize: "14px" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#334155"} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity disabled:opacity-60 mt-2"
              style={{ background: "#1d4ed8" }}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#475569" }}>
            Admin &amp; Supervisor login · NGO Manager
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
