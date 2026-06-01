import React, { useEffect, useState } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LogOut,
  Users,
  ShieldCheck,
  Activity,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchDashboard = async () => {
    try {
      const res = await apiCall("/api/officer/dashboard");
      setDashboardData(res.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "My Cases",
      value: dashboardData?.myCases || 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Cases",
      value: dashboardData?.activeCases || 0,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Closed Cases",
      value: dashboardData?.closedCases || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const overview = [
    {
      title: "Total FIRs",
      value: dashboardData?.overview?.totalFIRs || 0,
      icon: FileText,
      color: "text-blue-700",
    },
    {
      title: "Total Accused",
      value: dashboardData?.overview?.totalAccused || 0,
      icon: Users,
      color: "text-red-700",
    },
    {
      title: "Arrested",
      value: dashboardData?.overview?.arrested || 0,
      icon: AlertTriangle,
      color: "text-orange-700",
    },
    {
      title: "Bailed",
      value: dashboardData?.overview?.bailed || 0,
      icon: ShieldCheck,
      color: "text-green-700",
    },
    {
      title: "Jailed",
      value: dashboardData?.overview?.jailed || 0,
      icon: Activity,
      color: "text-purple-700",
    },
  ];

  const topDistricts = dashboardData?.topDistricts || [];

  const accusedChartData = [
    {
      name: "Arrested",
      value: dashboardData?.overview?.arrested || 0,
      color: "#f97316",
    },
    {
      name: "Bailed",
      value: dashboardData?.overview?.bailed || 0,
      color: "#22c55e",
    },
    {
      name: "Jailed",
      value: dashboardData?.overview?.jailed || 0,
      color: "#7c3aed",
    },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm animate-pulse">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-7">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Officer Dashboard
            </h1>

            <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
              Case analytics and FIR summary
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-slate-500 font-semibold text-sm sm:text-base">
                    {item.title}
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}
                >
                  <Icon size={24} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* OVERVIEW */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-5">
          District-wise Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {overview.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-sm border p-4 sm:p-5 text-center"
              >
                <div className="flex justify-center mb-2">
                  <Icon size={20} className={item.color} />
                </div>

                <p className="text-slate-500 font-semibold text-xs sm:text-sm">
                  {item.title}
                </p>

                <h3 className={`text-2xl sm:text-3xl font-black mt-2 ${item.color}`}>
                  {item.value}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* TOP DISTRICTS */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-4 sm:p-7 mt-7"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-blue-600" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Top Districts by FIRs
            </h3>
          </div>

          {topDistricts.length > 0 ? (
            <div className="h-[320px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topDistricts}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <XAxis type="number" hide />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{
                      fontSize: 11,
                      fill: "#334155",
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[0, 10, 10, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-500 font-semibold">
              No district data available
            </p>
          )}
        </motion.div>

        {/* PIE CHART */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-4 sm:p-7 mt-7"
        >
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-6">
            Accused Status Distribution
          </h3>

          {accusedChartData.length > 0 ? (
            <div className="h-[280px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accusedChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                    label
                  >
                    {accusedChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-500 font-semibold">
              No accused status data available
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;