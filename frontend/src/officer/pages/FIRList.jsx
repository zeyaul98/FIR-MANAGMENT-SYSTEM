import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import toast from "react-hot-toast";
import {
  Plus,
  Upload,
  FileDown,
  Eye,
  Pencil,
  Trash2,
  Search,
  RotateCcw,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FIRList = () => {
  const navigate = useNavigate();

  const [firs, setFirs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  const [filters, setFilters] = useState({
    searchType: "firNumber",
    search: "",
    status: "",
    state: "",
    district: "",
    thana: "",
    section: "",
    fromDate: "",
    toDate: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchFIRs = async (page = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await apiCall(`/api/officer/firs?${params.toString()}`);

      setFirs(res.data || []);
      setPagination(res.pagination || pagination);
    } catch (error) {
      toast.error(error.message || "FIR list load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFIRs(1);
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFilter = () => {
    fetchFIRs(1);
  };

  const clearFilter = () => {
    const empty = {
      searchType: "firNumber",
      search: "",
      status: "",
      state: "",
      district: "",
      thana: "",
      section: "",
      fromDate: "",
      toDate: "",
    };

    setFilters(empty);
    setTimeout(() => fetchFIRs(1), 0);
  };

  const deleteFIR = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FIR?")) return;

    try {
      await apiCall(`/api/officer/firs/${id}`, {
        method: "DELETE",
      });

      toast.success("FIR deleted successfully");
      fetchFIRs(pagination.page);
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              📋 FIR List
            </h1>
            <p className="text-slate-500 mt-1">
              Manage FIR records with filters, view, edit and delete actions.
            </p>
          </div>

          <div className="text-right text-sm text-slate-600">
            Total:{" "}
            <span className="font-black text-blue-700">
              {pagination.total}
            </span>{" "}
            | Page:{" "}
            <span className="font-black text-purple-700">
              {pagination.page} of {pagination.pages}
            </span>
          </div>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/officer/add-fir")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Add FIR
          </button>

          <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2">
            <FileDown size={18} /> CSV
          </button>

          <button
          onClick={() => navigate("/officer/bulk-upload-fir")}
          className="bg-green-50 hover:bg-green-100 text-green-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Upload size={18} /> Upload
        </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-6"
        >
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
            <Filter size={20} /> Search & Filter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="Search Type">
              <select name="searchType" value={filters.searchType} onChange={handleChange} className="input">
                <option value="firNumber">FIR Number</option>
                <option value="description">Description</option>
                <option value="ioName">IO Name</option>
              </select>
            </Field>

            <Field label="Search Term" className="md:col-span-2">
              <input
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Enter FIR number..."
                className="input"
              />
            </Field>

            <Field label="Status">
              <select name="status" value={filters.status} onChange={handleChange} className="input">
                <option value="">All Status</option>
                <option value="registered">Registered</option>
                <option value="investigation">Investigation</option>
                <option value="closed">Closed</option>
              </select>
            </Field>

            <Field label="State">
              <select name="state" value={filters.state} onChange={handleChange} className="input">
                <option value="">All State</option>
                <option value="Bihar">Bihar</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="UP">UP</option>
              </select>
            </Field>

            <Field label="District">
              <input name="district" value={filters.district} onChange={handleChange} placeholder="District..." className="input" />
            </Field>

            <Field label="Thana">
              <input name="thana" value={filters.thana} onChange={handleChange} placeholder="Thana..." className="input" />
            </Field>

            <Field label="Section IPC">
              <input name="section" value={filters.section} onChange={handleChange} placeholder="Section..." className="input" />
            </Field>

            <Field label="From Date">
              <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} className="input" />
            </Field>

            <Field label="To Date">
              <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} className="input" />
            </Field>

            <div className="flex gap-3 items-end md:col-span-2">
              <button onClick={applyFilter} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2">
                <Search size={18} /> Search
              </button>

              <button onClick={clearFilter} className="bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2">
                <RotateCcw size={18} /> Clear
              </button>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <Th>FIR No.</Th>
                  <Th>Date</Th>
                  <Th>Accused</Th>
                  <Th>Thana</Th>
                  <Th>District</Th>
                  <Th>Section</Th>
                  <Th>Status</Th>
                  <Th>IO</Th>
                  <Th>Action</Th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-500">
                      Loading FIR records...
                    </td>
                  </tr>
                ) : firs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-500">
                      No FIR found
                    </td>
                  </tr>
                ) : (
                  firs.map((fir) => (
                    <tr key={fir._id} className="border-t hover:bg-blue-50/40 transition">
                      <Td>
                        <span className="font-bold text-blue-700">
                          {fir.firNumber}
                        </span>
                      </Td>
                      <Td>
                        {fir.dateOfRegistration
                          ? new Date(fir.dateOfRegistration).toLocaleDateString("en-IN")
                          : "-"}
                      </Td>
                      <Td>{fir.accused?.[0]?.name || "-"}</Td>
                      <Td>{fir.thanaId?.name || "-"}</Td>
                      <Td>{fir.districtId?.name || "-"}</Td>
                      <Td>{fir.sections || "-"}</Td>
                      <Td>
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-black capitalize">
                          {fir.status || "registered"}
                        </span>
                      </Td>
                      <Td>{fir.ioName || "-"}</Td>
                      <Td>
                        <div className="flex gap-2">
                          <IconBtn title="View" onClick={() => navigate(`/officer/firs/${fir._id}`)} icon={<Eye size={16} />} />
                          <IconBtn title="Edit" onClick={() => navigate(`/officer/firs/edit/${fir._id}`)} icon={<Pencil size={16} />} />
                          <IconBtn title="Delete" onClick={() => deleteFIR(fir._id)} danger icon={<Trash2 size={16} />} />
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-5 border-t bg-slate-50">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchFIRs(pagination.page - 1)}
              className="px-4 py-2 rounded-xl bg-white border disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-sm text-slate-600">
              Page <b>{pagination.page}</b> of <b>{pagination.pages}</b>
            </p>

            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchFIRs(pagination.page + 1)}
              className="px-4 py-2 rounded-xl bg-white border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          border-radius: 14px;
          padding: 12px 14px;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 4px rgba(37,99,235,.08);
        }
      `}</style>
    </div>
  );
};

const Field = ({ label, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-bold text-slate-600 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const Th = ({ children }) => (
  <th className="text-left px-5 py-4 font-black whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-5 py-4 text-slate-700 whitespace-nowrap">{children}</td>
);

const IconBtn = ({ icon, onClick, danger, title }) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
      danger
        ? "bg-red-50 text-red-600 hover:bg-red-100"
        : "bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700"
    }`}
  >
    {icon}
  </button>
);

export default FIRList;