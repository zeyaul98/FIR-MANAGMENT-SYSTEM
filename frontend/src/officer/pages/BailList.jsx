import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  FileText,
  X,
  Scale,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const BailList = () => {
  const navigate = useNavigate();

  const [bails, setBails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBail, setSelectedBail] = useState(null);

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

  const getFirId = (bail) => {
    return bail?.firId?._id || bail?.firId || "";
  };

  const fetchBails = async (pageNo = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", pageNo);
      params.append("limit", 10);

      if (filters.search.trim()) params.append("search", filters.search.trim());
      if (filters.status) params.append("status", filters.status);
      if (filters.district.trim()) {
        params.append("district", filters.district.trim());
      }

      const res = await apiCall(`/api/officer/bails?${params.toString()}`);

      setBails(res.data || []);
      setPagination(
        res.pagination || {
          total: 0,
          pages: 1,
          limit: 10,
        }
      );
    } catch (error) {
      toast.error(error.message || "Bail list load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBails(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchBails(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      district: "",
    });

    setPage(1);

    setTimeout(() => {
      fetchBails(1);
    }, 100);
  };

  const deleteBail = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this bail record?");
    if (!ok) return;

    try {
      await apiCall(`/api/officer/bails/${id}`, {
        method: "DELETE",
      });

      toast.success("Bail record deleted successfully");
      fetchBails(page);
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const viewFIR = (firId) => {
    if (!firId) {
      toast.error("FIR not found");
      return;
    }

    navigate(`/officer/firs/view/${firId}`);
  };

  const editFIR = (firId) => {
    if (!firId) {
      toast.error("FIR not found");
      return;
    }

    navigate(`/officer/firs/edit/${firId}`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-between items-start gap-4 mb-6"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-blue-700 text-white shadow">
                <Scale size={28} />
              </span>
              Bail Records
            </h1>

            <p className="text-slate-500 mt-2 font-medium">
              View, edit and manage bail records.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-3xl px-7 py-5 border shadow-sm text-right"
          >
            <h2 className="text-4xl font-black text-blue-700">
              {pagination.total || 0}
            </h2>
            <p className="text-sm text-slate-500 font-bold">Total Bails</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-3xl p-6 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <Search size={20} className="text-blue-700" />
            <h2 className="font-black text-xl">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search name, father name, mobile..."
              className="input"
            />

            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </Select>

            <input
              value={filters.district}
              onChange={(e) =>
                setFilters({ ...filters, district: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search district..."
              className="input"
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end">
            <button onClick={clearFilters} className="btn-light">
              <RotateCcw size={18} /> Clear
            </button>

            <button onClick={handleSearch} className="btn-primary">
              <Search size={18} /> Search
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-3xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <Th>Name</Th>
                  <Th>Gender</Th>
                  <Th>Age</Th>
                  <Th>Father Name</Th>
                  <Th>Mobile</Th>
                  <Th>District</Th>
                  <Th>Bail Date</Th>
                  <Th>Relation</Th>
                  <Th>Status</Th>
                  <Th>Aadhaar</Th>
                  <Th>FIR No.</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12" className="p-10 text-center font-black">
                      Loading bail records...
                    </td>
                  </tr>
                ) : bails.length > 0 ? (
                  bails.map((bail, index) => {
                    const firId = getFirId(bail);

                    return (
                      <motion.tr
                        key={bail._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-t hover:bg-blue-50/60 transition"
                      >
                        <Td bold>{bail.name}</Td>
                        <Td>{capitalize(bail.gender)}</Td>
                        <Td>{bail.age}</Td>
                        <Td>{bail.fatherName}</Td>
                        <Td>{bail.mobile}</Td>
                        <Td>{bail.districtId?.name || "N/A"}</Td>
                        <Td>{formatDate(bail.bailDate)}</Td>
                        <Td>{bail.relationWithAccused || "N/A"}</Td>
                        <Td>
                          <Status status={bail.status} />
                        </Td>
                        <Td>{bail.aadhaar || "N/A"}</Td>
                        <Td>
                          <button
                            onClick={() => viewFIR(firId)}
                            className="text-blue-700 font-black hover:underline"
                          >
                            {bail.firId?.firNumber || "N/A"}
                          </button>
                        </Td>

                        <Td>
                          <div className="flex gap-3 items-center">
                            <IconBtn
                              title="View Bailer"
                              onClick={() => setSelectedBail(bail)}
                            >
                              <Eye size={17} className="text-slate-700" />
                            </IconBtn>

                            <IconBtn
                              title="Edit FIR / Bailer"
                              onClick={() => editFIR(firId)}
                            >
                              <Pencil size={17} className="text-orange-500" />
                            </IconBtn>

                            <IconBtn
                              title="Delete Bailer"
                              onClick={() => deleteBail(bail._id)}
                            >
                              <Trash2 size={17} className="text-red-500" />
                            </IconBtn>

                            <IconBtn
                              title="View FIR"
                              onClick={() => viewFIR(firId)}
                            >
                              <FileText size={17} className="text-blue-600" />
                            </IconBtn>
                          </div>
                        </Td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="p-10 text-center text-slate-500 font-bold"
                    >
                      No bail records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <Pagination
          page={page}
          pages={pagination.pages || 1}
          setPage={setPage}
          total={pagination.total || 0}
        />

        <AnimatePresence>
          {selectedBail && (
            <BailModal
              bail={selectedBail}
              onClose={() => setSelectedBail(null)}
              viewFIR={viewFIR}
              editFIR={editFIR}
              getFirId={getFirId}
            />
          )}
        </AnimatePresence>

        <style>{`
          .input {
            width: 100%;
            height: 50px;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 16px;
            padding: 0 16px;
            outline: none;
            font-weight: 700;
          }

          .input:focus {
            border-color: #2563eb;
            background: white;
            box-shadow: 0 0 0 4px rgba(37,99,235,.10);
          }

          .btn-primary {
            padding: 12px 24px;
            border-radius: 16px;
            background: #1d4ed8;
            color: white;
            font-weight: 900;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: .2s;
          }

          .btn-primary:hover {
            background: #1e40af;
            transform: translateY(-1px);
          }

          .btn-light {
            padding: 12px 20px;
            border-radius: 16px;
            background: #f1f5f9;
            color: #334155;
            font-weight: 900;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: .2s;
          }

          .btn-light:hover {
            background: #e2e8f0;
          }
        `}</style>
      </main>
    </div>
  );
};

const BailModal = ({ bail, onClose, viewFIR, editFIR, getFirId }) => {
  const firId = getFirId(bail);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
      >
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Eye /> Bailer Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Info label="Name" value={bail.name} />
          <Info label="Status" value={capitalize(bail.status)} />
          <Info label="Gender" value={capitalize(bail.gender)} />
          <Info label="Age" value={bail.age} />
          <Info label="Father Name" value={bail.fatherName} />
          <Info label="Mobile" value={bail.mobile} />
          <Info label="Aadhaar No." value={bail.aadhaar} />
          <Info label="Bail Date" value={formatDate(bail.bailDate)} />
          <Info label="Relation With Accused" value={bail.relationWithAccused} />
          <Info label="FIR No." value={bail.firId?.firNumber} />
          <Info label="District" value={bail.districtId?.name} />
          <Info
            label="Rail Police Station"
            value={bail.railPoliceStation?.name}
          />
          <Info label="Bail Court" value={bail.bailCourt} />
          <Info label="Security Amount" value={bail.securityAmount} />
          <Info label="PIN Code" value={bail.pinCode} />
          <Info label="Address" value={bail.address} full />
        </div>

        <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="btn-light">
            Close
          </button>

          <button onClick={() => editFIR(firId)} className="btn-light">
            <Pencil size={18} /> Edit FIR / Bailer
          </button>

          <button onClick={() => viewFIR(firId)} className="btn-primary">
            <FileText size={18} /> View FIR
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Th = ({ children }) => (
  <th className="text-left px-4 py-4 font-black whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children, bold }) => (
  <td
    className={`px-4 py-4 text-slate-600 whitespace-nowrap ${
      bold ? "font-black text-slate-900" : "font-semibold"
    }`}
  >
    {children || "N/A"}
  </td>
);

const Info = ({ label, value, full }) => (
  <div
    className={`bg-slate-50 border rounded-2xl p-4 ${
      full ? "md:col-span-3" : ""
    }`}
  >
    <p className="text-xs text-slate-500 font-black uppercase">{label}</p>
    <p className="font-black text-slate-900 mt-1 break-words">
      {value || "N/A"}
    </p>
  </div>
);

const Status = ({ status }) => {
  const active = status === "active";

  return (
    <span
      className={`px-4 py-1 rounded-full text-xs font-black ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "Active" : "Expired"}
    </span>
  );
};

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

const IconBtn = ({ children, onClick, title }) => (
  <button
    title={title}
    onClick={onClick}
    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-white hover:shadow flex items-center justify-center transition"
  >
    {children}
  </button>
);

const Pagination = ({ page, pages, setPage, total }) => {
  const safePages = Math.max(1, pages);
  const start = Math.max(1, page - 4);
  const end = Math.min(safePages, start + 9);

  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <div className="bg-white rounded-3xl p-5 mt-6 border shadow-sm flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-slate-600 font-semibold">
        Total <b>{total}</b> records | Page <b>{page}</b> of{" "}
        <b>{safePages}</b>
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
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          disabled={page >= safePages}
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
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN");
};

const capitalize = (text) => {
  if (!text) return "N/A";
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
};

export default BailList;