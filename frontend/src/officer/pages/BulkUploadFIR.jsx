import React, { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../../api";
import toast from "react-hot-toast";
import { Upload, Download } from "lucide-react";

const BulkUploadFIR = () => {
  const [firFile, setFirFile] = useState(null);
  const [accusedFile, setAccusedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const firInputRef = useRef(null);
  const accusedInputRef = useRef(null);

  const uploadFile = async (type) => {
    const file = type === "fir" ? firFile : accusedFile;

    if (!file) {
      toast.error("Please choose CSV file first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("csv", file);

      const url =
        type === "fir"
          ? "/officer/fir/upload-csv"
          : "/officer/accused/upload-csv";

      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data?.message || "CSV uploaded successfully");

      if (type === "fir") setFirFile(null);
      else setAccusedFile(null);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-xl font-semibold mb-6">Bulk Upload Data</h1>

        <UploadCard
          title="FIR Master Upload"
          columns="fir_no, fir_date, year, state, zone, district, subdivision, thana, police_station, place_of_occurrence, sections_of_law, modus_operandi, train_number, train_name, io_name, brief_of_case, item_looted, time_of_incident, accused_type"
          template="/sample_fir_template.csv"
          file={firFile}
          setFile={setFirFile}
          inputRef={firInputRef}
          onUpload={() => uploadFile("fir")}
          loading={loading}
        />

        <UploadCard
          title="Accused Details Upload"
          columns="fir_no, accused_name, gender, age, mark_of_identification, built, father_spouse_name, accused_address, accused_ps, accused_district, accused_state, accused_mobile"
          template="/sample_accused_template.csv"
          file={accusedFile}
          setFile={setAccusedFile}
          inputRef={accusedInputRef}
          onUpload={() => uploadFile("accused")}
          loading={loading}
        />
      </main>
    </div>
  );
};

const UploadCard = ({
  title,
  columns,
  template,
  file,
  setFile,
  inputRef,
  onUpload,
  loading,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-6 max-w-5xl">
      <h2 className="text-lg font-medium mb-2">{title}</h2>

      <div className="bg-blue-50 border-l-4 border-green-600 rounded p-5 mb-8">
        <p className="font-bold mb-2">Columns:</p>

        <pre className="bg-white border rounded p-3 text-sm whitespace-pre-wrap">
          {columns}
        </pre>

        <a
          href={template}
          download
          className="inline-flex items-center gap-2 mt-4 bg-cyan-600 text-white px-5 py-3 rounded font-semibold hover:bg-cyan-700"
        >
          <Download size={18} />
          Download Template
        </a>
      </div>

      <div className="flex items-center">
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="border px-6 py-3 rounded-l bg-white hover:bg-gray-50"
        >
          Choose File
        </button>

        <div className="border-y px-4 py-3 min-w-[220px] text-gray-600 bg-gray-50">
          {file ? file.name : "No file chosen"}
        </div>

        <button
          type="button"
          disabled={!file || loading}
          onClick={onUpload}
          className="bg-gray-400 text-white px-6 py-3 rounded-r font-semibold disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default BulkUploadFIR;