import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  ShieldCheck,
  Phone,
  MapPin,
  CalendarDays,
  BadgeCheck,
  FileText,
  Clock,
  Activity,
  Edit3,
  Lock,
  Save,
  X,
} from "lucide-react";

const OfficerProfile = () => {
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [user, setUser] = useState(savedUser);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: savedUser.name || "",
    email: savedUser.email || "",
    mobile: savedUser.mobile || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await apiCall("/api/officer/profile", {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });

      const updatedUser = res.data || profileForm;

      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
      setUser({ ...user, ...updatedUser });

      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password aur confirm password match nahi hai");
      return;
    }

    try {
      await apiCall("/api/officer/change-password", {
        method: "PUT",
        body: JSON.stringify(passwordForm),
      });

      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordOpen(false);
    } catch (error) {
      toast.error(error.message || "Password change failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#EEF3FA]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#06133D] via-[#1238A8] to-[#2F7DFF] p-8 text-white shadow-xl">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10"></div>
          <div className="absolute right-20 bottom-[-60px] w-44 h-44 rounded-full bg-white/10"></div>

          <div className="relative flex items-center justify-between gap-5">
            <div>
              <p className="text-blue-100 font-medium">Officer Account</p>
              <h1 className="text-4xl font-bold mt-2">
                {user.name || "Officer User"}
              </h1>
              <p className="text-blue-100 mt-2 capitalize">
                {user.role || "Officer"} • Bihar Railway FIR System
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditOpen(true)}
                className="bg-white/20 hover:bg-white/30 px-5 py-3 rounded-2xl font-bold flex items-center gap-2"
              >
                <Edit3 size={18} />
                Edit
              </button>

              <button
                onClick={() => setPasswordOpen(true)}
                className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-2xl font-bold flex items-center gap-2"
              >
                <Lock size={18} />
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7 mt-8">
          <div className="xl:col-span-1 bg-white rounded-[26px] shadow-sm border border-gray-100 p-7">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg">
                <User size={54} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-5">
                {user.name || "Officer User"}
              </h2>

              <span className="mt-3 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-bold flex items-center gap-2">
                <BadgeCheck size={16} />
                Active Officer
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <MiniItem icon={<Mail />} text={user.email || "officer@gmail.com"} />
              <MiniItem icon={<Phone />} text={user.mobile || "Not available"} />
              <MiniItem icon={<MapPin />} text="Bihar Railway Department" />
            </div>
          </div>

          <div className="xl:col-span-2 space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatCard icon={<FileText />} title="Assigned FIRs" value="24" />
              <StatCard icon={<Activity />} title="Active Cases" value="12" />
              <StatCard icon={<Clock />} title="Pending Work" value="05" />
            </div>

            <div className="bg-white rounded-[26px] shadow-sm border border-gray-100 p-7">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ProfileItem icon={<User />} label="Full Name" value={user.name || "Officer User"} />
                <ProfileItem icon={<Mail />} label="Email Address" value={user.email || "officer@gmail.com"} />
                <ProfileItem icon={<ShieldCheck />} label="Role" value={user.role || "Officer"} />
                <ProfileItem icon={<Phone />} label="Mobile Number" value={user.mobile || "Not available"} />
                <ProfileItem icon={<CalendarDays />} label="Last Login" value={new Date().toLocaleDateString("en-IN")} />
                <ProfileItem icon={<BadgeCheck />} label="Status" value="Active" />
              </div>
            </div>
          </div>
        </div>

        {editOpen && (
          <Modal title="Edit Profile" onClose={() => setEditOpen(false)}>
            <form onSubmit={updateProfile} className="space-y-4">
              <Input label="Full Name" name="name" value={profileForm.name} onChange={handleProfileChange} />
              <Input label="Email" name="email" value={profileForm.email} onChange={handleProfileChange} />
              <Input label="Mobile" name="mobile" value={profileForm.mobile} onChange={handleProfileChange} />

              <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <Save size={18} />
                Save Profile
              </button>
            </form>
          </Modal>
        )}

        {passwordOpen && (
          <Modal title="Change Password" onClose={() => setPasswordOpen(false)}>
            <form onSubmit={changePassword} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />

              <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <Lock size={18} />
                Update Password
              </button>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-black text-gray-900">{title}</h2>
        <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl">
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="font-bold text-gray-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-2 border bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:bg-white"
    />
  </div>
);

const MiniItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 text-gray-700">
    <div className="text-blue-700">{icon}</div>
    <span className="font-medium">{text}</span>
  </div>
);

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-gray-500 font-medium">{title}</p>
    <h2 className="text-3xl font-bold text-gray-900 mt-1">{value}</h2>
  </div>
);

const ProfileItem = ({ icon, label, value }) => (
  <div className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:bg-blue-50 hover:border-blue-100 transition">
    <div className="w-12 h-12 rounded-2xl bg-white text-blue-700 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h4 className="text-lg font-bold text-gray-900 capitalize">{value}</h4>
    </div>
  </div>
);

export default OfficerProfile;