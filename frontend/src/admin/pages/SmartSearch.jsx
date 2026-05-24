import React, { useState, useEffect } from "react";
import { Search, Download, FileText } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Mock data for demonstration
  const mockResults = [
    {
      id: "1",
      firNumber: "160/2025-PAT",
      district: "Patna",
      thana: "Rail Police Station 1, Patna",
      description: "Theft: Boarded illegally. Looted Mobile Phone at In Train",
      status: "active",
      dateOfIncident: new Date("2025-01-15"),
      totalAccused: 4,
      bailed: 4,
      inCustody: 0,
      accused: [{ name: "Rajesh Kumar", status: "bail" }],
    },
    {
      id: "2",
      firNumber: "011/2025-BSH",
      district: "Bihar Sharif",
      thana: "Rail Police Station 2, Bihar Sharif",
      description: "Robbery: Chain snatching. Looted Jewelry at Platform",
      status: "active",
      dateOfIncident: new Date("2025-01-14"),
      totalAccused: 1,
      bailed: 1,
      inCustody: 0,
      accused: [{ name: "Vikram Singh", status: "bail" }],
    },
    {
      id: "3",
      firNumber: "202/2025-DAR",
      district: "Darbhanga",
      thana: "Rail Police Station 1, Darbhanga",
      description: "Assault: Threatened staff. Looted Cash at Waiting Room",
      status: "active",
      dateOfIncident: new Date("2025-01-13"),
      totalAccused: 1,
      bailed: 0,
      inCustody: 1,
      accused: [{ name: "Arun Verma", status: "arrested" }],
    },
    {
      id: "4",
      firNumber: "045/2025-MAD",
      district: "Madhubani",
      thana: "Rail Police Station 3, Madhubani",
      description: "Fraud: Counterfeited currency. Looted Documents at Platform",
      status: "active",
      dateOfIncident: new Date("2025-01-12"),
      totalAccused: 2,
      bailed: 1,
      inCustody: 1,
      accused: [{ name: "Deepak Sharma", status: "bail" }],
    },
    {
      id: "5",
      firNumber: "089/2025-BEG",
      district: "Begusarai",
      thana: "Rail Police Station 2, Begusarai",
      description: "Theft: Hacked luggage. Looted Bag at In Train",
      status: "active",
      dateOfIncident: new Date("2025-01-11"),
      totalAccused: 3,
      bailed: 2,
      inCustody: 1,
      accused: [{ name: "Sanjay Patel", status: "bail" }],
    },
    {
      id: "6",
      firNumber: "156/2025-PAT",
      district: "Patna",
      thana: "Rail Police Station 4, Patna",
      description: "Robbery: Threatened with weapon. Looted Cash at Waiting Room",
      status: "active",
      dateOfIncident: new Date("2025-01-10"),
      totalAccused: 2,
      bailed: 1,
      inCustody: 1,
      accused: [{ name: "Rahul Gupta", status: "bail" }],
    },
    {
      id: "7",
      firNumber: "123/2025-BSH",
      district: "Bihar Sharif",
      thana: "Rail Police Station 1, Bihar Sharif",
      description: "Theft: Chain snatching. Looted Jewelry at Platform",
      status: "active",
      dateOfIncident: new Date("2025-01-09"),
      totalAccused: 1,
      bailed: 1,
      inCustody: 0,
      accused: [{ name: "Ajay Mishra", status: "bail" }],
    },
    {
      id: "8",
      firNumber: "234/2025-DAR",
      district: "Darbhanga",
      thana: "Rail Police Station 3, Darbhanga",
      description: "Assault: Harassed passengers. Looted Mobile Phone at In Train",
      status: "active",
      dateOfIncident: new Date("2025-01-08"),
      totalAccused: 1,
      bailed: 0,
      inCustody: 1,
      accused: [{ name: "Kiran Kumar", status: "under-trial" }],
    },
    {
      id: "9",
      firNumber: "067/2025-MAD",
      district: "Madhubani",
      thana: "Rail Police Station 2, Madhubani",
      description: "Fraud: Document forgery. Looted Passport at Platform",
      status: "active",
      dateOfIncident: new Date("2025-01-07"),
      totalAccused: 2,
      bailed: 0,
      inCustody: 2,
      accused: [{ name: "Nikhil Rao", status: "arrested" }],
    },
    {
      id: "10",
      firNumber: "178/2025-BEG",
      district: "Begusarai",
      thana: "Rail Police Station 5, Begusarai",
      description: "Robbery: Broke into compartment. Looted Cash at In Train",
      status: "active",
      dateOfIncident: new Date("2025-01-06"),
      totalAccused: 3,
      bailed: 2,
      inCustody: 1,
      accused: [{ name: "Rohan Singh", status: "bail" }],
    },
  ];

  const totalPages = Math.ceil(totalCount / itemsPerPage);
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

  const fetchSearchResults = async (filterValues = {}, page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If no filters, use mock data
      if (!Object.values(filterValues).some(v => v.trim())) {
        setTotalCount(mockResults.length);
        setResults(mockResults);
        setCurrentPage(page);
        setIsLoading(false);
        return;
      }

      // Try to fetch from API
      const queryString = buildQueryString(filterValues);
      const url = `/api/search${queryString ? `?${queryString}` : ""}`;
      const data = await apiCall(url);
      if (!data.success) {
        throw new Error(data.message || "Unable to fetch search results");
      }
      setTotalCount(data.count || 0);
      setResults(data.data || []);
      setCurrentPage(page);
    } catch (err) {
      console.error("Search failed:", err);
      // Use mock data on error if no filters applied
      if (!Object.values(filterValues).some(v => v.trim())) {
        setTotalCount(mockResults.length);
        setResults(mockResults);
      } else {
        setError(err.message || "Search failed");
        setResults([]);
        setTotalCount(0);
      }
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
    setIsLoading(true);
    
    try {
      // Filter mock results based on input
      let filtered = mockResults;

      if (filters.stationName) {
        filtered = filtered.filter(r => r.thana.toLowerCase().includes(filters.stationName.toLowerCase()));
      }
      if (filters.trainNumber) {
        filtered = filtered.filter(r => r.firNumber.toLowerCase().includes(filters.trainNumber.toLowerCase()));
      }
      if (filters.accusedName) {
        filtered = filtered.filter(r => 
          r.accused.some(a => a.name.toLowerCase().includes(filters.accusedName.toLowerCase()))
        );
      }
      if (filters.criminalType) {
        filtered = filtered.filter(r => r.description.toLowerCase().includes(filters.criminalType.toLowerCase()));
      }
      if (filters.modusOperandi) {
        filtered = filtered.filter(r => r.description.toLowerCase().includes(filters.modusOperandi.toLowerCase()));
      }
      if (filters.itemLooted) {
        filtered = filtered.filter(r => r.description.toLowerCase().includes(filters.itemLooted.toLowerCase()));
      }
      if (filters.placeOfOccurrence) {
        filtered = filtered.filter(r => r.description.toLowerCase().includes(filters.placeOfOccurrence.toLowerCase()));
      }

      setTotalCount(filtered.length);
      setResults(filtered);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      setError("Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const exportToExcel = () => {
    if (results.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "SL",
      "FIR NUMBER",
      "LOCATION",
      "TRAIN",
      "DATE/TIME",
      "MODUS OPERANDI",
      "ACCUSED",
      "BAILER",
      "STATUS",
    ];

    const rows = results.map((row, index) => [
      index + 1,
      row.firNumber,
      `${row.thana}, ${row.district}`,
      row.firNumber,
      new Date(row.dateOfIncident).toLocaleDateString("en-IN"),
      row.description.substring(0, 50),
      row.totalAccused || 0,
      row.bailed || 0,
      row.status.toUpperCase(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "fir_search_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (results.length === 0) {
      alert("No data to export");
      return;
    }

    const printWindow = window.open("", "", "height=600,width=800");
    let htmlContent = `
      <html>
        <head>
          <title>FIR Search Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { text-align: center; color: #0A1733; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; color: #0A1733; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>FIR Search Results</h2>
          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>FIR NUMBER</th>
                <th>LOCATION</th>
                <th>DATE/TIME</th>
                <th>ACCUSED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
    `;

    results.forEach((row, index) => {
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${row.firNumber}</td>
          <td>${row.thana}, ${row.district}</td>
          <td>${new Date(row.dateOfIncident).toLocaleDateString("en-IN")}</td>
          <td>${row.totalAccused || 0}</td>
          <td>${row.status.toUpperCase()}</td>
        </tr>
      `;
    });

    htmlContent += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalCount);
  const displayedResults = results.slice(0, itemsPerPage);

  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Header with Export Buttons */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-[#0A1733]">Smart FIR Search</h1>
                <p className="text-gray-500 mt-2">Law Enforcement Intelligence Dashboard</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToExcel}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-medium transition"
                >
                  <Download size={18} />
                  Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium transition"
                >
                  <FileText size={18} />
                  PDF
                </button>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
              {[
                { name: "stationName", label: "STATION NAME", placeholder: "Enter Station Name..." },
                { name: "trainNumber", label: "TRAIN NUMBER", placeholder: "Enter Train Number..." },
                { name: "accusedName", label: "ACCUSED NAME", placeholder: "Enter Accused Name..." },
                { name: "bailerName", label: "BAILER NAME", placeholder: "Enter Bailer Name..." },
                { name: "criminalType", label: "CRIMINAL TYPE", placeholder: "Enter Criminal Type..." },
                { name: "modusOperandi", label: "MODUS OPERANDI", placeholder: "Enter Modus Operandi..." },
                { name: "itemLooted", label: "ITEM LOOTED", placeholder: "Enter Item Looted..." },
                { name: "placeOfOccurrence", label: "PLACE OF OCCURRENCE", placeholder: "Enter Place of Occurrence..." },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase">{field.label}</label>
                  <input
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0A1733] shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              ))}
            </form>

            {/* Search Button and Results Count */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <button
                type="submit"
                onClick={handleSearch}
                className={`inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-white shadow-lg transition font-medium ${
                  isLoading
                    ? "bg-blue-600 cursor-wait"
                    : hasFilter
                    ? "bg-[#4F46E5] hover:bg-[#4338ca] cursor-pointer"
                    : "bg-slate-400 hover:bg-slate-500 cursor-pointer"
                }`}
                disabled={isLoading}
              >
                <Search size={18} />
                {isLoading ? "Searching..." : "Search"}
              </button>
              <div className="text-sm text-gray-600 font-medium">
                Showing {startIndex} to {endIndex} of {totalCount} FIRs
              </div>
            </div>

            {/* Results Table */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : displayedResults.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 font-medium">
                    {totalCount === 0 ? "No results found" : "Loading results..."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">SL</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">FIR Number</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Train</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date/Time</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Modus Operandi</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Accused</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Bailer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedResults.map((row, index) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-semibold text-[#0A1733]">
                            {startIndex + index}
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#0A1733]">{row.firNumber}</td>
                          <td className="px-6 py-4 text-gray-700">
                            {row.thana}
                            <br />
                            <span className="text-xs text-gray-500">{row.district}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{row.firNumber}</td>
                          <td className="px-6 py-4 text-gray-700">
                            {new Date(row.dateOfIncident).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                            <br />
                            <span className="text-xs text-gray-500">
                              {new Date(row.dateOfIncident).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-medium">
                              {row.description.substring(0, 40)}...
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold text-sm">
                              {row.totalAccused || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold text-sm">
                              {row.bailed || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded font-semibold text-xs uppercase ${
                                row.status === "closed"
                                  ? "bg-gray-200 text-gray-700"
                                  : row.status === "investigation"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-blue-600 font-medium cursor-pointer hover:underline">
                            View Details
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber =
                      totalPages <= 5
                        ? i + 1
                        : currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 rounded ${
                          pageNumber === currentPage
                            ? "bg-[#4F46E5] text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
