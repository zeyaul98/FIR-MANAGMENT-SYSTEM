import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goToDashboard = () => navigate("/admin");
  const goToSmartSearch = () => navigate("/admin/smart-search");
  const goToReports = () => navigate("/admin/reports");

  return (
    <div className="w-[280px] min-h-screen bg-[#030B2B] text-white flex flex-col justify-between overflow-y-auto">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Indian_Railways.svg/1200px-Indian_Railways.svg.png"
            alt="logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold">
              Bihar Railway
            </h1>
            <p className="text-sm text-gray-300">
              Fir Management System
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="mt-6 px-3">
          {/* DASHBOARD */}
          <div onClick={goToDashboard} className="bg-white text-[#233ED9] rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <LayoutDashboard size={22} />
              <span className="font-medium text-lg">
                Dashboard
              </span>
            </div>
            <ChevronRight size={20} />
          </div>

          {/* MAIN MENU */}
          <div className="mt-10">
            <p className="text-xs tracking-[3px] text-gray-400 mb-5 px-2">
              MAIN MENU
            </p>
            <div className="space-y-3">
              <div onClick={goToSmartSearch} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <Search size={22} />
                  <span className="text-lg">
                    Smart Search
                  </span>
                </div>
                <ChevronRight size={18} />
              </div>

              <div onClick={goToReports} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <FileText size={22} />
                  <span className="text-lg">
                    Reports
                  </span>
                </div>
                <ChevronRight size={18} />
              </div>
            </div>
          </div>

          {/* SYSTEM */}
          <div className="mt-12">
            <p className="text-xs tracking-[3px] text-gray-400 mb-5 px-2">
              SYSTEM CONFIGURATION
            </p>
            <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <Settings size={22} />
                <span className="text-lg">
                  Settings
                </span>
              </div>
              <ChevronRight size={18} />
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="mt-12">
            <p className="text-xs tracking-[3px] text-gray-400 mb-5 px-2">
              ACCOUNT
            </p>
            <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <User size={22} />
                <span className="text-lg">
                  My Profile
                </span>
              </div>
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="w-full border border-white/20 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition"
        >
          <LogOut size={20} />
          Logout
        </button>

        <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
          <span>
            Bihar Railway
          </span>
          <span>
            PixelFlame
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;