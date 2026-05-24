import React, { useEffect, useState } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LogOut,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api";

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
      const res = await api.get("/officer/dashboard");
      setDashboardData(res.data.data);
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
      icon: <FileText size={28} />,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Active Cases",
      value: dashboardData?.activeCases || 0,
      icon: <AlertTriangle size={28} />,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "Closed Cases",
      value: dashboardData?.closedCases || 0,
      icon: <CheckCircle size={28} />,
      bg: "bg-green-50",
      text: "text-green-600",
    },
  ];

  const overview = [
    {
      title: "Total FIRs",
      value: dashboardData?.overview?.totalFIRs || 0,
      color: "text-blue-600",
    },
    {
      title: "Total Accused",
      value: dashboardData?.overview?.totalAccused || 0,
      color: "text-red-600",
    },
    {
      title: "Arrested",
      value: dashboardData?.overview?.arrested || 0,
      color: "text-orange-600",
    },
    {
      title: "Bailed",
      value: dashboardData?.overview?.bailed || 0,
      color: "text-green-600",
    },
    {
      title: "Jailed",
      value: dashboardData?.overview?.jailed || 0,
      color: "text-purple-600",
    },
  ];

  const topDistricts = dashboardData?.topDistricts || [];
  const recentCases = dashboardData?.recentCases || [];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F4F7FB]">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Officer Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Welcome, Officer User</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <p className="text-gray-500 font-medium">{item.title}</p>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center`}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            District-wise Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {overview.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center"
              >
                <p className="text-gray-500">{item.title}</p>
                <h3 className={`text-3xl font-bold mt-2 ${item.color}`}>
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Top Districts by FIRs
              </h3>
            </div>

            <div className="space-y-6">
              {topDistricts.length > 0 ? (
                topDistricts.map((item, index) => {
                  const maxValue = Math.max(
                    ...topDistricts.map((d) => d.value || 0),
                    1
                  );

                  const width = ((item.value || 0) / maxValue) * 100;

                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">
                          {item.name || "-"}
                        </span>
                        <span className="font-bold text-gray-900">
                          {item.value || 0}
                        </span>
                      </div>

                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">
                  No district data available
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Recent FIR Cases
              </h3>
            </div>

            <div className="space-y-4">
              {recentCases.length > 0 ? (
                recentCases.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {item.firNumber || "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.districtId?.name || "-"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                        {item.status || "-"}
                      </span>
                      <p className="text-xs text-gray-400 mt-2">
                        {item.dateOfRegistration
                          ? new Date(item.dateOfRegistration).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No recent FIR cases available
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;