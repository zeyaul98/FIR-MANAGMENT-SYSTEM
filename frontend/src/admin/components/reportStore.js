import { create } from 'zustand';

const useReportStore = create((set) => ({
  activeTab: 'analytics', // 'analytics' or 'reports'
  setActiveTab: (tab) => set({ activeTab: tab }),
  resetTab: () => set({ activeTab: 'analytics' }),
}));

export default useReportStore;
