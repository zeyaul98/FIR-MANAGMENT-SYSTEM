const FIR = require("../models/FIR");
const Accused = require("../models/Accused");
const District = require("../models/District");
const Thana = require("../models/Thana");

const buildSearchQuery = async (query) => {
  const {
    stationName,
    trainNumber,
    accusedName,
    bailerName,
    criminalType,
    modusOperandi,
    itemLooted,
    placeOfOccurrence,
  } = query;

  const filters = {};
  const andClauses = [];

  if (trainNumber) {
    andClauses.push({ firNumber: { $regex: trainNumber, $options: "i" } });
  }

  if (stationName || placeOfOccurrence) {
    const stationSearch = stationName || placeOfOccurrence;
    andClauses.push({
      $or: [
        { description: { $regex: stationSearch, $options: "i" } },
      ],
    });
  }

  if (criminalType || modusOperandi || itemLooted) {
    const textSearch = [criminalType, modusOperandi, itemLooted].filter(Boolean).join(" ");
    andClauses.push({
      $or: [
        { description: { $regex: textSearch, $options: "i" } },
      ],
    });
  }

  if (accusedName || bailerName) {
    const accusedSearch = accusedName || bailerName;
    const accusedIds = await Accused.find({
      name: { $regex: accusedSearch, $options: "i" },
    }).select("firId");
    const firIds = accusedIds.map((item) => item.firId).filter(Boolean);
    if (firIds.length > 0) {
      andClauses.push({ _id: { $in: firIds } });
    } else {
      andClauses.push({ _id: { $exists: false } });
    }
  }

  if (andClauses.length > 0) {
    filters.$and = andClauses;
  }

  return filters;
};

const searchFIRs = async (req, res) => {
  try {
    const filters = await buildSearchQuery(req.query);
    const query = FIR.find(filters)
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .populate("accused", "name status")
      .sort({ dateOfRegistration: -1 })
      .limit(20);

    const results = await query;

    res.status(200).json({
      success: true,
      count: results.length,
      data: results.map((fir) => ({
        id: fir._id,
        firNumber: fir.firNumber,
        district: fir.districtId?.name || "",
        thana: fir.thanaId?.name || "",
        description: fir.description,
        status: fir.status,
        dateOfIncident: fir.dateOfIncident,
        dateOfRegistration: fir.dateOfRegistration,
        totalAccused: fir.totalAccused,
        bailed: fir.bailed,
        inCustody: fir.inCustody,
        accused: fir.accused?.map((a) => ({ name: a.name, status: a.status })) || [],
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchFIRs,
};
