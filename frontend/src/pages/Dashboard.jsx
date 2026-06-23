import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import { getDashboardStats } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin, user } = useAuth();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">
        {isAdmin ? "Overview of your NGO's activity" : `Viewing: ${user?.department?.name} Department`}
      </p>

      {loading ? <p className="text-gray-500">Loading stats...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Volunteers" value={stats?.totalVolunteers ?? 0} icon="🙋" color="bg-blue-100" />
          <StatCard title="Active Volunteers" value={stats?.activeVolunteers ?? 0} icon="✅" color="bg-green-100" />
          <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon="📋" color="bg-orange-100" />
          <StatCard title="Pending Tasks" value={stats?.pendingTasks ?? 0} icon="⏳" color="bg-red-100" />
          {isAdmin && (
            <>
              <StatCard title="Total Donors" value={stats?.totalDonors ?? 0} icon="💰" color="bg-yellow-100" />
              <StatCard title="Total Donations" value={`₹${(stats?.totalDonationAmount ?? 0).toLocaleString()}`} icon="📈" color="bg-purple-100" />
              <StatCard title="Departments" value={stats?.totalDepartments ?? 0} icon="🏢" color="bg-teal-100" />
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
