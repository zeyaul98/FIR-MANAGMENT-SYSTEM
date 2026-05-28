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
        <main className="flex-1 p-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm animate-pulse">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Officer Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Case analytics and FIR summary
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm border p-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-slate-500 font-semibold">{item.title}</p>
                  <h2 className="text-3xl font-black mt-2 text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}
                >
                  <Icon size={28} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* OVERVIEW */}
        <h2 className="text-2xl font-black text-slate-900 mt-9 mb-5">
          District-wise Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {overview.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.04 }}
                className="bg-white rounded-xl shadow-sm border p-5 text-center"
              >
                <div className="flex justify-center mb-2">
                  <Icon size={22} className={item.color} />
                </div>

                <p className="text-slate-500 font-semibold text-sm">
                  {item.title}
                </p>

                <h3 className={`text-3xl font-black mt-2 ${item.color}`}>
                  {item.value}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* TOP DISTRICTS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-7 mt-7"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-blue-600" />
            <h3 className="text-xl font-black text-slate-900">
              Top Districts by FIRs
            </h3>
          </div>

          {topDistricts.length > 0 ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topDistricts}
                  layout="vertical"
                  margin={{ top: 10, right: 40, left: 80, bottom: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 13, fill: "#334155" }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[0, 10, 10, 0]}
                    barSize={26}
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

        {/* DONUT CHART */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-7 mt-7"
        >
          <h3 className="text-xl font-black text-slate-900 mb-6">
            Accused Status Distribution
          </h3>

          {accusedChartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accusedChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    label
                  >
                    {accusedChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
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