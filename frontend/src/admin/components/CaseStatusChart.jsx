import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function CaseStatusChart({ data, isLoading }) {
  const COLORS = {
    registered: "#3b82f6",
    investigation: "#f59e0b",
    closed: "#10b981"
  };

  const chartData = data ? [
    { name: "Registered", value: data.registered || 0 },
    { name: "Investigation", value: data.investigation || 0 },
    { name: "Closed", value: data.closed || 0 }
  ] : [];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="text-2xl">⭕</div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Case Status Distribution</h3>
          <p className="text-xs text-gray-500">Status breakdown</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase().replace(" ", "")]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4 mt-6 w-full">
            {chartData.map((item) => (
              <motion.div
                key={item.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: COLORS[item.name.toLowerCase().replace(" ", "")] }}
                />
                <p className="text-xs font-semibold text-gray-700 uppercase">{item.name}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{item.value}</p>
                {total > 0 && (
                  <p className="text-xs text-gray-500">
                    {((item.value / total) * 100).toFixed(1)}%
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
