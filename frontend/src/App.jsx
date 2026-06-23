import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Volunteers from "./pages/Volunteers";
import Donors from "./pages/Donors";
import Departments from "./pages/Departments";
import Supervisors from "./pages/Supervisors";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Both admin and supervisor can access these */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/volunteers" element={<ProtectedRoute><Volunteers /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />

          {/* Admin-only pages */}
          <Route path="/donors" element={<AdminRoute><Donors /></AdminRoute>} />
          <Route path="/departments" element={<AdminRoute><Departments /></AdminRoute>} />
          <Route path="/supervisors" element={<AdminRoute><Supervisors /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
