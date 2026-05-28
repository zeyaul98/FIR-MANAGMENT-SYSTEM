import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import {
  Search,
  ChevronDown,
  UserRound,
  Phone,
  MapPin,
  FileText,
  Shield,
  RotateCcw,
  Mail,
  Fingerprint,
  Building2,
  Scale,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const AccusedList = () => {
  const [accused, setAccused] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    district: "",
  });

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 10,
  });

  const fetchAccused = async (pageNo = page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", pageNo);
      params.append("limit", 10);

      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.district) params.append("district", filters.district);

      const res = await apiCall(`/api/officer/accused?${params.toString()}`);

      setAccused(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1, limit: 10 });
    } catch (error) {
      toast.error(error.message || "Accused list load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccused(page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchAccused(1);
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "", district: "" });
    setPage(1);
    setTimeout(() => fetchAccused(1), 0);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-6"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-blue-700 text-white shadow-lg">
                <UserRound size={30} />
              </span>
              Accused Records
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              View accused details, FIR mapping and custody status.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            className="bg-white rounded-3xl px-7 py-5 border border-blue-100 shadow-md text-right"
          >
            <h2 className="text-4xl font-black text-blue-700">
              {pagination.total}
            </h2>
            <p className="text-sm text-slate-500 font-bold">Total Accused</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur border border-slate-200 rounded-3xl p-6 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <Search size={21} className="text-blue-700" />
            <h2 className="font-black text-xl text-slate-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search name, father, mobile..."
              className="input"
            />

            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="arrested">Arrested</option>
              <option value="bail">Bail</option>
              <option value="under-trial">Under Trial</option>
              <option value="judicial-custody">Judicial Custody</option>
              <option value="absconding">Absconding</option>
              <option value="other">Other</option>
            </Select>

            <input
              value={filters.district}
              onChange={(e) =>
                setFilters({ ...filters, district: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search District..."
              className="input"
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end">
            <button
              onClick={clearFilters}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center gap-2"
            >
              <RotateCcw size={18} /> Clear
            </button>

            <button
              onClick={handleSearch}
              className="px-7 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black flex items-center gap-2 shadow-md"
            >
              <Search size={18} /> Search
            </button>
          </div>
        </motion.div>

        <div className="flex justify-end mb-4 text-slate-600 font-bold">
          Page {page} of {pagination.pages}
        </div>

        {loading ? (
          <div className="bg-white p-10 text-center rounded-3xl shadow-sm font-bold">
            Loading accused records...
          </div>
        ) : accused.length > 0 ? (
          <div className="space-y-6">
            {accused.map((item, index) => (
              <AccusedCard key={item._id || index} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 text-center rounded-3xl text-slate-500 shadow-sm">
            No accused found
          </div>
        )}

        <Pagination
          page={page}
          pages={pagination.pages}
          setPage={setPage}
          total={pagination.total}
        />

        <style>{`
          .input {
            width: 100%;
            height: 50px;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 16px;
            padding: 0 16px;
            outline: none;
            font-weight: 600;
          }
          .input:focus {
            border-color: #2563eb;
            background: white;
            box-shadow: 0 0 0 4px rgba(37,99,235,.10);
          }
        `}</style>
      </main>
    </div>
  );
};

const AccusedCard = ({ item, index }) => {
  const fir = item.firId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -5, scale: 1.005 }}
      className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50 to-yellow-50 border border-yellow-300 rounded-[28px] p-7 shadow-sm hover:shadow-xl transition"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-600" />

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-wide text-slate-950 uppercase">
            {item.name || "Unknown"}
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-semibold">
            S/o: {item.fatherName || "N/A"}
          </p>
        </div>

        <StatusBadge status={item.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Info label="Age & Gender" value={`${item.age || "N/A"} years, ${item.gender || "N/A"}`} icon={UserRound} />
        <Info label="Mobile" value={item.mobile || "N/A"} icon={Phone} />
        <Info label="State" value={item.state || "N/A"} icon={MapPin} />
        <Info label="District" value={item.districtId?.name || fir?.districtId?.name || "N/A"} icon={MapPin} />

        <Info label="Full Address" value={item.address || "N/A"} icon={MapPin} />
        <Info label="Mark of ID" value={item.markIdentification || item.remarks || "N/A"} icon={Shield} />
        <Info label="Built" value={item.built || "N/A"} icon={UserRound} />
        <Info label="FIR Number" value={fir?.firNumber || "N/A"} icon={FileText} blue />

        <Info label="Jail Name" value={item.jailName || "NA"} icon={Building2} />
        <Info label="Court Ordering JC" value={item.courtOrderingJC || "NA"} icon={Scale} />
        <Info label="JC Since" value={formatDate(item.jcSince)} icon={Shield} />
        <Info label="Thana" value={item.thanaId?.name || fir?.thanaId?.name || "N/A"} icon={Building2} />
      </div>

      <div className="border-t border-yellow-300 mt-6 pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Info label="Aadhaar" value={item.aadhaar || "N/A"} icon={Fingerprint} />
        <Info label="Email" value={item.email || "N/A"} icon={Mail} />
        <Info label="Section" value={item.sections || fir?.sections || "N/A"} icon={Scale} />
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const s = status || "Unknown";

  const colors = {
    arrested: "bg-red-50 text-red-700 border-red-200",
    bail: "bg-green-50 text-green-700 border-green-200",
    "under-trial": "bg-orange-50 text-orange-700 border-orange-200",
    "judicial-custody": "bg-purple-50 text-purple-700 border-purple-200",
    absconding: "bg-slate-900 text-white border-slate-900",
    other: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`px-5 py-2 rounded-full text-sm font-black capitalize border shadow-sm ${
        colors[s] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      <Shield size={14} className="inline mr-1" />
      {s}
    </span>
  );
};

const Info = ({ label, value, blue, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.025 }}
    className="bg-white/80 rounded-2xl p-4 border border-yellow-100 shadow-sm"
  >
    <p className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
      {Icon && <Icon size={14} className="text-blue-600" />}
      {label}
    </p>
    <p
      className={`font-black mt-2 break-words ${
        blue ? "text-blue-700" : "text-slate-950"
      }`}
    >
      {value || "N/A"}
    </p>
  </motion.div>
);

const Select = ({ children, ...props }) => (
  <div className="relative">
    <select {...props} className="input appearance-none">
      {children}
    </select>
    <ChevronDown
      size={21}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
  </div>
);

const Pagination = ({ page, pages, setPage, total }) => {
  const start = Math.max(1, page - 4);
  const end = Math.min(pages, start + 9);
  const nums = [];

  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <div className="bg-white rounded-3xl p-5 mt-6 border shadow-sm flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-slate-600 font-semibold">
        Total <b>{total}</b> records | Page <b>{page}</b> of <b>{pages}</b>
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-slate-100 rounded-xl disabled:opacity-50 font-bold"
        >
          Prev
        </button>

        {nums.map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`w-10 h-10 rounded-xl font-black ${
              page === n
                ? "bg-blue-700 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-slate-100 rounded-xl disabled:opacity-50 font-bold"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "NA";
  return new Date(date).toLocaleDateString("en-IN");
};

export default AccusedList;