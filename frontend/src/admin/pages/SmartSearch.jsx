import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { apiCall, getApiUrl } from "../../api";

const SmartSearch = () => {
  const [filters, setFilters] = useState({
    stationName: "",
    trainNumber: "",
    accusedName: "",
    bailerName: "",
    criminalType: "",
    modusOperandi: "",
    itemLooted: "",
    placeOfOccurrence: "",
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasFilter = Object.values(filters).some((value) => value.trim() !== "");

  const buildQueryString = (filterValues) => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value?.trim()) {
        params.append(key, value.trim());
      }
    });
    return params.toString();
  };

  const fetchSearchResults = async (filterValues = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const queryString = buildQueryString(filterValues);
      const url = `/api/search${queryString ? `?${queryString}` : ""}`;
      const data = await apiCall(url);
      if (!data.success) {
        throw new Error(data.message || "Unable to fetch search results");
      }
      setResults(data.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err.message || "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchSearchResults(filters);
  };

  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#0A1733]">Smart FIR Search</h1>
            <p className="text-gray-500 mt-2">Law Enforcement Intelligence Dashboard</p>
          </div>

          <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { name: "stationName", label: "Station Name", placeholder: "Enter Station Name..." },
              { name: "trainNumber", label: "Train Number", placeholder: "Enter Train Number..." },
              { name: "accusedName", label: "Accused Name", placeholder: "Enter Accused Name..." },
              { name: "bailerName", label: "Bailer Name", placeholder: "Enter Bailer Name..." },
              { name: "criminalType", label: "Criminal Type", placeholder: "Enter Criminal Type..." },
              { name: "modusOperandi", label: "Modus Operandi", placeholder: "Enter Modus Operandi..." },
              { name: "itemLooted", label: "Item Looted", placeholder: "Enter Item Looted..." },
              { name: "placeOfOccurrence", label: "Place of Occurrence", placeholder: "Enter Place of Occurrence..." },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0A1733]">{field.label}</label>
                <input
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0A1733] shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
          </form>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              onClick={handleSearch}
              className={`inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-white shadow-lg transition ${
                isLoading
                  ? "bg-blue-600"
                  : hasFilter
                  ? "bg-[#4F46E5] hover:bg-[#4338ca]"
                  : "bg-slate-400 hover:bg-slate-500"
              } ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
              disabled={isLoading}
            >
              <Search size={18} />
              {isLoading ? "Searching..." : "Search"}
            </button>
            <div className="text-sm text-gray-500">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? "" : "s"} found`
                : isLoading
                ? "Loading results..."
                : "No results found"}
            </div>
          </div>

          <div className="mt-10 overflow-x-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-600">
                  <tr>
                    <th className="px-4 py-3">FIR No.</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Thana</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Incident Date</th>
                    <th className="px-4 py-3">Accused</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-[#0A1733]">{row.firNumber}</td>
                      <td className="px-4 py-4">{row.district}</td>
                      <td className="px-4 py-4">{row.thana}</td>
                      <td className="px-4 py-4 capitalize">{row.status}</td>
                      <td className="px-4 py-4">{new Date(row.dateOfIncident).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        {row.accused.length > 0
                          ? row.accused.map((a) => a.name).join(", ")
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-gray-600">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
