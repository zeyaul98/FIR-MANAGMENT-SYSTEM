import React from "react";
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
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import useReportStore from "../components/reportStore";

const Reports = () => {
  const { activeTab, setActiveTab } = useReportStore();

  const stats = [
    { icon: FileText, label: "Total FIRs", value: "100", subtext: "All registered FIRs", color: "blue" },
    { icon: Users, label: "Total Accused", value: "246", subtext: "In all FIRs", color: "red" },
    { icon: Lock, label: "Total Bailers", value: "118", subtext: "Released on bail", color: "green" },
    { icon: Calendar, label: "This Month's FIRs", value: "0", subtext: "April 2026", color: "purple" },
    { icon: Radio, label: "Repeat Offenders", value: "7", subtext: "2+ FIRs each", color: "orange" },
    { icon: Lock, label: "In Custody", value: "168", subtext: "Jail custody status", color: "red" },
    { icon: MapPin, label: "Total Districts", value: "2", subtext: "Jurisdiction area", color: "teal" },
    { icon: Zap, label: "Total Thanas", value: "2", subtext: "Police stations", color: "cyan" },
  ];

  const reports = [
    {
      icon: Users,
      title: "All Accused Database",
      description: "Complete database of all accused persons",
      type: "Database",
      link: "#",
    },
    {
      icon: Lock,
      title: "All Bailers Database",
      description: "Complete database of all bailers/sureties",
      type: "Database",
      link: "#",
    },
    {
      icon: MapPin,
      title: "District Wise Report",
      description: "Crime statistics grouped by district",
      type: "Analysis",
      link: "#",
    },
    {
      icon: Radio,
      title: "Train & Station Report",
      description: "Crime statistics by train, platform and station",
      type: "Analysis",
      link: "#",
    },
    {
      icon: AlertCircle,
      title: "Thana Wise Report",
      description: "Crime statistics grouped by police station",
      type: "Analysis",
      link: "#",
    },
    {
      icon: AlertCircle,
      title: "Repeat Offenders",
      description: "List of repeat offenders and their cases",
      type: "Alert",
      link: "#",
    },
    {
      icon: Lock,
      title: "Custody Status Report",
      description: "Current custody status of all accused",
      type: "Status",
      link: "#",
    },
    {
      icon: Calendar,
      title: "Daily FIR Report",
      description: "Generate daily FIR registration summary with all details",
      type: "Daily",
      link: "#",
    },
    {
      icon: BarChart3,
      title: "Monthly Crime Report",
      description: "Comprehensive monthly crime analysis and statistics",
      type: "Monthly",
      link: "#",
    },
    {
      icon: Zap,
      title: "Custom Report Builder",
      description: "Create custom reports with advanced filters",
      type: "Custom",
      link: "#",
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

  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 lg:p-10">
          {/* HEADER */}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <RefreshCw size={18} />
              Refresh Stats
            </motion.button>
          </motion.div>

          {/* TAB NAVIGATION */}
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

          {/* CONTENT BASED ON ACTIVE TAB */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div>
                {/* STATISTICS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                  {stats.map((stat, index) => {
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
                            <p className="text-gray-600 text-sm font-medium">
                              {stat.label}
                            </p>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                              {stat.value}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              {stat.subtext}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                            <Icon size={24} className={`text-${stat.color}-600`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AVAILABLE REPORTS TAB */}
            {activeTab === "reports" && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#0A1733]">
                    Available Reports
                  </h2>
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
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon size={28} className="text-blue-600" />
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0A1733] mb-2">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {report.description}
                        </p>
                        <motion.a
                          href={report.link}
                          whileHover={{ x: 5 }}
                          className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-2"
                        >
                          Generate Report →
                        </motion.a>
                      </motion.div>
                    );
                  })}
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
