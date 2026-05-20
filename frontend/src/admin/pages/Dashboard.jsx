import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  FileText, 
  AlertCircle, 
  RotateCcw,
  Users
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { DashboardCard } from "../components/DashboardCard";
import { MonthlyTrendChart } from "../components/MonthlyTrendChart";
import { CaseStatusChart } from "../components/CaseStatusChart";
import { useDashboard } from "../components/useDashboard";

const Dashboard = () => {
  const { stats, monthlyTrend, caseStatus, isLoading, lastUpdated, refresh } = useDashboard();

  const formatTime = (date) => {
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  const cards = [
    {
      icon: Building2,
      title: "Total Districts",
      value: stats?.totalDistricts || 0,
      color: "blue"
    },
    {
      icon: MapPin,
      title: "Total Thanas",
      value: stats?.totalThanas || 0,
      color: "purple"
    },
    {
      icon: FileText,
      title: "Total FIRs",
      value: stats?.totalFIRs || 0,
      color: "orange"
    },
    {
      icon: AlertCircle,
      title: "Total Accused",
      value: stats?.totalAccused || 0,
      color: "pink"
    },
    {
      icon: Users,
      title: "Total Bailed",
      value: stats?.totalBailed || 0,
      color: "cyan"
    },
    {
      icon: Users,
      title: "Total Bailees",
      value: stats?.totalBailees || 0,
      color: "green"
    },
    {
      icon: AlertCircle,
      title: "In Custody",
      value: stats?.totalInCustody || 0,
      color: "yellow"
    },
    {
      icon: FileText,
      title: "Registered",
      value: caseStatus?.registered || 0,
      color: "blue"
    }
  ];

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
                Dashboard
              </h1>
              <p className="text-gray-500 mt-2 md:mt-3 text-sm md:text-base lg:text-lg">
                Crime Management Analytics & Statistics
              </p>
            </div>
            <motion.div
              className="flex items-center gap-2 md:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-right text-xs md:text-sm">
                <p className="text-gray-500">LAST UPDATED</p>
                <p className="font-semibold text-gray-700">{formatTime(lastUpdated)}</p>
              </div>
              <motion.button
                onClick={refresh}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                disabled={isLoading}
              >
                <RotateCcw size={20} className="text-blue-500" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* STATS CARDS GRID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <DashboardCard
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* CHARTS GRID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {/* MONTHLY TREND - Full Width on Mobile, 2/3 on Desktop */}
            <div className="lg:col-span-2">
              <MonthlyTrendChart data={monthlyTrend} isLoading={isLoading} />
            </div>

            {/* CASE STATUS - Full Width on Mobile, 1/3 on Desktop */}
            <div className="lg:col-span-1">
              <CaseStatusChart data={caseStatus} isLoading={isLoading} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;