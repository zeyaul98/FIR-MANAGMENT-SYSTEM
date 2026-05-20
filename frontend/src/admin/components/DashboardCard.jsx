import { motion } from "framer-motion";

export function DashboardCard({ icon: Icon, title, value, trend, color }) {
  const bgColorMap = {
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
    pink: "bg-pink-50 border-pink-200",
    cyan: "bg-cyan-50 border-cyan-200",
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };

  const iconColorMap = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    pink: "text-pink-500",
    cyan: "text-cyan-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${bgColorMap[color]} border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mt-2"
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </motion.h3>
          {trend && (
            <p className="text-green-600 text-xs font-semibold mt-2 flex items-center gap-1">
              <span>↑</span> {trend}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`${iconColorMap[color]} p-3 bg-white rounded-lg`}
        >
          <Icon size={24} />
        </motion.div>
      </div>
    </motion.div>
  );
}
