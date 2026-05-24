import React from "react";
import { User, Mail, Shield, CalendarDays, Phone, MapPin } from "lucide-react";
import Sidebar from "./Sidebar";

const MyProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">
            View and manage your account details
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                <User size={48} />
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  {user.name || "Admin User"}
                </h2>
                <p className="text-blue-100 mt-1">
                  {user.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem
              icon={<User />}
              label="Full Name"
              value={user.name || "Admin User"}
            />

            <ProfileItem
              icon={<Mail />}
              label="Email"
              value={user.email || "admin@gmail.com"}
            />

            <ProfileItem
              icon={<Shield />}
              label="Role"
              value={user.role || "Admin"}
            />

            <ProfileItem
              icon={<Phone />}
              label="Mobile"
              value={user.mobile || "Not available"}
            />

            <ProfileItem
              icon={<MapPin />}
              label="Department"
              value="Bihar Railway FIR System"
            />

            <ProfileItem
              icon={<CalendarDays />}
              label="Account Status"
              value="Active"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-5">
      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h4 className="text-lg font-semibold text-gray-900">{value}</h4>
      </div>
    </div>
  );
};

export default MyProfile;