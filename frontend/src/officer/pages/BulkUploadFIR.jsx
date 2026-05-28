import React, { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import toast from "react-hot-toast";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Handshake,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const BulkUploadFIR = () => {
  const [files, setFiles] = useState({
    fir: null,
    accused: null,
    status: null,
    bailer: null,
  });

  const [loadingType, setLoadingType] = useState("");

  const firRef = useRef(null);
  const accusedRef = useRef(null);
  const statusRef = useRef(null);
  const bailerRef = useRef(null);

  const uploadSections = [
    {
      type: "fir",
      title: "FIR Master Upload",
      icon: FileSpreadsheet,
      color: "blue",
      template: "/fir_master_template.csv",
      url: "/api/officer/fir/upload-csv",
      inputRef: firRef,
      columns:
        "fir_no, fir_date, year, state, zone, district, subdivision, thana, police_station, place_of_occurrence, sections_of_law, modus_operandi, train_number, train_name, io_name, brief_of_case, item_looted, time_of_incident, accused_type",
    },
    {
      type: "accused",
      title: "Accused Details Upload",
      icon: Users,
      color: "purple",
      template: "/accused_details_template.csv",
      url: "/api/officer/accused/upload-csv",
      inputRef: accusedRef,
      columns:
        "fir_no, accused_name, gender, age, mark_of_identification, built, father_spouse_name, accused_address, accused_ps, accused_district, accused_state, accused_mobile",
    },
    {
      type: "status",
      title: "Accused Status Upload",
      icon: ShieldCheck,
      color: "green",
      template: "/accused_status_template.csv",
      url: "/api/officer/accused-status/upload-csv",
      inputRef: statusRef,
      columns:
        "fir_no, accused_name, custody_status, jail_name, court_ordering_jc, jc_since",
    },
    {
      type: "bailer",
      title: "Bailer Details Upload",
      icon: Handshake,
      color: "orange",
      template: "/bailer_details_template.csv",
      url: "/api/officer/bailer/upload-csv",
      inputRef: bailerRef,
      columns:
        "fir_no, police_station, accused_name, bail_date, bail_court, bailer_name, bailer_age, bailer_gender, bailer_mobile, surety_amount, bailer_father_name, bailer_address, bailer_ps, bailer_district, bailer_state",
    },
  ];

  const setFile = (type, file) => {
    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const uploadFile = async (section) => {
    const file = files[section.type];

    if (!file) {
      toast.error("Please choose CSV file first");
      return;
    }

    try {
      setLoadingType(section.type);

      const formData = new FormData();
      formData.append("csv", file);

      const res = await apiCall(section.url, {
        method: "POST",
        body: formData,
      });

      toast.success(res.message || "CSV uploaded successfully");

      setFile(section.type, null);

      if (section.inputRef.current) {
        section.inputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Upload failed");
    } finally {
      setLoadingType("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white/80 backdrop-blur rounded-3xl border border-white shadow-sm p-8"
        >
          <h1 className="text-4xl font-black text-slate-900">
            Bulk Upload Data
          </h1>
          <p className="text-slate-500 mt-2">
            Upload FIR, accused, status and bailer CSV records directly into
            database.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
          {uploadSections.map((section, index) => (
            <UploadCard
              key={section.type}
              section={section}
              file={files[section.type]}
              setFile={(file) => setFile(section.type, file)}
              onUpload={() => uploadFile(section)}
              loading={loadingType === section.type}
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700",
    ring: "ring-blue-100",
    border: "border-blue-200",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    btn: "bg-purple-600 hover:bg-purple-700",
    ring: "ring-purple-100",
    border: "border-purple-200",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    btn: "bg-green-600 hover:bg-green-700",
    ring: "ring-green-100",
    border: "border-green-200",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    btn: "bg-orange-600 hover:bg-orange-700",
    ring: "ring-orange-100",
    border: "border-orange-200",
  },
};

const UploadCard = ({ section, file, setFile, onUpload, loading, index }) => {
  const Icon = section.icon;
  const colors = colorMap[section.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-3xl shadow-sm border ${colors.border} p-7 hover:shadow-xl transition-all`}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center ring-8 ${colors.ring}`}
          >
            <Icon size={28} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              {section.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              CSV file only supported
            </p>
          </div>
        </div>

        {file && (
          <span className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 size={14} />
            Ready
          </span>
        )}
      </div>

      <div
        className={`${colors.bg} border-l-4 ${colors.border} rounded-2xl p-5 mb-6`}
      >
        <p className="font-black text-slate-800 mb-2">Columns:</p>

        <pre className="bg-white border border-slate-200 rounded-xl p-4 text-xs whitespace-pre-wrap leading-6 text-slate-700 max-h-32 overflow-y-auto">
          {section.columns}
        </pre>

        <a
          href={section.template}
          download
          className={`inline-flex items-center gap-2 mt-4 ${colors.btn} text-white px-5 py-3 rounded-xl font-bold transition`}
        >
          <Download size={18} />
          Download Template
        </a>
      </div>

      <input
        ref={section.inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => section.inputRef.current.click()}
          className="border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3 rounded-xl font-bold text-slate-700"
        >
          Choose File
        </button>

        <div className="flex-1 border border-slate-200 px-4 py-3 rounded-xl bg-slate-50 text-slate-600 truncate">
          {file ? file.name : "No file chosen"}
        </div>

        <button
          type="button"
          disabled={!file || loading}
          onClick={onUpload}
          className={`${colors.btn} text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          <Upload size={18} />
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </motion.div>
  );
};

export default BulkUploadFIR;