import React, { useState,useRef } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import api from "../../api";
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

const AddFIR = () => {
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const csvInputRef = useRef(null);

  const [form, setForm] = useState({
    accusedType: "",
    state: "",
    zone: "",
    districtId: "",
    subDivision: "",
    circleOffice: "",
    thanaId: "",
    court: "",
    sections: "",
    firNumber: "",
    year: "",
    dateOfRegistration: "",
    incidentTime: "",
    modusOperandi: "",
    itemLooted: "",
    description: "",

    trainNo: "",
    trainName: "",
    stationCode: "",
    stationName: "",
    platformNo: "",

    ioName: "",
    beltNo: "",
    rank: "",
    ioMobile: "",

    lawyerName: "",
    barCouncilNo: "",
    lawyerMobile: "",
    lawyerEmail: "",
  });

  const [accusedList, setAccusedList] = useState([
    {
      name: "",
      aadhaar: "",
      gender: "male",
      dob: "",
      age: "",
      fatherName: "",
      markIdentification: "",
      built: "",
      relationWithBailer: "",
      policeStation: "",
      state: "",
      districtId: "",
      address: "",
      pinCode: "",
      mobile: "",
      status: "arrested",
      isJailCustody: false,
    },
  ]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleCSVUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setLoading(true);

    const data = new FormData();
    data.append("csv", file);

    const res = await api.post("/officer/fir/upload-csv", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(res.data?.message || "FIR added successfully");
    e.target.value = "";
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "CSV upload failed");
  } finally {
    setLoading(false);
  }
};

  const handleAccusedChange = (index, e) => {
    const updated = [...accusedList];
    const { name, value, type, checked } = e.target;

    updated[index][name] = type === "checkbox" ? checked : value;
    setAccusedList(updated);
  };

  const addAccused = () => {
    setAccusedList([
      ...accusedList,
      {
        name: "",
        aadhaar: "",
        gender: "male",
        dob: "",
        age: "",
        fatherName: "",
        markIdentification: "",
        built: "",
        relationWithBailer: "",
        policeStation: "",
        state: "",
        districtId: "",
        address: "",
        pinCode: "",
        mobile: "",
        status: "arrested",
        isJailCustody: false,
      },
    ]);
  };

  const removeAccused = (index) => {
    setAccusedList(accusedList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      data.append("accusedList", JSON.stringify(accusedList));

      if (attachment) {
        data.append("attachment", attachment);
      }

      await api.post("/officer/fir", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("FIR submitted successfully");

      setForm({
        accusedType: "",
        state: "",
        zone: "",
        districtId: "",
        subDivision: "",
        circleOffice: "",
        thanaId: "",
        court: "",
        sections: "",
        firNumber: "",
        year: "",
        dateOfRegistration: "",
        incidentTime: "",
        modusOperandi: "",
        itemLooted: "",
        description: "",

        trainNo: "",
        trainName: "",
        stationCode: "",
        stationName: "",
        platformNo: "",

        ioName: "",
        beltNo: "",
        rank: "",
        ioMobile: "",

        lawyerName: "",
        barCouncilNo: "",
        lawyerMobile: "",
        lawyerEmail: "",
      });

      setAccusedList([
        {
          name: "",
          aadhaar: "",
          gender: "male",
          dob: "",
          age: "",
          fatherName: "",
          markIdentification: "",
          built: "",
          relationWithBailer: "",
          policeStation: "",
          state: "",
          districtId: "",
          address: "",
          pinCode: "",
          mobile: "",
          status: "arrested",
          isJailCustody: false,
        },
      ]);

      setAttachment(null);
    } catch (error) {
      console.error("FIR submit error:", error);
      alert(error.response?.data?.message || "FIR submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText size={30} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                FIR Entry Form
              </h1>
              <p className="text-gray-500 mt-1">
                Register new FIR with accused, IO and lawyer details
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <a
            href="/sample_fir_template.csv"
            download="sample_fir_template.csv"
            className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-semibold"
            >
            Sample CSV
            </a>

            <input
                type="file"
                accept=".csv"
                ref={csvInputRef}
                onChange={handleCSVUpload}
                className="hidden"
                />

                <button
                type="button"
                disabled={loading}
                onClick={() => csvInputRef.current.click()}
                className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                <Upload size={18} />
                {loading ? "Uploading..." : "Upload CSV"}
                </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10"
        >
          <Section title="Case Details" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Accused Type *" name="accusedType" value={form.accusedType} onChange={handleChange} />
            <Input label="State *" name="state" value={form.state} onChange={handleChange} />
            <Input label="Zone" name="zone" value={form.zone} onChange={handleChange} />
            <Input label="District ID *" name="districtId" value={form.districtId} onChange={handleChange} />
            <Input label="Sub Division *" name="subDivision" value={form.subDivision} onChange={handleChange} />
            <Input label="Circle Office *" name="circleOffice" value={form.circleOffice} onChange={handleChange} />
            <Input label="Thana ID *" name="thanaId" value={form.thanaId} onChange={handleChange} />
            <Input label="Court" name="court" value={form.court} onChange={handleChange} />
            <Input label="Section *" name="sections" value={form.sections} onChange={handleChange} />
            <Input label="FIR No. *" name="firNumber" value={form.firNumber} onChange={handleChange} />
            <Input label="Year *" type="number" name="year" value={form.year} onChange={handleChange} />
            <Input label="Date of FIR *" type="date" name="dateOfRegistration" value={form.dateOfRegistration} onChange={handleChange} />
            <Input label="Timing of Incident *" type="time" name="incidentTime" value={form.incidentTime} onChange={handleChange} />
            <Input label="Modus Operandi *" name="modusOperandi" value={form.modusOperandi} onChange={handleChange} />
            <Input label="Item Looted *" name="itemLooted" value={form.itemLooted} onChange={handleChange} />
          </div>

          <Section title="Which Train Incident Happened" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Train No. *" name="trainNo" value={form.trainNo} onChange={handleChange} />
            <Input label="Train Name *" name="trainName" value={form.trainName} onChange={handleChange} />
          </div>

          <Section title="Which Station Incident Happened" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Station Code *" name="stationCode" value={form.stationCode} onChange={handleChange} />
            <Input label="Station Name *" name="stationName" value={form.stationName} onChange={handleChange} />
            <Input label="Platform No. *" name="platformNo" value={form.platformNo} onChange={handleChange} />
          </div>

          <Section title="Accused Detail" />

          {accusedList.map((accused, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-6 bg-gray-50 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Accused #{index + 1}
                </h3>

                {accusedList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAccused(index)}
                    className="text-red-600 font-semibold flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Name *" name="name" value={accused.name} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Aadhaar No." name="aadhaar" value={accused.aadhaar} onChange={(e) => handleAccusedChange(index, e)} />
                <Select label="Gender *" name="gender" value={accused.gender} onChange={(e) => handleAccusedChange(index, e)} options={["male", "female", "other"]} />
                <Input label="DOB" type="date" name="dob" value={accused.dob} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Age *" type="number" name="age" value={accused.age} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Father's Name" name="fatherName" value={accused.fatherName} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Mark of Identification" name="markIdentification" value={accused.markIdentification} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Built" name="built" value={accused.built} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Relationship with Bailer" name="relationWithBailer" value={accused.relationWithBailer} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Police Station" name="policeStation" value={accused.policeStation} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="State" name="state" value={accused.state} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="District ID" name="districtId" value={accused.districtId} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Full Address *" name="address" value={accused.address} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="PIN Code" name="pinCode" value={accused.pinCode} onChange={(e) => handleAccusedChange(index, e)} />
                <Input label="Mobile" name="mobile" value={accused.mobile} onChange={(e) => handleAccusedChange(index, e)} />
                <Select label="Status of Accused" name="status" value={accused.status} onChange={(e) => handleAccusedChange(index, e)} options={["arrested", "bail", "under-trial", "judicial-custody", "absconding", "other"]} />
              </div>

              <label className="flex items-center gap-3 font-semibold text-gray-700">
                <input
                  type="checkbox"
                  name="isJailCustody"
                  checked={accused.isJailCustody}
                  onChange={(e) => handleAccusedChange(index, e)}
                  className="w-4 h-4"
                />
                Whether of Jail / Custody
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={addAccused}
            className="border border-gray-300 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-gray-50"
          >
            <Plus size={18} />
            Add More Accused ({accusedList.length})
          </button>

          <Section title="Investigating Officer (IO) Details" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Input label="IO Name" name="ioName" value={form.ioName} onChange={handleChange} />
            <Input label="Belt No." name="beltNo" value={form.beltNo} onChange={handleChange} />
            <Input label="Rank" name="rank" value={form.rank} onChange={handleChange} />
            <Input label="IO Mobile" name="ioMobile" value={form.ioMobile} onChange={handleChange} />
          </div>

          <Section title="Lawyer Details" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Input label="Lawyer Name" name="lawyerName" value={form.lawyerName} onChange={handleChange} />
            <Input label="Bar Council No." name="barCouncilNo" value={form.barCouncilNo} onChange={handleChange} />
            <Input label="Lawyer Mobile" name="lawyerMobile" value={form.lawyerMobile} onChange={handleChange} />
            <Input label="Lawyer Email" name="lawyerEmail" value={form.lawyerEmail} onChange={handleChange} />
          </div>

          <Section title="Description & Attachment" />

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">
              Brief Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Description"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">
              Attachment FIR Copy
            </label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="w-full border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50"
            />
          </div>

          <div className="flex justify-end">
            <button
              disabled={loading}
              type="submit"
              className="bg-[#060B22] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Submitting..." : "Submit FIR"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const Section = ({ title }) => {
  return (
    <div className="bg-gray-100 rounded-xl px-5 py-4">
      <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );
};

const Input = ({ label, type = "text", name, value, onChange }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label.replace("*", "")}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
      />
    </div>
  );
};

const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-700 uppercase">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddFIR;