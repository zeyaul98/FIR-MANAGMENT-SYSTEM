import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Lock,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  FileText,
  BarChart3,
  Zap,
  Radio,
  Search,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import useReportStore from "../components/reportStore";
import { apiCall } from "../../api";

const Reports = () => {
  const { activeTab, setActiveTab } = useReportStore();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [monthlyMonth, setMonthlyMonth] = useState("");
  const [dailyDate, setDailyDate] = useState("");
  const [reportMeta, setReportMeta] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    fetchStats();
  }, []);


  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

 useEffect(() => {
  if (!selectedReport) return;
  fetchReportData(selectedReport, { skipReset: true });
}, [selectedReport, debouncedSearch, filterStatus, pagination.page, dailyDate, monthlyMonth]);

  const buildQueryString = (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return query.toString() ? `?${query.toString()}` : "";
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/api/dashboard/stats", { method: "GET" });
      if (response.success) {
        
        const data = response.data;
        setStats([
          { icon: FileText, label: "Total FIRs", value: data.totalFIRs?.toString() || "0", subtext: "All registered FIRs", color: "blue" },
          { icon: Users, label: "Total Accused", value: data.totalAccused?.toString() || "0", subtext: "In all FIRs", color: "red" },
          { icon: Lock, label: "Total Bailers", value: data.totalBailed?.toString() || "0", subtext: "Released on bail", color: "green" },
          { icon: Radio, label: "Repeat Offenders", value: "—", subtext: "2+ FIRs each", color: "orange" },
          { icon: Lock, label: "In Custody", value: data.totalInCustody?.toString() || "0", subtext: "Jail custody status", color: "red" },
          { icon: MapPin, label: "Total Districts", value: data.totalDistricts?.toString() || "0", subtext: "Jurisdiction area", color: "teal" },
          { icon: Zap, label: "Total Thanas", value: data.totalThanas?.toString() || "0", subtext: "Police stations", color: "cyan" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const reports = [
    {
      id: "accused",
      icon: Users,
      title: "All Accused Database",
      description: "Complete database of all accused persons",
      type: "Database",
    },
    {
      id: "bailers",
      icon: Lock,
      title: "All Bailers Database",
      description: "Complete database of all bailers/sureties",
      type: "Database",
    },
    {
      id: "district",
      icon: MapPin,
      title: "District Wise Report",
      description: "Crime statistics grouped by district",
      type: "Analysis",
    },
    {
      id: "thana",
      icon: Radio,
      title: "Thana Wise Report",
      description: "Crime statistics grouped by police station",
      type: "Analysis",
    },
    {
      id: "repeat",
      icon: AlertCircle,
      title: "Repeat Offenders",
      description: "List of repeat offenders and their cases",
      type: "Alert",
    },
    {
      id: "custody",
      icon: Lock,
      title: "Custody Status Report",
      description: "Current custody status of all accused",
      type: "Status",
    },
    {
      id: "daily",
      icon: Calendar,
      title: "Daily FIR Report",
      description: "Generate daily FIR registration summary",
      type: "Daily",
    },
    {
      id: "monthly",
      icon: BarChart3,
      title: "Monthly Crime Report",
      description: "Comprehensive monthly crime analysis",
      type: "Monthly",
    },
    {
      id: "firs",
      icon: FileText,
      title: "FIRs Database",
      description: "Search and view all FIR records",
      type: "Database",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "border-blue-500 bg-blue-50",
      red: "border-red-500 bg-red-50",
      green: "border-green-500 bg-green-50",
      purple: "border-purple-500 bg-purple-50",
      orange: "border-orange-500 bg-orange-50",
      teal: "border-teal-500 bg-teal-50",
      cyan: "border-cyan-500 bg-cyan-50",
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color) => {
    const mapping = {
      blue: "bg-blue-100 text-blue-600",
      red: "bg-red-100 text-red-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      teal: "bg-teal-100 text-teal-600",
      cyan: "bg-cyan-100 text-cyan-600",
    };
    return mapping[color] || mapping.blue;
  };

  const getTypeColor = (type) => {
    const types = {
      Database: "bg-red-100 text-red-700",
      Analysis: "bg-blue-100 text-blue-700",
      Alert: "bg-orange-100 text-orange-700",
      Status: "bg-pink-100 text-pink-700",
      Daily: "bg-cyan-100 text-cyan-700",
      Monthly: "bg-purple-100 text-purple-700",
      Custom: "bg-green-100 text-green-700",
    };
    return types[type] || types.Database;
  };

  const getReportMetric = (reportId) => {
    switch (reportId) {
      case "accused":
        return { value: stats.find((stat) => stat.label === "Total Accused")?.value || "—", label: "Accused" };
      case "bailers":
        return { value: stats.find((stat) => stat.label === "Total Bailers")?.value || "—", label: "Bailers" };
      case "district":
        return { value: stats.find((stat) => stat.label === "Total Districts")?.value || "—", label: "Districts" };
      case "thana":
        return { value: stats.find((stat) => stat.label === "Total Thanas")?.value || "—", label: "Thanas" };
      case "custody":
        return { value: stats.find((stat) => stat.label === "In Custody")?.value || "—", label: "In Custody" };
      case "firs":
        return { value: stats.find((stat) => stat.label === "Total FIRs")?.value || "—", label: "FIRs" };
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      arrested: "bg-red-100 text-red-800",
      bail: "bg-green-100 text-green-800",
      "under-trial": "bg-yellow-100 text-yellow-800",
      registered: "bg-blue-100 text-blue-800",
      investigation: "bg-purple-100 text-purple-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const fetchReportData = async (reportId, { skipReset = false } = {}) => {
    try {
      setReportLoading(true);
      if (!skipReset) {
        setSearchTerm("");
        setFilterStatus("");
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
      setSelectedReport(reportId);

      let endpoint = "";
      const query = { page: pagination.page, limit: pagination.limit };

      if (reportId === "accused") {
        endpoint = "/api/dashboard/accused";
        query.search = debouncedSearch;
        query.status = filterStatus;
      } else if (reportId === "bailers") {
        endpoint = "/api/dashboard/bailers";
        query.search = searchTerm;
      } else if (reportId === "district") {
        endpoint = "/api/dashboard/district-report";
      } else if (reportId === "thana") {
        endpoint = "/api/dashboard/thana-report";
      } else if (reportId === "repeat") {
        endpoint = "/api/dashboard/repeat-offenders";
      } else if (reportId === "custody") {
        endpoint = "/api/dashboard/custody-status";
      } else if (reportId === "daily") {
        endpoint = "/api/dashboard/daily-report";
        query.date = dailyDate;
      } else if (reportId === "monthly") {
        endpoint = "/api/dashboard/monthly-report";
          if (monthlyMonth) {
          const [year, month] = monthlyMonth.split("-");
          query.month = month;
          query.year = year;
        }
      } else if (reportId === "firs") {
        endpoint = "/api/dashboard/firs";
        query.search = debouncedSearch;
        query.status = filterStatus;
      }

      const response = await apiCall(`${endpoint}${buildQueryString(query)}`, { method: "GET" });
      if (response.success) {
        setReportData(response.data || []);
        setReportMeta(response.pagination || {});
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportData([]);
      setReportMeta({});
    } finally {
      setReportLoading(false);
    }
  };

  const renderReportContent = () => {
    if (reportLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!selectedReport) {
      return null;
    }

    const listData = Array.isArray(reportData) ? reportData : [];
    const filteredDailyData = listData.filter((item) => {
  const search = searchTerm.toLowerCase();

  return (
    item.firNumber?.toLowerCase().includes(search) ||
    item.districtId?.name?.toLowerCase().includes(search) ||
    item.thanaId?.name?.toLowerCase().includes(search) ||
    item.description?.toLowerCase().includes(search) ||
    item.status?.toLowerCase().includes(search)
  );
});

    switch (selectedReport) {
      case "accused":
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search accused by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="arrested">Arrested</option>
          <option value="bail">Bail</option>
          <option value="under-trial">Under Trial</option>
          <option value="judicial-custody">Judicial Custody</option>
          <option value="absconding">Absconding</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">S.NO.</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">NAME / FATHER</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">AGE / GENDER</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">CONTACT</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">FIR DETAILS</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">LOCATION</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">STATUS</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {listData.length > 0 ? (
              listData.map((item, index) => (
                <tr key={item._id || index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{item.name || "-"}</p>
                    <p className="text-xs text-gray-500">S/o {item.fatherName || "-"}</p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.age || "-"} / {item.gender || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.mobile || "Not available"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.firId?.firNumber || "-"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Sec: {item.sections || "-"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>{item.districtId?.name || item.firId?.districtId?.name || "-"}</p>
                    <p className="text-xs text-gray-500">
                      {item.thanaId?.name || item.firId?.thanaId?.name || "-"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                      {item.status || "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => console.log("View FIR", item.firId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-semibold"
                    >
                      View FIR
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No accused data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
      case "bailers":
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Bailers / Released on Bail
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              List of accused persons currently released on bail
            </p>
          </div>

          <span className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold">
            {listData.length} Records
          </span>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or FIR number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                S.NO.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                NAME / FATHER
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                AGE / GENDER
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                CONTACT
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                FIR DETAILS
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                BAIL DATE
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                LOCATION
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {listData.length > 0 ? (
              listData.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="border-b border-gray-200 hover:bg-green-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.name || "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      S/o {item.fatherName || "-"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.age || "-"} / {item.gender || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.mobile || "Not available"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.firId?.firNumber || "-"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.firId?.description || "-"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.bailDate
                      ? new Date(item.bailDate).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>
                      {item.districtId?.name ||
                        item.firId?.districtId?.name ||
                        "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.thanaId?.name || item.firId?.thanaId?.name || "-"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => console.log("View FIR", item.firId)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs font-semibold"
                    >
                      View FIR
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  No bail records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
      case "firs":
        return (
          <div>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, FIR number, description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {selectedReport !== "bailers" && (
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  {selectedReport === "accused" && (
                    <>
                      <option value="arrested">Arrested</option>
                      <option value="bail">Bail</option>
                      <option value="under-trial">Under Trial</option>
                    </>
                  )}
                  {selectedReport === "firs" && (
                    <>
                      <option value="registered">Registered</option>
                      <option value="investigation">Investigation</option>
                      <option value="closed">Closed</option>
                    </>
                  )}
                </select>
              )}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{selectedReport === "firs" ? "FIR Number" : "Name"}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{selectedReport === "accused" ? "Age" : selectedReport === "firs" ? "District" : "FIR Number"}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.length > 0 ? (
                    listData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{item.name || item.firNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {selectedReport === "accused"
                            ? item.age || "-"
                            : selectedReport === "firs"
                            ? item.districtId?.name || "-"
                            : item.firId?.firNumber || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                            {item.status || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {selectedReport === "firs"
                            ? item.description
                            : item.address || item.description || item.firId?.description || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "district":
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              District
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Total FIRs
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Total Accused
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Bailed
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              In Custody
            </th>
          </tr>
        </thead>

        <tbody>
          {listData.length > 0 ? (
            listData.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {item.district || "-"}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-600">
                  {item.totalFIRs || 0}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-600">
                  {item.totalAccused || 0}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-green-700">
                  {item.bailed || 0}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">
                  {item.inCustody || 0}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                No district data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
      case "thana": {
  const totalFIRs = listData.reduce((sum, item) => sum + (item.totalFIRs || 0), 0);
  const totalAccused = listData.reduce((sum, item) => sum + (item.totalAccused || 0), 0);
  const totalBailed = listData.reduce((sum, item) => sum + (item.bailed || 0), 0);
  const totalInCustody = listData.reduce((sum, item) => sum + (item.inCustody || 0), 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total FIRs</p>
          <h3 className="text-4xl font-bold text-blue-600 mt-3">{totalFIRs}</h3>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Accused</p>
          <h3 className="text-4xl font-bold text-red-600 mt-3">{totalAccused}</h3>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bailed</p>
          <h3 className="text-4xl font-bold text-green-600 mt-3">{totalBailed}</h3>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">In Custody</p>
          <h3 className="text-4xl font-bold text-purple-600 mt-3">{totalInCustody}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          FIRs by Thana/Police Station
        </h3>

        <div className="space-y-5">
          {listData.map((item, index) => {
            const maxFIR = Math.max(...listData.map((d) => d.totalFIRs || 0), 1);
            const width = ((item.totalFIRs || 0) / maxFIR) * 100;

            return (
              <div key={index} className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-4 text-sm font-medium text-gray-700 truncate">
                  {item.thana || "Unknown"}
                </div>

                <div className="col-span-7 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-bold"
                    style={{ width: `${width}%` }}
                  >
                    {item.totalFIRs || 0}
                  </div>
                </div>

                <div className="col-span-1 text-sm font-semibold text-gray-700">
                  {item.totalFIRs || 0}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            Thana Statistics
          </h3>

          <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold">
            {listData.length} THANAS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Thana/Station Name</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">FIRs</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Accused</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Bailed</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">In Custody</th>
              </tr>
            </thead>

            <tbody>
              {listData.length > 0 ? (
                listData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-5">
                      <span className="bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold">
                        #{index + 1}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-gray-700">
                      {item.thana || "Unknown"}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-sm font-bold">
                        {item.totalFIRs || 0}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center font-bold text-gray-800">
                      {item.totalAccused || 0}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-bold">
                        {item.bailed || 0}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="bg-purple-50 text-purple-700 px-5 py-2 rounded-full text-sm font-bold">
                        {item.inCustody || 0}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No thana data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
      case "repeat":
        return (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Cases</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                </tr>
              </thead>
              <tbody>
                {listData.length > 0 ? (
                  listData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item._id}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{item.count}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.age || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                          {item.status || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.address || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No repeat offenders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case "custody":
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <p className="text-sm text-gray-600">Arrested</p>
                <h3 className="text-3xl font-bold text-red-600 mt-2">{reportData.summary?.arrested || 0}</h3>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <p className="text-sm text-gray-600">On Bail</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">{reportData.summary?.bail || 0}</h3>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-600">Under Trial</p>
                <h3 className="text-3xl font-bold text-yellow-600 mt-2">{reportData.summary?.underTrial || 0}</h3>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600">Total</p>
                <h3 className="text-3xl font-bold text-blue-600 mt-2">{reportData.summary?.total || 0}</h3>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">FIR</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.length > 0 ? (
                    listData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.firId?.firNumber || "-"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                            {item.status || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.age || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.address || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "daily":
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          📋 Select Date
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Date
            </label>
            <input
              type="date"
              value={dailyDate}
              onChange={(e) => {
                setDailyDate(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => fetchReportData("daily", { skipReset: true })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ⚙️ Generate Report
          </button>

          <button
            disabled={filteredDailyData.length === 0}
            className="bg-gray-500 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {filteredDailyData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-5 py-4 rounded-lg">
          No FIRs found for the selected date
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            📋 FIRs registered on{" "}
            {dailyDate
              ? new Date(dailyDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Today"}
          </h2>

          <span className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold">
            {filteredDailyData.length} Records
          </span>
        </div>

        <input
          type="text"
          placeholder="Search by FIR number, district, thana, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">FIR Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">District</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thana</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredDailyData.length > 0 ? (
                filteredDailyData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-6 py-4 text-sm font-semibold">{item.firNumber || "-"}</td>
                    <td className="px-6 py-4 text-sm">{item.districtId?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm">{item.thanaId?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">{item.description || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                        {item.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No FIRs found for the selected date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
      case "monthly":
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          📊 Select Month
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Month
            </label>
            <input
              type="month"
              value={monthlyMonth}
              onChange={(e) => {
                setMonthlyMonth(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => fetchReportData("monthly", { skipReset: true })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ⚙️ Generate Report
          </button>

          <button
            disabled={listData.length === 0}
            className="bg-gray-500 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {listData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-5 py-4 rounded-lg">
          No report found for the selected month
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Month
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Total FIRs
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Total Accused
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Bailed
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                In Custody
              </th>
            </tr>
          </thead>

          <tbody>
            {listData.length > 0 ? (
              listData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {item.month} {item.year}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {item.totalFIRs || 0}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {item.totalAccused || 0}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-green-700">
                    {item.bailed || 0}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">
                    {item.inCustody || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No report found for selected month
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A1733]">
                Reports & Analytics
              </h1>
              <p className="text-gray-500 mt-2 md:mt-3 text-sm md:text-base lg:text-lg">
                Generate, export and analyze crime data reports
              </p>
            </div>
            <motion.button
              onClick={fetchStats}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <RefreshCw size={18} />
              Refresh Stats
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-8 border-b border-gray-300"
          >
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "analytics"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Analytics
              {activeTab === "analytics" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "reports"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Available Reports
              {activeTab === "reports" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          </motion.div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "analytics" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                  {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.5 }}
                          className={`border-l-4 ${getColorClasses(
                            stat.color
                          )} rounded-lg p-4 md:p-6 bg-white shadow-md hover:shadow-lg transition-shadow`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">{stat.value}</h3>
                              <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.subtext}</p>
                            </div>
                            <div className={`${getIconColorClasses(stat.color)} p-3 rounded-lg`}>
                              <Icon size={24} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === "reports" && !selectedReport && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#0A1733]">Available Reports</h2>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {reports.length} Reports
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {reports.map((report, index) => {
                    const Icon = report.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ y: -5 }}
                        onClick={() => fetchReportData(report.id)}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon size={28} className="text-blue-600" />
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0A1733] mb-2">{report.title}</h3>
                        {(() => {
                          const metric = getReportMetric(report.id);
                          return metric ? (
                            <div className="mb-3">
                              <p className="text-2xl font-semibold text-[#0A1733]">{metric.value}</p>
                              <p className="text-xs text-gray-500">{metric.label}</p>
                            </div>
                          ) : null;
                        })()}
                        <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                        <div className="text-blue-600 font-semibold text-sm flex items-center gap-2">View Report →</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "reports" && selectedReport && (
              <div>
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setReportData([]);
                    setReportMeta({});
                    setSearchTerm("");
                    setFilterStatus("");
                    setPagination({ page: 1, limit: 10 });
                  }}
                  className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  ← Back to Reports
                </button>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-[#0A1733] mb-6">
                    {reports.find((r) => r.id === selectedReport)?.title}
                  </h2>
                  {renderReportContent()}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
