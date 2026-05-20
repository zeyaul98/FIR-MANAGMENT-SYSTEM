import { useState, useEffect } from "react";
import { apiCall } from "../../api";

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState(null);
  const [caseStatus, setCaseStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [statsRes, trendRes, statusRes] = await Promise.all([
        apiCall("/api/dashboard/stats"),
        apiCall("/api/dashboard/monthly-trend"),
        apiCall("/api/dashboard/case-status")
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (trendRes.success) setMonthlyTrend(trendRes.data);
      if (statusRes.success) setCaseStatus(statusRes.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refresh = () => {
    fetchDashboardData();
  };

  return {
    stats,
    monthlyTrend,
    caseStatus,
    isLoading,
    lastUpdated,
    refresh
  };
}
