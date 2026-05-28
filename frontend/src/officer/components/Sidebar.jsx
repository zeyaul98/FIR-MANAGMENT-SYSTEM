  import React from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import {
    LayoutDashboard,
    FileText,
    Upload,
    List,
    Users,
    Scale,
    BarChart3,
    LogOut,
    ChevronRight,
    User,
  } from "lucide-react";

  const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    };

    const menuItems = [
      {
        label: "Dashboard",
        icon: <LayoutDashboard size={22} />,
        path: "/officer",
      },
      {
        label: "Add FIR",
        icon: <FileText size={22} />,
        path: "/officer/add-fir",
      },
      {
        label: "Bulk Upload FIR",
        icon: <Upload size={22} />,
        path: "/officer/bulk-upload-fir",
      },
      {
        label: "FIRs List",
        icon: <List size={22} />,
        path: "/officer/firs",
      },
      {
        label: "Accused List",
        icon: <Users size={22} />,
      path: "/officer/accused",
      },
      {
        label: "Bail List",
        icon: <Scale size={22} />,
        path: "/officer/bails",

      },
      {
        label: "Reports",
        icon: <BarChart3 size={22} />,
        path: "/officer/reports",
      },
      {
    label: "My Profile",
    icon: <User size={22} />,
    path: "/officer/profile",
  },
    ];

    const isActive = (path) => location.pathname === path;

    return (
      <aside className="w-[285px] min-h-screen bg-[#060B22] text-white flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 bg-white">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Indian_Railways.svg/1200px-Indian_Railways.svg.png"
              alt="Bihar Railway"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bihar Railway
              </h1>
              <p className="text-xs font-semibold text-gray-600">
                Fir Management System
              </p>
            </div>
          </div>

          <div className="px-3 mt-7">
            {menuItems.slice(0, 1).map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition ${
                  isActive(item.path)
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="font-semibold text-lg">{item.label}</span>
                </div>
                <ChevronRight size={18} />
              </div>
            ))}

            <div className="mt-10">
              <p className="text-xs tracking-[3px] text-gray-500 mb-4 px-2">
                OPERATIONS
              </p>

              <div className="space-y-2">
                {menuItems.slice(1, 4).map((item) => (
                  <MenuItem
                    key={item.path}
                    item={item}
                    active={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xs tracking-[3px] text-gray-500 mb-4 px-2">
                MANAGEMENT
              </p>

              <div className="space-y-2">
                {menuItems.slice(4).map((item) => (
                  <MenuItem
                    key={item.path}
                    item={item}
                    active={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full border border-white/20 py-4 rounded-xl flex items-center justify-center gap-3 text-gray-300 hover:bg-white/5 hover:text-white transition"
          >
            <LogOut size={20} />
            Logout
          </button>

          <div className="mt-4 bg-white rounded-lg p-2 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900">
              Bihar Railway
            </span>
            <span className="text-xs font-bold text-orange-500">
              PixelFlame
            </span>
          </div>
        </div>
      </aside>
    );
  };

  const MenuItem = ({ item, active, onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer transition ${
          active
            ? "bg-white text-blue-700 shadow-md"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-4">
          {item.icon}
          <span className="font-semibold">{item.label}</span>
        </div>
        <ChevronRight size={18} />
      </div>
    );
  };

  export default Sidebar;