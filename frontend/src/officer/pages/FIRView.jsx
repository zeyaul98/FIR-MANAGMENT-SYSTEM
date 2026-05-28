import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiCall } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  MapPin,
  Train,
  UserRound,
  Scale,
  Shield,
  CalendarDays,
  Clock,
  Hash,
  Phone,
  Mail,
  BadgeInfo,
} from "lucide-react";
import { motion } from "framer-motion";

const FIRView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fir, setFir] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFIR = async () => {
    try {
      setLoading(true);
      const res = await apiCall(`/api/officer/firs/${id}`);
      setFir(res.data);
    } catch (error) {
      console.error("FIR View Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFIR();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            Loading FIR details...
          </div>
        </main>
      </div>
    );
  }

  if (!fir) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            FIR not found
          </div>
        </main>
      </div>
    );
  }

  const basicDetails = [
    ["FIR No", fir.firNumber, Hash],
    ["Accused Type", fir.accusedType, BadgeInfo],
    ["Status", fir.status, Shield],
    ["Year", fir.year, CalendarDays],
    ["Date of Incident", formatDate(fir.dateOfIncident), CalendarDays],
    ["Date of Registration", formatDate(fir.dateOfRegistration), CalendarDays],
    ["Incident Time", fir.incidentTime, Clock],
    ["Sections", fir.sections, Scale],
  ];

  const locationDetails = [
    ["State", fir.state, MapPin],
    ["Zone", fir.zone, MapPin],
    ["District", fir.districtId?.name, MapPin],
    ["Sub Division", fir.subDivision, MapPin],
    ["Circle Office", fir.circleOffice, MapPin],
    ["Thana", fir.thanaId?.name, MapPin],
    ["Thana Area", fir.thanaId?.area, MapPin],
    ["Court", fir.court, Scale],
  ];

  const trainDetails = [
    ["Train No", fir.trainNo, Train],
    ["Train Name", fir.trainName, Train],
    ["Station Code", fir.stationCode, Train],
    ["Station Name", fir.stationName, Train],
    ["Platform No", fir.platformNo, Train],
    ["Modus Operandi", fir.modusOperandi, BadgeInfo],
    ["Item Looted", fir.itemLooted, BadgeInfo],
  ];

  const ioDetails = [
    ["IO Name", fir.ioName, UserRound],
    ["Belt No", fir.beltNo, BadgeInfo],
    ["Rank", fir.rank, Shield],
    ["IO Mobile", fir.ioMobile, Phone],
  ];

  const lawyerDetails = [
    ["Lawyer Name", fir.lawyerName, Scale],
    ["Bar Council No", fir.barCouncilNo, BadgeInfo],
    ["Lawyer Mobile", fir.lawyerMobile, Phone],
    ["Lawyer Email", fir.lawyerEmail, Mail],
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6 flex items-center justify-between"
        >
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700"
            >
              <ArrowLeft size={18} /> Back
            </button>

            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <FileText className="text-blue-700" />
              FIR Details
            </h1>

            <p className="text-slate-500 mt-2">
              FIR No: <b>{fir.firNumber}</b>
            </p>
          </div>

          <span className="px-5 py-2 rounded-full bg-green-50 text-green-700 font-black capitalize">
            {fir.status || "registered"}
          </span>
        </motion.div>

        <Section title="Basic FIR Information" icon={FileText} items={basicDetails} />
        <Section title="Location & Court Details" icon={MapPin} items={locationDetails} />
        <Section title="Train / Station / Incident Details" icon={Train} items={trainDetails} />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <h2 className="text-xl font-black text-slate-900 mb-4">
            Case Description
          </h2>
          <p className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-700 leading-7">
            {fir.description || "-"}
          </p>
        </motion.div>

        <Section title="Investigating Officer Details" icon={UserRound} items={ioDetails} />
        <Section title="Lawyer Details" icon={Scale} items={lawyerDetails} />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <UserRound className="text-red-600" />
              Accused Details
            </h2>

            <span className="bg-red-50 text-red-700 px-4 py-1 rounded-full font-black text-sm">
              Total: {fir.accused?.length || 0}
            </span>
          </div>

          {fir.accused?.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {fir.accused.map((a, index) => (
                <motion.div
                  key={a._id || index}
                  whileHover={{ y: -3 }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900">
                      {a.name || "Unknown Accused"}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black capitalize">
                      {a.status || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Mini label="Gender" value={a.gender} />
                    <Mini label="Age" value={a.age} />
                    <Mini label="Aadhaar" value={a.aadhaar} />
                    <Mini label="Father/Spouse" value={a.fatherName} />
                    <Mini label="Mobile" value={a.mobile} />
                    <Mini label="Police Station" value={a.policeStation} />
                    <Mini label="State" value={a.state} />
                    <Mini label="Pin Code" value={a.pinCode} />
                    <Mini label="Built" value={a.built} />
                    <Mini label="Identification" value={a.markIdentification} />
                  </div>

                  <div className="mt-4">
                    <Mini label="Address" value={a.address} />
                  </div>

                  {a.bailer && (
                    <div className="mt-5 bg-white rounded-2xl border p-4">
                      <h4 className="font-black text-slate-900 mb-3">
                        Bailer Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Mini label="Name" value={a.bailer.name} />
                        <Mini label="Mobile" value={a.bailer.mobile} />
                        <Mini label="Court" value={a.bailer.bailCourt} />
                        <Mini label="Surety Amount" value={a.bailer.suretyAmount} />
                        <Mini label="Bail Date" value={formatDate(a.bailer.bailDate)} />
                        <Mini label="Address" value={a.bailer.address} />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 text-slate-500">
              No accused found
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const Section = ({ title, icon: Icon, items }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6"
  >
    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
      <Icon className="text-blue-700" />
      {title}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map(([label, value, IconItem], index) => (
        <Info key={index} label={label} value={value} icon={IconItem} />
      ))}
    </div>
  </motion.div>
);

const Info = ({ label, value, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white hover:shadow-md transition"
  >
    <div className="flex items-center gap-2 text-slate-500 mb-2">
      {Icon && <Icon size={16} />}
      <p className="text-xs font-black uppercase">{label}</p>
    </div>
    <p className="font-black text-slate-900 break-words">{value || "-"}</p>
  </motion.div>
);

const Mini = ({ label, value }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-3">
    <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
    <p className="font-bold text-slate-900 mt-1 break-words">{value || "-"}</p>
  </div>
);

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
};

export default FIRView;