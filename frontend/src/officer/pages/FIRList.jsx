import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import {
  FileText,
  Plus,
  Upload,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FIRList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
const [pagination, setPagination] = useState({
  total: 0,
  pages: 1,
  limit: 10,
});

  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    searchType: "",
    searchTerm: "",
    status: "",
    state: "",
    district: "",
    thana: "",
    section: "",
    fromDate: "",
    toDate: "",
  });

 const fetchFIRs = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", 10);

    if (filters.searchTerm) params.append("search", filters.searchTerm);
    if (filters.status) params.append("status", filters.status);
    if (filters.district) params.append("district", filters.district);
    if (filters.thana) params.append("thana", filters.thana);

    const res = await apiCall(`/api/officer/firs?${params.toString()}`);

    setFirs(res.data || []);
    setPagination(res.pagination || { total: 0, pages: 1, limit: 10 });
  } catch (error) {
    console.log(error);
    alert("FIR list load failed");
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  fetchFIRs();
}, [page]);

  const filteredFirs = useMemo(() => {
    return firs.filter((fir) => {
      const accusedName = fir.accused?.[0]?.name || "";
      const districtName = fir.districtId?.name || "";
      const thanaName = fir.thanaId?.name || "";
      const section = fir.sections || "";
      const status = fir.status || "";

      const search = filters.searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        fir.firNumber?.toLowerCase().includes(search) ||
        accusedName.toLowerCase().includes(search) ||
        districtName.toLowerCase().includes(search) ||
        thanaName.toLowerCase().includes(search) ||
        section.toLowerCase().includes(search);

      const matchesStatus =
        !filters.status || status === filters.status;

      const matchesDistrict =
        !filters.district ||
        districtName.toLowerCase().includes(filters.district.toLowerCase());

      const matchesThana =
        !filters.thana ||
        thanaName.toLowerCase().includes(filters.thana.toLowerCase());

      const matchesSection =
        !filters.section ||
        section.toLowerCase().includes(filters.section.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDistrict &&
        matchesThana &&
        matchesSection
      );
    });
  }, [firs, filters]);

  const clearFilters = () => {
    setFilters({
      searchType: "",
      searchTerm: "",
      status: "",
      state: "",
      district: "",
      thana: "",
      section: "",
      fromDate: "",
      toDate: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-7">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <h1 className="text-2xl font-bold text-gray-700">FIR List</h1>
          </div>

          <p className="text-sm text-gray-600">
Total: <b className="text-blue-700">{pagination.total}</b> | Showing:{" "}
<b className="text-green-600">{firs.length}</b> | Page:{" "}
<b className="text-purple-700">{page} of {pagination.pages}</b>
          </p>
        </div>

        {/* Buttons */}
        <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/officer/add-fir")}
              className="bg-[#1d2f91] text-white px-6 py-3 rounded-md font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              Add FIR
            </button>

            <a
              href="/sample_fir_template.csv"
              download
              className="bg-blue-100 text-blue-700 px-6 py-3 rounded-md font-bold flex items-center gap-2"
            >
              📋 CSV
            </a>

            <button
              onClick={() => navigate("/officer/bulk-upload")}
              className="bg-green-100 text-green-700 px-6 py-3 rounded-md font-bold flex items-center gap-2"
            >
              <Upload size={18} />
              Upload
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-md border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">
            Search & Filter
          </h2>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <Label text="Search Type" />
              <SelectBox
                value={filters.searchType}
                onChange={(e) =>
                  setFilters({ ...filters, searchType: e.target.value })
                }
              >
                <option value="">Select Search Type...</option>
                <option value="firNumber">FIR Number</option>
                <option value="accused">Accused</option>
                <option value="district">District</option>
                <option value="thana">Thana</option>
              </SelectBox>
            </div>

            <div className="col-span-6">
              <Label text="Search Term" />
              <Input
                placeholder="Enter FIR number..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
              />
            </div>

            <div className="col-span-3"></div>

            <div className="col-span-3">
              <Label text="Status" />
              <SelectBox
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">Select Status...</option>
                <option value="registered">Registered</option>
                <option value="investigation">Investigation</option>
                <option value="closed">Closed</option>
              </SelectBox>
            </div>

            <div className="col-span-3">
              <Label text="State" />
              <SelectBox
                value={filters.state}
                onChange={(e) =>
                  setFilters({ ...filters, state: e.target.value })
                }
              >
                <option value="">Select State...</option>
                <option value="Bihar">Bihar</option>
              </SelectBox>
            </div>

            <div className="col-span-3">
              <Label text="District" />
              <Input
                placeholder="Select District..."
                value={filters.district}
                onChange={(e) =>
                  setFilters({ ...filters, district: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Label text="Thana" />
              <Input
                placeholder="Select Thana..."
                value={filters.thana}
                onChange={(e) =>
                  setFilters({ ...filters, thana: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Label text="Section (IPC)" />
              <Input
                placeholder="Select Section..."
                value={filters.section}
                onChange={(e) =>
                  setFilters({ ...filters, section: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Label text="From Date" />
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <Label text="To Date" />
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
              />
            </div>

            <div className="col-span-3 flex items-end">
              <button
                onClick={clearFilters}
                className="w-full h-[43px] bg-gray-200 text-gray-700 rounded-md font-semibold"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-700">
                <Th>FIR No.</Th>
                <Th>Date</Th>
                <Th>Accused</Th>
                <Th>Thana</Th>
                <Th>District</Th>
                <Th>Section</Th>
                <Th>Status</Th>
                <Th>IO</Th>
                <Th center>Action</Th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredFirs.length > 0 ? (
                filteredFirs.map((fir) => (
                  <tr key={fir._id} className="border-b hover:bg-gray-50">
                    <Td blue>{fir.firNumber}</Td>
                    <Td>
                      {fir.dateOfRegistration
                        ? new Date(fir.dateOfRegistration).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </Td>
                    <Td>{fir.accused?.[0]?.name || "-"}</Td>
                    <Td>{fir.thanaId?.name || "-"}</Td>
                    <Td>{fir.districtId?.name || "-"}</Td>
                    <Td>{fir.sections || "-"}</Td>
                    <Td>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {fir.status || "active"}
                      </span>
                    </Td>
                    <Td>{fir.ioDetails?.ioName || "-"}</Td>
                    <Td>
                      <div className="flex justify-center gap-5">
                        <Eye size={17} className="cursor-pointer text-purple-700" />
                        <Pencil size={17} className="cursor-pointer text-orange-500" />
                        <Trash2 size={17} className="cursor-pointer text-gray-500" />
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    No FIR found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center gap-3 p-4 bg-white border-t">
  <button
    disabled={page <= 1}
    onClick={() => setPage(page - 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span className="font-semibold">
    Page {page} of {pagination.pages}
  </span>

  <button
    disabled={page >= pagination.pages}
    onClick={() => setPage(page + 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
      </main>
    </div>
  );
};

const Label = ({ text }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    {text}
  </label>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full h-[43px] border border-gray-300 rounded-md px-4 outline-none focus:border-blue-500 text-sm"
  />
);

const SelectBox = ({ children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className="w-full h-[43px] border border-gray-300 rounded-md px-4 pr-10 outline-none focus:border-blue-500 text-sm appearance-none bg-white"
    >
      {children}
    </select>
    <ChevronDown
      size={20}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);

const Th = ({ children, center }) => (
  <th className={`px-4 py-4 font-bold ${center ? "text-center" : "text-left"}`}>
    {children}
  </th>
);

const Td = ({ children, blue }) => (
  <td className={`px-4 py-4 text-gray-600 ${blue ? "text-blue-700 font-semibold" : ""}`}>
    {children}
  </td>
);

export default FIRList;