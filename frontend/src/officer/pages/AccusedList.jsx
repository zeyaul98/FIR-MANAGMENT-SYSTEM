import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import { Search, ChevronDown } from "lucide-react";

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

  const fetchAccused = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 10);

      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const res = await apiCall(`/api/officer/accused?${params.toString()}`);

      setAccused(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1, limit: 10 });
    } catch (error) {
      console.log(error);
      alert("Accused list load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccused();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchAccused();
  };

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar />

      <main className="flex-1 p-7">
        <div className="flex justify-between items-start mb-5">
          <h1 className="text-2xl font-bold tracking-wide text-gray-800">
            Accused Records
          </h1>

          <div className="text-right">
            <h2 className="text-3xl font-bold text-blue-600">
              {pagination.total}
            </h2>
            <p className="text-sm text-gray-500">Total Accused</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-blue-500" />
            <h2 className="font-bold text-gray-800">Filters</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search name, father, mobile..."
              className="h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-500"
            />

            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Select Status...</option>
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
              placeholder="Select District..."
              className="h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={() => {
                setFilters({ search: "", status: "", district: "" });
                setPage(1);
              }}
              className="px-5 py-2 rounded-md bg-gray-200 font-semibold"
            >
              Clear
            </button>

            <button
              onClick={handleSearch}
              className="px-5 py-2 rounded-md bg-blue-700 text-white font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-4 text-gray-600">
          Page {page} of {pagination.pages}
        </div>

        {loading ? (
          <div className="bg-white p-10 text-center rounded-md">Loading...</div>
        ) : accused.length > 0 ? (
          <div className="space-y-5">
            {accused.map((item) => (
              <AccusedCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 text-center rounded-md text-gray-500">
            No accused found
          </div>
        )}

        <div className="flex justify-end items-center gap-3 mt-5">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

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

const AccusedCard = ({ item }) => {
  const fir = item.firId;

  return (
    <div className="bg-[#fffdeb] border border-yellow-400 rounded-md p-5">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <p className="text-sm text-gray-600">
            S/o: {item.fatherName || "N/A"}
          </p>
        </div>

        <span className="bg-gray-100 px-4 py-1 rounded text-sm font-bold text-gray-700">
          ⚪ {item.status || "Unknown"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-y-5 text-sm">
        <Info label="AGE & GENDER" value={`${item.age || "N/A"} years, ${item.gender || "N/A"}`} />
        <Info label="MOBILE" value={item.mobile || "N/A"} />
        <Info label="STATE" value="Bihar" />
        <Info label="DISTRICT" value={item.districtId?.name || fir?.districtId?.name || "N/A"} />

        <Info label="FULL ADDRESS" value={item.address || "N/A"} />
        <Info label="MARK OF ID" value={item.remarks || "N/A"} />
        <Info label="BUILT" value="Average" />
        <Info label="FIR NUMBER" value={fir?.firNumber || "N/A"} blue />

        <Info label="JAIL NAME" value="NA" />
        <Info label="COURT ORDERING JC" value="NA" />
        <Info label="JC SINCE" value="NA" />
        <Info label="THANA" value={item.thanaId?.name || fir?.thanaId?.name || "N/A"} />
      </div>

      <div className="border-t border-yellow-300 mt-5 pt-4 grid grid-cols-3 text-sm">
        <Info label="AADHAAR" value={item.aadhaar || "N/A"} />
        <Info label="EMAIL" value="N/A" />
        <Info label="SECTION" value={item.sections || "N/A"} />
      </div>
    </div>
  );
};

const Info = ({ label, value, blue }) => (
  <div>
    <p className="text-xs font-bold text-gray-500">{label}</p>
    <p className={`font-semibold ${blue ? "text-blue-700" : "text-gray-900"}`}>
      {value}
    </p>
  </div>
);

const Select = ({ children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className="w-full h-11 border border-gray-300 rounded-md px-4 appearance-none outline-none focus:border-blue-500"
    >
      {children}
    </select>
    <ChevronDown
      size={20}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);

export default AccusedList; 