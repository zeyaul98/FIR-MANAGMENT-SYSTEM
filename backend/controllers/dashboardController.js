const District = require("../models/District");
const Thana = require("../models/Thana");
const FIR = require("../models/FIR");
const Accused = require("../models/Accused");
const fs = require("fs");
const csv = require("csv-parser");

const getDashboardStats = async (req, res) => {
  try {
    const totalDistricts = await District.countDocuments();
    const totalThanas = await Thana.countDocuments();
    const totalFIRs = await FIR.countDocuments();
    
    const accusedData = await Accused.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAccused = await Accused.countDocuments();
    
    let totalBailed = 0;
    let totalBailees = 0;
    let totalInCustody = 0;

    accusedData.forEach((item) => {
      if (item._id === "bail") {
        totalBailed = item.count;
      } else if (item._id === "arrested") {
        totalInCustody = item.count;
      }
    });

    totalBailees = totalFIRs > 0 ? Math.floor(totalFIRs / 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalDistricts,
        totalThanas,
        totalFIRs,
        totalAccused,
        totalBailed,
        totalBailees,
        totalInCustody,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMonthlyTrend = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await FIR.aggregate([
      {
        $match: {
          dateOfRegistration: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateOfRegistration" },
            month: { $month: "$dateOfRegistration" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendData = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1],
      count: item.count,
      fullDate: `${monthNames[item._id.month - 1]} ${item._id.year}`
    }));

    res.status(200).json({
      success: true,
      data: trendData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCaseStatusDistribution = async (req, res) => {
  try {
    const statusData = await FIR.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const distribution = {
      registered: 0,
      investigation: 0,
      closed: 0
    };

    statusData.forEach((item) => {
      distribution[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all accused with search and pagination
const getAllAccused = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let filters = {};
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }
    if (status) {
      filters.status = status;
    }

    const total = await Accused.countDocuments(filters);
    const accused = await Accused.find(filters)
  .populate({
    path: "firId",
    select: "firNumber description status districtId thanaId dateOfRegistration",
    populate: [
      { path: "districtId", select: "name" },
      { path: "thanaId", select: "name" },
    ],
  })
  .populate("districtId", "name")
  .populate("thanaId", "name")
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: accused,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all bailers (accused with bail status)
const getAllBailers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filters = { status: "bail" };
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    const total = await Accused.countDocuments(filters);
    const bailers = await Accused.find(filters)
      .populate("firId", "firNumber description")
      .sort({ bailDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: bailers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get district wise report
const getDistrictWiseReport = async (req, res) => {
  try {
    const districtReport = await FIR.aggregate([
      {
        $group: {
          _id: "$districtId",
          totalFIRs: { $sum: 1 },
          totalAccused: { $sum: "$totalAccused" },
          bailed: { $sum: "$bailed" },
          inCustody: { $sum: "$inCustody" }
        }
      },
      {
        $lookup: {
          from: "districts",
          localField: "_id",
          foreignField: "_id",
          as: "district"
        }
      },
      {
        $unwind: { path: "$district", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          district: "$district.name",
          totalFIRs: 1,
          totalAccused: 1,
          bailed: 1,
          inCustody: 1
        }
      },
      { $sort: { totalFIRs: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: districtReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get thana wise report
const getThanaWiseReport = async (req, res) => {
  try {
    const thanaReport = await FIR.aggregate([
      {
        $group: {
          _id: "$thanaId",
          totalFIRs: { $sum: 1 },
          totalAccused: { $sum: "$totalAccused" },
          bailed: { $sum: "$bailed" },
          inCustody: { $sum: "$inCustody" }
        }
      },
      {
        $lookup: {
          from: "thanas",
          localField: "_id",
          foreignField: "_id",
          as: "thana"
        }
      },
      {
        $unwind: { path: "$thana", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          thana: "$thana.name",
          totalFIRs: 1,
          totalAccused: 1,
          bailed: 1,
          inCustody: 1
        }
      },
      { $sort: { totalFIRs: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: thanaReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get repeat offenders
const getRepeatOffenders = async (req, res) => {
  try {
    const repeatOffenders = await Accused.aggregate([
      {
        $lookup: {
          from: "firs",
          localField: "firId",
          foreignField: "_id",
          as: "fir"
        }
      },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          accusedId: { $first: "$_id" },
          status: { $first: "$status" },
          address: { $first: "$address" },
          gender: { $first: "$gender" },
          age: { $first: "$age" }
        }
      },
      {
        $match: { count: { $gte: 2 } }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: repeatOffenders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get custody status report
const getCustodyStatusReport = async (req, res) => {
  try {
    const total = await Accused.countDocuments();
    const arrested = await Accused.countDocuments({ status: "arrested" });
    const bail = await Accused.countDocuments({ status: "bail" });
    const underTrial = await Accused.countDocuments({ status: "under-trial" });

    const accusedList = await Accused.find()
      .populate("firId", "firNumber description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      summary: {
        total,
        arrested,
        bail,
        underTrial
      },
      data: accusedList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get daily FIR report
const getDailyFIRReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyFIRs = await FIR.find({
      dateOfRegistration: { $gte: today, $lt: tomorrow }
    })
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .populate("accused", "name status")
      .sort({ dateOfRegistration: -1 });

    res.status(200).json({
      success: true,
      date: today.toISOString().split('T')[0],
      count: dailyFIRs.length,
      data: dailyFIRs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get monthly crime report
const getMonthlyCrimeReport = async (req, res) => {
  try {
    const monthlyReport = await FIR.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$dateOfRegistration" },
            month: { $month: "$dateOfRegistration" }
          },
          totalFIRs: { $sum: 1 },
          totalAccused: { $sum: "$totalAccused" },
          bailed: { $sum: "$bailed" },
          inCustody: { $sum: "$inCustody" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = monthlyReport.map(item => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      totalFIRs: item.totalFIRs,
      totalAccused: item.totalAccused,
      bailed: item.bailed,
      inCustody: item.inCustody
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all FIRs with search
const getAllFIRs = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, status, district, thana } = req.query;
    const skip = (page - 1) * limit;

    let filters = {};
    
    if (search) {
      filters.$or = [
        { firNumber: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    if (status) {
      filters.status = status;
    }
    
    if (district) {
      filters.districtId = district;
    }
    
    if (thana) {
      filters.thanaId = thana;
    }

    const total = await FIR.countDocuments(filters);
    const firs = await FIR.find(filters)
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .populate("accused", "name status")
      .sort({ dateOfRegistration: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: firs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getOfficerDashboard = async (req, res) => {
  try {
    const officerId = req.user?._id;

    const myCases = await FIR.countDocuments({ officerId });
    const activeCases = await FIR.countDocuments({
      officerId,
      status: { $in: ["registered", "investigation"] },
    });
    const closedCases = await FIR.countDocuments({
      officerId,
      status: "closed",
    });

    const totalFIRs = await FIR.countDocuments({ officerId });

    const firs = await FIR.find({ officerId }).select("_id");
    const firIds = firs.map((f) => f._id);

    const totalAccused = await Accused.countDocuments({
      firId: { $in: firIds },
    });

    const arrested = await Accused.countDocuments({
      firId: { $in: firIds },
      status: "arrested",
    });

    const bailed = await Accused.countDocuments({
      firId: { $in: firIds },
      status: "bail",
    });

    const jailed = await Accused.countDocuments({
      firId: { $in: firIds },
      status: { $in: ["judicial-custody", "under-trial"] },
    });

    const topDistricts = await FIR.aggregate([
      { $match: { officerId } },
      {
        $group: {
          _id: "$districtId",
          totalFIRs: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "districts",
          localField: "_id",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" },
      {
        $project: {
          name: "$district.name",
          value: "$totalFIRs",
        },
      },
      { $sort: { value: -1 } },
      { $limit: 5 },
    ]);

    const recentCases = await FIR.find({ officerId })
      .populate("districtId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firNumber status dateOfRegistration districtId");

    res.status(200).json({
      success: true,
      data: {
        myCases,
        activeCases,
        closedCases,
        overview: {
          totalFIRs,
          totalAccused,
          arrested,
          bailed,
          jailed,
        },
        topDistricts,
        recentCases,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const createFIR = async (req, res) => {
  try {
    const {
      firNumber,
      accusedType,
      state,
      zone,
      districtId,
      subDivision,
      circleOffice,
      thanaId,
      court,
      sections,
      year,
      dateOfRegistration,
      incidentTime,
      modusOperandi,
      itemLooted,
      description,

      trainNo,
      trainName,
      stationCode,
      stationName,
      platformNo,

      ioName,
      beltNo,
      rank,
      ioMobile,

      lawyerName,
      barCouncilNo,
      lawyerMobile,
      lawyerEmail,
    } = req.body;

    const accusedList = req.body.accusedList
      ? JSON.parse(req.body.accusedList)
      : [];

    const fir = await FIR.create({
      firNumber,
      accusedType,
      state,
      zone,
      districtId,
      subDivision,
      circleOffice,
      thanaId,
      court,
      sections,
      year,
      description,

      dateOfIncident: dateOfRegistration,
      dateOfRegistration,
      incidentTime,
      modusOperandi,
      itemLooted,

      trainNo,
      trainName,
      stationCode,
      stationName,
      platformNo,

      ioDetails: {
        ioName,
        beltNo,
        rank,
        ioMobile,
      },

      lawyerDetails: {
        lawyerName,
        barCouncilNo,
        lawyerMobile,
        lawyerEmail,
      },

      attachment: req.file ? req.file.path : "",

      officerId: req.user?._id,
    });

    const accusedDocs = await Accused.insertMany(
      accusedList.map((item) => ({
        firId: fir._id,
        name: item.name,
        fatherName: item.fatherName,
        age: item.age,
        gender: item.gender,
        mobile: item.mobile,
        aadhaar: item.aadhaar,
        address: item.address,

        districtId: item.districtId || districtId,
        thanaId: item.thanaId || thanaId,
        sections,

        status: item.status || "other",
        isAbsconding: item.status === "absconding",
        isJailCustody: item.isJailCustody || false,

        dob: item.dob || null,
        markIdentification: item.markIdentification,
        built: item.built,
        relationWithBailer: item.relationWithBailer,
        policeStation: item.policeStation,
        state: item.state,
        pinCode: item.pinCode,
      }))
    );

    const accusedIds = accusedDocs.map((a) => a._id);

    const bailed = accusedDocs.filter((a) => a.status === "bail").length;

    const inCustody = accusedDocs.filter(
      (a) =>
        a.status === "judicial-custody" ||
        a.status === "under-trial" ||
        a.isJailCustody === true
    ).length;

    fir.accused = accusedIds;
    fir.totalAccused = accusedDocs.length;
    fir.bailed = bailed;
    fir.inCustody = inCustody;

    await fir.save();

    res.status(201).json({
      success: true,
      message: "FIR created successfully",
      data: fir,
    });
  } catch (error) {
    console.error("Create FIR Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const uploadFIRCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    const rows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", async () => {
        try {
          let createdFIRs = 0;
          let createdAccused = 0;
          const errors = [];

          for (const [index, row] of rows.entries()) {
            try {
              const fir = await FIR.create({
                firNumber: row.firNumber,
                accusedType: row.accusedType || "",
                state: row.state || "",
                zone: row.zone || "",
                districtId: row.districtId,
                subDivision: row.subDivision || "",
                circleOffice: row.circleOffice || "",
                thanaId: row.thanaId,
                court: row.court || "",
                sections: row.sections || "",
                year: row.year || null,
                description: row.description || "No description",

                dateOfIncident: row.dateOfIncident || row.dateOfRegistration,
                dateOfRegistration: row.dateOfRegistration || new Date(),
                incidentTime: row.incidentTime || "",
                modusOperandi: row.modusOperandi || "",
                itemLooted: row.itemLooted || "",

                trainNo: row.trainNo || "",
                trainName: row.trainName || "",
                stationCode: row.stationCode || "",
                stationName: row.stationName || "",
                platformNo: row.platformNo || "",

                ioDetails: {
                  ioName: row.ioName || "",
                  beltNo: row.beltNo || "",
                  rank: row.rank || "",
                  ioMobile: row.ioMobile || "",
                },

                lawyerDetails: {
                  lawyerName: row.lawyerName || "",
                  barCouncilNo: row.barCouncilNo || "",
                  lawyerMobile: row.lawyerMobile || "",
                  lawyerEmail: row.lawyerEmail || "",
                },

                officerId: req.user?._id,
              });

              const accusedData = [];

              if (row.accusedName) {
                accusedData.push({
                  firId: fir._id,
                  name: row.accusedName,
                  fatherName: row.fatherName || "",
                  age: Number(row.age) || 0,
                  gender: row.gender || "male",
                  mobile: row.mobile || "",
                  aadhaar: row.aadhaar || "",
                  address: row.address || "Not available",
                  districtId: row.accusedDistrictId || row.districtId,
                  thanaId: row.accusedThanaId || row.thanaId,
                  sections: row.sections || "",
                  status: row.accusedStatus || "other",
                  isAbsconding: row.accusedStatus === "absconding",
                  bailDate: row.bailDate || null,
                  remarks: row.remarks || "",
                  dob: row.dob || null,
                  markIdentification: row.markIdentification || "",
                  built: row.built || "",
                  relationWithBailer: row.relationWithBailer || "",
                  policeStation: row.policeStation || "",
                  state: row.accusedState || row.state || "",
                  pinCode: row.pinCode || "",
                  isJailCustody:
                    row.isJailCustody === "true" ||
                    row.isJailCustody === "yes",
                });
              }

              const accusedDocs = accusedData.length
                ? await Accused.insertMany(accusedData)
                : [];

              fir.accused = accusedDocs.map((a) => a._id);
              fir.totalAccused = accusedDocs.length;
              fir.bailed = accusedDocs.filter((a) => a.status === "bail").length;
              fir.inCustody = accusedDocs.filter(
                (a) =>
                  a.status === "judicial-custody" ||
                  a.status === "under-trial" ||
                  a.isJailCustody === true
              ).length;

              await fir.save();

              createdFIRs++;
              createdAccused += accusedDocs.length;
            } catch (err) {
              errors.push({
                row: index + 2,
                message: err.message,
              });
            }
          }

          fs.unlinkSync(req.file.path);

          res.status(201).json({
            success: true,
            message: "CSV imported successfully",
            createdFIRs,
            createdAccused,
            errors,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message,
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOfficerFIRList = async (req, res) => {
  try {
    const officerId = req.user?._id;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    const firs = await FIR.find({ officerId })
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .populate("accused", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: firs.length,
      data: firs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




module.exports = {
  getDashboardStats,
  getMonthlyTrend,
  getCaseStatusDistribution,
  getAllAccused,
  getAllBailers,
  getDistrictWiseReport,
  getThanaWiseReport,
  getRepeatOffenders,
  getCustodyStatusReport,
  getDailyFIRReport,
  getMonthlyCrimeReport,
  getAllFIRs,
  getOfficerDashboard,
  createFIR,
  uploadFIRCSV,
  getOfficerFIRList,
};
