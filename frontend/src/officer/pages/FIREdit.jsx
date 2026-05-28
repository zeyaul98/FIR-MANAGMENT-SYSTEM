import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  FileText,
  MapPin,
  Train,
  UserRound,
  Scale,
  Plus,
  Trash2,
  Users,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const FIREdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firNumber: "",
    accusedType: "",
    status: "registered",
    state: "",
    zone: "",
    districtId: "",
    subDivision: "",
    circleOffice: "",
    thanaId: "",
    court: "",
    sections: "",
    year: "",
    dateOfIncident: "",
    dateOfRegistration: "",
    incidentTime: "",
    modusOperandi: "",
    itemLooted: "",
    trainNo: "",
    trainName: "",
    stationCode: "",
    stationName: "",
    platformNo: "",
    description: "",
    ioName: "",
    beltNo: "",
    rank: "",
    ioMobile: "",
    lawyerName: "",
    barCouncilNo: "",
    lawyerMobile: "",
    lawyerEmail: "",
  });

  const [accusedList, setAccusedList] = useState([]);
  const [bailerList, setBailerList] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDistricts = async () => {
    const res = await apiCall("/api/officer/districts");
    setDistricts(res.data || []);
  };

  const fetchThanas = async (districtId) => {
    if (!districtId) {
      setThanas([]);
      return;
    }

    const res = await apiCall(`/api/officer/thanas/${districtId}`);
    setThanas(res.data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await fetchDistricts();

        const res = await apiCall(`/api/officer/firs/${id}`);
        const f = res.data;

        const selectedDistrictId = f.districtId?._id || f.districtId || "";
        const selectedThanaId = f.thanaId?._id || f.thanaId || "";

        if (selectedDistrictId) {
          await fetchThanas(selectedDistrictId);
        }

        setForm({
          firNumber: f.firNumber || "",
          accusedType: f.accusedType || "",
          status: f.status || "registered",
          state: f.state || "",
          zone: f.zone || "",
          districtId: selectedDistrictId,
          subDivision: f.subDivision || "",
          circleOffice: f.circleOffice || "",
          thanaId: selectedThanaId,
          court: f.court || "",
          sections: f.sections || "",
          year: f.year ? String(f.year) : "",
          dateOfIncident: toInputDate(f.dateOfIncident),
          dateOfRegistration: toInputDate(f.dateOfRegistration),
          incidentTime: f.incidentTime || "",
          modusOperandi: f.modusOperandi || "",
          itemLooted: f.itemLooted || "",
          trainNo: f.trainNo || "",
          trainName: f.trainName || "",
          stationCode: f.stationCode || "",
          stationName: f.stationName || "",
          platformNo: f.platformNo || "",
          description: f.description || "",
          ioName: f.ioName || "",
          beltNo: f.beltNo || "",
          rank: f.rank || "",
          ioMobile: f.ioMobile || "",
          lawyerName: f.lawyerName || "",
          barCouncilNo: f.barCouncilNo || "",
          lawyerMobile: f.lawyerMobile || "",
          lawyerEmail: f.lawyerEmail || "",
        });

        setAccusedList(
          (f.accused || []).map((a) => ({
            name: a.name || "",
            aadhaar: a.aadhaar || "",
            gender: a.gender || "male",
            dob: toInputDate(a.dob),
            age: a.age ? String(a.age) : "",
            fatherName: a.fatherName || "",
            markIdentification: a.markIdentification || "",
            built: a.built || "",
            relationWithBailer: a.relationWithBailer || "",
            policeStation: a.policeStation || "",
            state: a.state || "",
            address: a.address || "",
            pinCode: a.pinCode || "",
            mobile: a.mobile || "",
            status: a.status || "other",
            remarks: a.remarks || "",
          }))
        );

        setBailerList(
          (f.bailers || []).map((b) => ({
            bailDate: toInputDate(b.bailDate),
            name: b.name || "",
            aadhaar: b.aadhaar || "",
            gender: b.gender || "male",
            dob: toInputDate(b.dob),
            age: b.age ? String(b.age) : "",
            fatherName: b.fatherName || "",
            relationWithAccused: b.relationWithAccused || "",
            railPoliceStation:
              b.railPoliceStation?._id || b.railPoliceStation || "",
            bailCourt: b.bailCourt || "",
            state: b.state || "",
            districtId: b.districtId?._id || b.districtId || "",
            address: b.address || "",
            pinCode: b.pinCode || "",
            mobile: b.mobile || "",
            securityAmount: b.securityAmount ? String(b.securityAmount) : "",
            status: b.status || "active",
          }))
        );
      } catch (error) {
        toast.error(error.message || "FIR load failed");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "districtId" ? { thanaId: "" } : {}),
    }));

    if (name === "districtId") {
      await fetchThanas(value);
    }
  };

  const addAccused = () => {
    setAccusedList((prev) => [
      ...prev,
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
        address: "",
        pinCode: "",
        mobile: "",
        status: "other",
        remarks: "",
      },
    ]);
  };

  const updateAccused = (index, name, value) => {
    setAccusedList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const removeAccused = (index) => {
    setAccusedList((prev) => prev.filter((_, i) => i !== index));
  };

  const addBailer = () => {
    setBailerList((prev) => [
      ...prev,
      {
        bailDate: "",
        name: "",
        aadhaar: "",
        gender: "male",
        dob: "",
        age: "",
        fatherName: "",
        relationWithAccused: "",
        railPoliceStation: "",
        bailCourt: "",
        state: "",
        districtId: "",
        address: "",
        pinCode: "",
        mobile: "",
        securityAmount: "",
        status: "active",
      },
    ]);
  };

  const updateBailer = (index, name, value) => {
    setBailerList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const removeBailer = (index) => {
    setBailerList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFIR = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "year") {
          formData.append(
            "year",
            value && String(value).trim() !== "" ? String(value).trim() : ""
          );
        } else {
          formData.append(key, value ?? "");
        }
      });

      const cleanAccusedList = accusedList.map((a) => ({
        ...a,
        age:
          a.age && String(a.age).trim() !== ""
            ? Number(a.age)
            : "",
      }));

      const cleanBailerList = bailerList.map((b) => ({
        ...b,
        age:
          b.age && String(b.age).trim() !== ""
            ? Number(b.age)
            : "",
        securityAmount:
          b.securityAmount && String(b.securityAmount).trim() !== ""
            ? Number(b.securityAmount)
            : 0,
      }));

      formData.append("accusedList", JSON.stringify(cleanAccusedList));
      formData.append("bailerList", JSON.stringify(cleanBailerList));

      await apiCall(`/api/officer/firs/${id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("FIR, Accused aur Bailer updated successfully");
      navigate("/officer/firs");
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-8 font-black">Loading FIR edit form...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border shadow-sm p-6 mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-4xl font-black text-slate-900">Edit FIR</h1>
          <p className="text-slate-500 mt-1">
            FIR, accused aur bailer details update karo
          </p>
        </motion.div>

        <form onSubmit={updateFIR}>
          <EditSection title="Basic FIR Information" icon={FileText}>
            <Input label="FIR No" name="firNumber" value={form.firNumber} onChange={handleChange} />
            <Select label="Accused Type" name="accusedType" value={form.accusedType} onChange={handleChange} options={["Known", "Unknown"]} />
            <Select label="Status" name="status" value={form.status} onChange={handleChange} options={["registered", "investigation", "closed"]} />
            <Input label="Year" name="year" type="number" value={form.year} onChange={handleChange} />
            <Input label="Date of Incident" name="dateOfIncident" type="date" value={form.dateOfIncident} onChange={handleChange} />
            <Input label="Date of Registration" name="dateOfRegistration" type="date" value={form.dateOfRegistration} onChange={handleChange} />
            <Input label="Incident Time" name="incidentTime" type="time" value={form.incidentTime} onChange={handleChange} />
            <Input label="Sections" name="sections" value={form.sections} onChange={handleChange} />
          </EditSection>

          <EditSection title="Location & Court Details" icon={MapPin}>
            <Input label="State" name="state" value={form.state} onChange={handleChange} />
            <Input label="Zone" name="zone" value={form.zone} onChange={handleChange} />
            <SelectObj label="District" name="districtId" value={form.districtId} onChange={handleChange} options={districts} />
            <Input label="Sub Division" name="subDivision" value={form.subDivision} onChange={handleChange} />
            <Input label="Circle Office" name="circleOffice" value={form.circleOffice} onChange={handleChange} />
            <SelectObj label="Thana" name="thanaId" value={form.thanaId} onChange={handleChange} options={thanas} />
            <Input label="Court" name="court" value={form.court} onChange={handleChange} />
          </EditSection>

          <EditSection title="Train / Station / Incident Details" icon={Train}>
            <Input label="Train No" name="trainNo" value={form.trainNo} onChange={handleChange} />
            <Input label="Train Name" name="trainName" value={form.trainName} onChange={handleChange} />
            <Input label="Station Code" name="stationCode" value={form.stationCode} onChange={handleChange} />
            <Input label="Station Name" name="stationName" value={form.stationName} onChange={handleChange} />
            <Input label="Platform No" name="platformNo" value={form.platformNo} onChange={handleChange} />
            <Input label="Modus Operandi" name="modusOperandi" value={form.modusOperandi} onChange={handleChange} />
            <Input label="Item Looted" name="itemLooted" value={form.itemLooted} onChange={handleChange} />
          </EditSection>

          <EditSection title="Case Description" icon={FileText}>
            <div className="md:col-span-2 xl:col-span-4">
              <label className="font-bold text-slate-600">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="input mt-2"
              />
            </div>
          </EditSection>

          <EditSection title="Investigating Officer Details" icon={UserRound}>
            <Input label="IO Name" name="ioName" value={form.ioName} onChange={handleChange} />
            <Input label="Belt No" name="beltNo" value={form.beltNo} onChange={handleChange} />
            <Input label="Rank" name="rank" value={form.rank} onChange={handleChange} />
            <Input label="IO Mobile" name="ioMobile" value={form.ioMobile} onChange={handleChange} />
          </EditSection>

          <EditSection title="Lawyer Details" icon={Scale}>
            <Input label="Lawyer Name" name="lawyerName" value={form.lawyerName} onChange={handleChange} />
            <Input label="Bar Council No" name="barCouncilNo" value={form.barCouncilNo} onChange={handleChange} />
            <Input label="Lawyer Mobile" name="lawyerMobile" value={form.lawyerMobile} onChange={handleChange} />
            <Input label="Lawyer Email" name="lawyerEmail" value={form.lawyerEmail} onChange={handleChange} />
          </EditSection>

          <DynamicSection title="Accused Details" icon={Users} onAdd={addAccused} addText="Add Accused">
            {accusedList.length === 0 && <Empty text="No accused added" />}

            {accusedList.map((a, index) => (
              <PersonBox key={index} title={`Accused #${index + 1}`} onRemove={() => removeAccused(index)}>
                <Input label="Name" value={a.name} onChange={(e) => updateAccused(index, "name", e.target.value)} />
                <Input label="Aadhaar" value={a.aadhaar} onChange={(e) => updateAccused(index, "aadhaar", e.target.value)} />
                <Select label="Gender" value={a.gender} onChange={(e) => updateAccused(index, "gender", e.target.value)} options={["male", "female", "other"]} />
                <Input label="DOB" type="date" value={a.dob} onChange={(e) => updateAccused(index, "dob", e.target.value)} />
                <Input label="Age" type="number" value={a.age} onChange={(e) => updateAccused(index, "age", e.target.value)} />
                <Input label="Father Name" value={a.fatherName} onChange={(e) => updateAccused(index, "fatherName", e.target.value)} />
                <Input label="Mobile" value={a.mobile} onChange={(e) => updateAccused(index, "mobile", e.target.value)} />
                <Select label="Status" value={a.status} onChange={(e) => updateAccused(index, "status", e.target.value)} options={["arrested", "bail", "under-trial", "judicial-custody", "absconding", "other"]} />
                <Input label="Built" value={a.built} onChange={(e) => updateAccused(index, "built", e.target.value)} />
                <Input label="Identification Mark" value={a.markIdentification} onChange={(e) => updateAccused(index, "markIdentification", e.target.value)} />
                <Input label="Relation With Bailer" value={a.relationWithBailer} onChange={(e) => updateAccused(index, "relationWithBailer", e.target.value)} />
                <Input label="Police Station" value={a.policeStation} onChange={(e) => updateAccused(index, "policeStation", e.target.value)} />
                <Input label="State" value={a.state} onChange={(e) => updateAccused(index, "state", e.target.value)} />
                <Input label="PIN Code" value={a.pinCode} onChange={(e) => updateAccused(index, "pinCode", e.target.value)} />
                <Input label="Address" value={a.address} onChange={(e) => updateAccused(index, "address", e.target.value)} />
                <Input label="Remarks" value={a.remarks} onChange={(e) => updateAccused(index, "remarks", e.target.value)} />
              </PersonBox>
            ))}
          </DynamicSection>

          <DynamicSection title="Bailer Details" icon={ShieldCheck} onAdd={addBailer} addText="Add Bailer">
            {bailerList.length === 0 && <Empty text="No bailer added" />}

            {bailerList.map((b, index) => (
              <PersonBox key={index} title={`Bailer #${index + 1}`} onRemove={() => removeBailer(index)}>
                <Input label="Bail Date" type="date" value={b.bailDate} onChange={(e) => updateBailer(index, "bailDate", e.target.value)} />
                <Input label="Name" value={b.name} onChange={(e) => updateBailer(index, "name", e.target.value)} />
                <Input label="Aadhaar" value={b.aadhaar} onChange={(e) => updateBailer(index, "aadhaar", e.target.value)} />
                <Select label="Gender" value={b.gender} onChange={(e) => updateBailer(index, "gender", e.target.value)} options={["male", "female", "other"]} />
                <Input label="DOB" type="date" value={b.dob} onChange={(e) => updateBailer(index, "dob", e.target.value)} />
                <Input label="Age" type="number" value={b.age} onChange={(e) => updateBailer(index, "age", e.target.value)} />
                <Input label="Father Name" value={b.fatherName} onChange={(e) => updateBailer(index, "fatherName", e.target.value)} />
                <Input label="Relation With Accused" value={b.relationWithAccused} onChange={(e) => updateBailer(index, "relationWithAccused", e.target.value)} />
                <SelectObj label="Rail Police Station" value={b.railPoliceStation} onChange={(e) => updateBailer(index, "railPoliceStation", e.target.value)} options={thanas} />
                <Input label="Bail Court" value={b.bailCourt} onChange={(e) => updateBailer(index, "bailCourt", e.target.value)} />
                <Input label="State" value={b.state} onChange={(e) => updateBailer(index, "state", e.target.value)} />
                <SelectObj label="District" value={b.districtId} onChange={(e) => updateBailer(index, "districtId", e.target.value)} options={districts} />
                <Input label="Address" value={b.address} onChange={(e) => updateBailer(index, "address", e.target.value)} />
                <Input label="PIN Code" value={b.pinCode} onChange={(e) => updateBailer(index, "pinCode", e.target.value)} />
                <Input label="Mobile" value={b.mobile} onChange={(e) => updateBailer(index, "mobile", e.target.value)} />
                <Input label="Security Amount" type="number" value={b.securityAmount} onChange={(e) => updateBailer(index, "securityAmount", e.target.value)} />
                <Select label="Status" value={b.status} onChange={(e) => updateBailer(index, "status", e.target.value)} options={["active", "expired"]} />
              </PersonBox>
            ))}
          </DynamicSection>

          <div className="sticky bottom-4 bg-white/90 backdrop-blur border rounded-3xl p-4 shadow-lg flex justify-end">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2"
            >
              <Save size={20} /> Save All Changes
            </button>
          </div>
        </form>

        <style>{`
          .input {
            width: 100%;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 14px;
            padding: 12px 14px;
            outline: none;
            font-weight: 600;
          }
          .input:focus {
            border-color: #2563eb;
            background: white;
            box-shadow: 0 0 0 4px rgba(37,99,235,.08);
          }
        `}</style>
      </main>
    </div>
  );
};

const EditSection = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl border shadow-sm p-6 mb-6"
  >
    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
      <Icon className="text-blue-700" />
      {title}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {children}
    </div>
  </motion.div>
);

const DynamicSection = ({ title, icon: Icon, onAdd, addText, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl border shadow-sm p-6 mb-6"
  >
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
        <Icon className="text-blue-700" />
        {title}
      </h2>

      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-black flex items-center gap-2"
      >
        <Plus size={18} /> {addText}
      </button>
    </div>

    <div className="space-y-5">{children}</div>
  </motion.div>
);

const PersonBox = ({ title, onRemove, children }) => (
  <div className="bg-slate-50 border rounded-3xl p-5">
    <div className="flex justify-between items-center mb-5">
      <h3 className="font-black text-blue-700 text-lg">{title}</h3>

      <button
        type="button"
        onClick={onRemove}
        className="bg-red-100 text-red-700 px-3 py-2 rounded-xl font-black flex items-center gap-2"
      >
        <Trash2 size={16} /> Remove
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {children}
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="font-bold text-slate-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="input mt-2"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="font-bold text-slate-600">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="input mt-2"
    >
      <option value="">Select</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  </div>
);

const SelectObj = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="font-bold text-slate-600">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="input mt-2"
    >
      <option value="">Select {label}</option>
      {options.map((op) => (
        <option key={op._id} value={op._id}>
          {op.name}
        </option>
      ))}
    </select>
  </div>
);

const Empty = ({ text }) => (
  <div className="bg-slate-50 border border-dashed rounded-2xl p-6 text-center font-bold text-slate-500">
    {text}
  </div>
);

const toInputDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default FIREdit;