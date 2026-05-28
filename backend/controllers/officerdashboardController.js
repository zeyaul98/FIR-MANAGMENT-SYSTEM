const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");

const bcrypt = require("bcryptjs");
const User = require("../models/User");

const FIR = require("../models/FIR");
const Accused = require("../models/Accused");
const District = require("../models/District");
const Thana = require("../models/Thana");
const Bailer = require("../models/Bailer");


const getOfficerDashboard = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    const officerObjectId = new mongoose.Types.ObjectId(officerId);

    const myCases = await FIR.countDocuments({ officerId: officerObjectId });

    const activeCases = await FIR.countDocuments({
      officerId: officerObjectId,
      status: { $in: ["registered", "investigation"] },
    });

    const closedCases = await FIR.countDocuments({
      officerId: officerObjectId,
      status: "closed",
    });

    const officerFIRs = await FIR.find({ officerId: officerObjectId }).select("_id");
    const firIds = officerFIRs.map((fir) => fir._id);

    const totalAccused = await Accused.countDocuments({ firId: { $in: firIds } });
    const arrested = await Accused.countDocuments({ firId: { $in: firIds }, status: "arrested" });
    const bailed = await Accused.countDocuments({ firId: { $in: firIds }, status: "bail" });
    const jailed = await Accused.countDocuments({
      firId: { $in: firIds },
      status: { $in: ["judicial-custody", "under-trial"] },
    });

    const districtStats = await FIR.aggregate([
      {
        $match: {
          officerId: officerObjectId,
        },
      },
      {
        $group: {
          _id: "$districtId",
          value: { $sum: 1 },
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
      { $unwind: { path: "$district", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ["$district.name", "Unknown"] },
          value: 1,
        },
      },
      { $sort: { value: -1 } },
      { $limit: 5 },
    ]);

    const recentCases = await FIR.find({ officerId: officerObjectId })
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firNumber status dateOfRegistration districtId thanaId");

    res.status(200).json({
      success: true,
      data: {
        myCases,
        activeCases,
        closedCases,
        overview: {
          totalFIRs: myCases,
          totalAccused,
          arrested,
          bailed,
          jailed,
        },
        topDistricts: districtStats,
        recentCases,
      },
    });
  } catch (error) {
    console.error("Officer Dashboard Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFIR = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    const {
      accusedType,
      state,
      zone,
      districtId,
      subDivision,
      circleOffice,
      thanaId,
      court,
      sections,
      firNumber,
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
      accusedList,
      bailerList,
    } = req.body;

    if (!firNumber || !districtId || !thanaId || !description) {
      return res.status(400).json({
        success: false,
        message: "FIR No, District, Thana and Description required",
      });
    }

    let finalDistrictId = districtId;
    let finalThanaId = thanaId;

    if (!mongoose.Types.ObjectId.isValid(districtId)) {
      const district = await District.findOne({ name: districtId });
      if (!district) {
        return res.status(400).json({
          success: false,
          message: "District database me nahi mila",
        });
      }
      finalDistrictId = district._id;
    }

    if (!mongoose.Types.ObjectId.isValid(thanaId)) {
      const thana = await Thana.findOne({ name: thanaId });
      if (!thana) {
        return res.status(400).json({
          success: false,
          message: "Thana database me nahi mila",
        });
      }
      finalThanaId = thana._id;
    }

    const parsedAccused = accusedList ? JSON.parse(accusedList) : [];
    const parsedBailers = bailerList ? JSON.parse(bailerList) : [];

    const fir = await FIR.create({
      accusedType,
      state,
      zone,
      districtId: finalDistrictId,
      subDivision,
      circleOffice,
      thanaId: finalThanaId,
      court,
      sections,
      firNumber,
      year: year ? Number(year) : null,
      dateOfIncident: dateOfRegistration || new Date(),
      dateOfRegistration: dateOfRegistration || new Date(),
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
      attachment: req.file ? req.file.path : "",
      officerId,
      status: "registered",
      totalAccused: parsedAccused.length,
      bailed: parsedAccused.filter((a) => a.status === "bail").length,
      inCustody: parsedAccused.filter((a) =>
        ["arrested", "judicial-custody", "under-trial"].includes(a.status)
      ).length,
    });

    const accusedIds = [];

    for (const item of parsedAccused) {
      if (!item.name || !item.age || !item.address) continue;

      const accused = await Accused.create({
        firId: fir._id,
        officerId,

        name: item.name,
        aadhaar: item.aadhaar || "",
        gender: item.gender || "male",
        dob: item.dob || null,
        age: item.age ? Number(item.age) : null,
        fatherName: item.fatherName || "",
        markIdentification: item.markIdentification || "",
        built: item.built || "",
        relationWithBailer: item.relationWithBailer || "",
        policeStation: item.policeStation || "",
        state: item.state || state || "",
        districtId: item.districtId || finalDistrictId,
        thanaId: item.thanaId || finalThanaId,
        address: item.address || "",
        pinCode: item.pinCode || "",
        mobile: item.mobile || "",
        sections: sections || "",
        status: item.status || "other",
        isJailCustody: item.isJailCustody || false,
        isAbsconding: item.status === "absconding",
        remarks: item.remarks || "",
      });

      accusedIds.push(accused._id);
    }

    const bailerIds = [];

    for (const item of parsedBailers) {
      if (!item.name && !item.mobile && !item.aadhaar) continue;

      const bailer = await Bailer.create({
        firId: fir._id,
        officerId,

        bailDate: item.bailDate || null,
        name: item.name || "",
        aadhaar: item.aadhaar || "",
        gender: item.gender || "male",
        dob: item.dob || null,
        age: item.age ? Number(item.age) : null,
        fatherName: item.fatherName || "",
        relationWithAccused: item.relationWithAccused || "",

        railPoliceStation: item.railPoliceStation || finalThanaId,
        bailCourt: item.bailCourt || "",
        state: item.state || state || "",
        districtId: item.districtId || finalDistrictId,
        address: item.address || "",
        pinCode: item.pinCode || "",
        mobile: item.mobile || "",
        securityAmount: item.securityAmount
          ? Number(item.securityAmount)
          : 0,
        status: "active",
      });

      bailerIds.push(bailer._id);
    }

    fir.accused = accusedIds;
    fir.bailers = bailerIds;
    await fir.save();

    res.status(201).json({
      success: true,
      message: "FIR submitted successfully",
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

const getDistricts = async (req, res) => {
  try {
    const districts = await District.find().sort({ name: 1 });

    res.json({
      success: true,
      data: districts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getThanasByDistrict = async (req, res) => {
  try {
    const thanas = await Thana.find({
      districtId: req.params.districtId,
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: thanas,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






//FOR BULK UPLOAD FUNCTIONS

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
};

const findDistrictId = async (name) => {
  if (!name) return null;
  if (mongoose.Types.ObjectId.isValid(name)) return name;

  const district = await District.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" },
  });

  return district?._id || null;
};

const findThanaId = async (name, districtId) => {
  if (!name) return null;
  if (mongoose.Types.ObjectId.isValid(name)) return name;

  const query = {
    name: { $regex: `^${name.trim()}$`, $options: "i" },
  };

  if (districtId) query.districtId = districtId;

  const thana = await Thana.findOne(query);
  return thana?._id || null;
};

// 1. FIR MASTER CSV
const uploadFIRCSV = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file required",
      });
    }

    const rows = await readCSV(req.file.path);

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const row of rows) {
      try {
        const firNumber = row.fir_no || row.firNumber;

        if (!firNumber) {
          skipped++;
          errors.push("FIR number missing");
          continue;
        }

        const exists = await FIR.findOne({ firNumber });
        if (exists) {
          skipped++;
          continue;
        }

        const districtId = await findDistrictId(row.district);
        const thanaId = await findThanaId(row.thana || row.police_station, districtId);

        if (!districtId || !thanaId) {
          skipped++;
          errors.push(`District/Thana not found for FIR ${firNumber}`);
          continue;
        }

        await FIR.create({
          firNumber,
          accusedType: row.accused_type || "",
          state: row.state || "",
          zone: row.zone || "",
          districtId,
          subDivision: row.subdivision || "",
          circleOffice: row.circle_office || "",
          thanaId,
          court: row.court || "",
          sections: row.sections_of_law || "",
          year: row.year ? Number(row.year) : null,
          dateOfIncident: row.fir_date || new Date(),
          dateOfRegistration: row.fir_date || new Date(),
          incidentTime: row.time_of_incident || "",
          modusOperandi: row.modus_operandi || "",
          itemLooted: row.item_looted || "",
          trainNo: row.train_number || "",
          trainName: row.train_name || "",
          stationCode: row.station_code || "",
          stationName: row.place_of_occurrence || "",
          platformNo: row.platform_no || "",
          description: row.brief_of_case || "CSV uploaded FIR",
          ioName: row.io_name || "",
          officerId,
          status: "registered",
        });

        inserted++;
      } catch (err) {
        skipped++;
        errors.push(err.message);
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `FIR CSV uploaded. Inserted: ${inserted}, Skipped: ${skipped}`,
      inserted,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("Upload FIR CSV Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. ACCUSED DETAILS CSV
const uploadAccusedCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "CSV file required" });
    }

    const rows = await readCSV(req.file.path);

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const row of rows) {
      try {
        const firNumber = row.fir_no;
        const fir = await FIR.findOne({ firNumber });

        if (!fir) {
          skipped++;
          errors.push(`FIR not found: ${firNumber}`);
          continue;
        }

        const accused = await Accused.create({
          firId: fir._id,
          name: row.accused_name,
          gender: row.gender || "male",
          age: row.age ? Number(row.age) : null,
          markIdentification: row.mark_of_identification || "",
          built: row.built || "",
          fatherName: row.father_spouse_name || "",
          address: row.accused_address || "",
          policeStation: row.accused_ps || "",
          districtId: fir.districtId,
          thanaId: fir.thanaId,
          state: row.accused_state || "",
          mobile: row.accused_mobile || "",
          status: "other",
          sections: fir.sections || "",
        });

        fir.accused.push(accused._id);
        fir.totalAccused = fir.accused.length;
        await fir.save();

        inserted++;
      } catch (err) {
        skipped++;
        errors.push(err.message);
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Accused CSV uploaded. Inserted: ${inserted}, Skipped: ${skipped}`,
      inserted,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("Upload Accused CSV Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. ACCUSED STATUS CSV
const uploadAccusedStatusCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "CSV file required" });
    }

    const rows = await readCSV(req.file.path);

    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const row of rows) {
      try {
        const fir = await FIR.findOne({ firNumber: row.fir_no });

        if (!fir) {
          skipped++;
          errors.push(`FIR not found: ${row.fir_no}`);
          continue;
        }

        const accused = await Accused.findOne({
          firId: fir._id,
          name: { $regex: `^${row.accused_name?.trim()}$`, $options: "i" },
        });

        if (!accused) {
          skipped++;
          errors.push(`Accused not found: ${row.accused_name}`);
          continue;
        }

        accused.status = row.custody_status || accused.status;
        accused.jailName = row.jail_name || "";
        accused.courtOrderingJC = row.court_ordering_jc || "";
        accused.jcSince = row.jc_since || null;
        accused.isJailCustody = ["jail", "judicial-custody", "under-trial"].includes(
          String(row.custody_status || "").toLowerCase()
        );

        await accused.save();
        updated++;
      } catch (err) {
        skipped++;
        errors.push(err.message);
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Accused status CSV uploaded. Updated: ${updated}, Skipped: ${skipped}`,
      updated,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("Upload Accused Status CSV Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. BAILER CSV
const uploadBailerCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "CSV file required" });
    }

    const rows = await readCSV(req.file.path);

    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const row of rows) {
      try {
        const fir = await FIR.findOne({ firNumber: row.fir_no });

        if (!fir) {
          skipped++;
          errors.push(`FIR not found: ${row.fir_no}`);
          continue;
        }

        const accused = await Accused.findOne({
          firId: fir._id,
          name: { $regex: `^${row.accused_name?.trim()}$`, $options: "i" },
        });

        if (!accused) {
          skipped++;
          errors.push(`Accused not found: ${row.accused_name}`);
          continue;
        }

        accused.bailer = {
          bailDate: row.bail_date || null,
          bailCourt: row.bail_court || "",
          name: row.bailer_name || "",
          age: row.bailer_age ? Number(row.bailer_age) : null,
          gender: row.bailer_gender || "",
          mobile: row.bailer_mobile || "",
          suretyAmount: row.surety_amount ? Number(row.surety_amount) : 0,
          fatherName: row.bailer_father_name || "",
          address: row.bailer_address || "",
          policeStation: row.bailer_ps || "",
          district: row.bailer_district || "",
          state: row.bailer_state || "",
        };

        accused.status = "bail";
        await accused.save();

        fir.bailed = await Accused.countDocuments({
          firId: fir._id,
          status: "bail",
        });
        await fir.save();

        updated++;
      } catch (err) {
        skipped++;
        errors.push(err.message);
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Bailer CSV uploaded. Updated: ${updated}, Skipped: ${skipped}`,
      updated,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("Upload Bailer CSV Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};





//FIRLIST ROUTE 

// Officer FIR List with filters
const getOfficerFIRs = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    const {
      page = 1,
      limit = 10,
      search = "",
      searchType = "firNumber",
      status,
      state,
      district,
      thana,
      section,
      fromDate,
      toDate,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let filters = {
      officerId: new mongoose.Types.ObjectId(officerId),
    };

    if (search) {
      if (searchType === "description") {
        filters.description = { $regex: search, $options: "i" };
      } else if (searchType === "ioName") {
        filters.ioName = { $regex: search, $options: "i" };
      } else {
        filters.firNumber = { $regex: search, $options: "i" };
      }
    }

    if (status) filters.status = status;
    if (state) filters.state = state;
    if (section) filters.sections = { $regex: section, $options: "i" };

    if (district && mongoose.Types.ObjectId.isValid(district)) {
      filters.districtId = district;
    }

    if (thana && mongoose.Types.ObjectId.isValid(thana)) {
      filters.thanaId = thana;
    }

    if (fromDate || toDate) {
      filters.dateOfRegistration = {};

      if (fromDate) {
        filters.dateOfRegistration.$gte = new Date(fromDate);
      }

      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        filters.dateOfRegistration.$lte = end;
      }
    }

    const total = await FIR.countDocuments(filters);

    const firs = await FIR.find(filters)
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .populate("accused", "name status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: firs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (error) {
    console.error("Get Officer FIRs Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Single FIR View
const getOfficerFIRById = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const fir = await FIR.findOne({
      _id: id,
      officerId: new mongoose.Types.ObjectId(officerId),
    })
      .populate("districtId", "name")
      .populate("thanaId", "name area")
      .populate("officerId", "name username role")
      .populate({
        path: "accused",
        populate: [
          { path: "districtId", select: "name" },
          { path: "thanaId", select: "name area" },
        ],
      })
      .populate({
        path: "bailers",
        populate: [
          { path: "districtId", select: "name" },
          { path: "railPoliceStation", select: "name area" },
        ],
      });

    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR not found",
      });
    }

    let firObj = fir.toObject();

    // fallback: agar old FIR me bailers array empty hai,
    // lekin Bailer collection me firId se data saved hai
    if (!firObj.bailers || firObj.bailers.length === 0) {
      firObj.bailers = await Bailer.find({
        firId: id,
        officerId: new mongoose.Types.ObjectId(officerId),
      })
        .populate("districtId", "name")
        .populate("railPoliceStation", "name area");
    }

    res.status(200).json({
      success: true,
      data: firObj,
    });
  } catch (error) {
    console.error("Get FIR By ID Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Update FIR
const updateOfficerFIR = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    const fir = await FIR.findOne({
      _id: id,
      officerId: new mongoose.Types.ObjectId(officerId),
    });

    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR not found or not allowed",
      });
    }

    const {
      accusedList,
      bailerList,
      districtId,
      thanaId,
      year,
      dateOfRegistration,
      ...firFields
    } = req.body;

    Object.keys(firFields).forEach((key) => {
      if (firFields[key] !== undefined) {
        fir[key] = firFields[key];
      }
    });

    if (districtId) fir.districtId = districtId;
    if (thanaId) fir.thanaId = thanaId;

    // YEAR FIX
    if (year === "" || year === undefined || year === null) {
      fir.year = null;
    } else {
      const parsedYear = Number(year);

      if (Number.isNaN(parsedYear)) {
        return res.status(400).json({
          success: false,
          message: "Year valid number hona chahiye",
        });
      }

      fir.year = parsedYear;
    }

    if (dateOfRegistration) {
      fir.dateOfRegistration = dateOfRegistration;
      fir.dateOfIncident = dateOfRegistration;
    }

    if (req.file) {
      fir.attachment = req.file.path;
    }

    if (accusedList) {
      const parsedAccused =
        typeof accusedList === "string" ? JSON.parse(accusedList) : accusedList;

      await Accused.deleteMany({
        firId: fir._id,
      });

      const accusedIds = [];

      for (const item of parsedAccused) {
        if (!item.name || !item.address) continue;

        const accusedAge =
          item.age === "" || item.age === undefined || item.age === null
            ? null
            : Number(item.age);

        if (accusedAge !== null && Number.isNaN(accusedAge)) {
          return res.status(400).json({
            success: false,
            message: "Accused age valid number hona chahiye",
          });
        }

        const accused = await Accused.create({
          firId: fir._id,
          officerId,

          name: item.name,
          aadhaar: item.aadhaar || "",
          gender: item.gender || "male",
          dob: item.dob || null,
          age: accusedAge || 0,
          fatherName: item.fatherName || "",
          markIdentification: item.markIdentification || "",
          built: item.built || "",
          relationWithBailer: item.relationWithBailer || "",
          policeStation: item.policeStation || "",
          state: item.state || fir.state || "",
          districtId: item.districtId || fir.districtId,
          thanaId: item.thanaId || fir.thanaId,
          address: item.address || "",
          pinCode: item.pinCode || "",
          mobile: item.mobile || "",
          sections: fir.sections || "",
          status: item.status || "other",
          isJailCustody: item.isJailCustody || false,
          isAbsconding: item.status === "absconding",
          remarks: item.remarks || "",
        });

        accusedIds.push(accused._id);
      }

      fir.accused = accusedIds;
      fir.totalAccused = accusedIds.length;
      fir.bailed = parsedAccused.filter((a) => a.status === "bail").length;
      fir.inCustody = parsedAccused.filter((a) =>
        ["arrested", "judicial-custody", "under-trial"].includes(a.status)
      ).length;
    }

    if (bailerList) {
      const parsedBailers =
        typeof bailerList === "string" ? JSON.parse(bailerList) : bailerList;

      await Bailer.deleteMany({
        firId: fir._id,
      });

      const bailerIds = [];

      for (const item of parsedBailers) {
        if (!item.name && !item.mobile && !item.aadhaar) continue;

        const bailerAge =
          item.age === "" || item.age === undefined || item.age === null
            ? null
            : Number(item.age);

        if (bailerAge !== null && Number.isNaN(bailerAge)) {
          return res.status(400).json({
            success: false,
            message: "Bailer age valid number hona chahiye",
          });
        }

        const securityAmount =
          item.securityAmount === "" ||
          item.securityAmount === undefined ||
          item.securityAmount === null
            ? 0
            : Number(item.securityAmount);

        if (Number.isNaN(securityAmount)) {
          return res.status(400).json({
            success: false,
            message: "Security amount valid number hona chahiye",
          });
        }

        const bailer = await Bailer.create({
          firId: fir._id,
          officerId,

          bailDate: item.bailDate || null,
          name: item.name || "",
          aadhaar: item.aadhaar || "",
          gender: item.gender || "male",
          dob: item.dob || null,
          age: bailerAge,
          fatherName: item.fatherName || "",
          relationWithAccused: item.relationWithAccused || "",
          railPoliceStation: item.railPoliceStation || fir.thanaId,
          bailCourt: item.bailCourt || "",
          state: item.state || fir.state || "",
          districtId: item.districtId || fir.districtId,
          address: item.address || "",
          pinCode: item.pinCode || "",
          mobile: item.mobile || "",
          securityAmount,
          status: item.status || "active",
        });

        bailerIds.push(bailer._id);
      }

      fir.bailers = bailerIds;
    }

    await fir.save();

    const updatedFIR = await FIR.findById(fir._id)
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .populate("accused")
      .populate("bailers");

    res.status(200).json({
      success: true,
      message: "FIR updated successfully",
      data: updatedFIR,
    });
  } catch (error) {
    console.error("Update FIR Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// Delete FIR
const deleteOfficerFIR = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const fir = await FIR.findOneAndDelete({
      _id: id,
      officerId: new mongoose.Types.ObjectId(officerId),
    });

    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR not found or not allowed",
      });
    }

    await Accused.deleteMany({ firId: fir._id });

    res.status(200).json({
      success: true,
      message: "FIR deleted successfully",
    });
  } catch (error) {
    console.error("Delete FIR Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





//ACCUSEED LIST ROUTES ARE IN ACCUSED CONTROLLER

const getOfficerAccusedList = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, district } = req.query;

    const officerFIRs = await FIR.find({ officerId }).select("_id");
    const firIds = officerFIRs.map((f) => f._id);

    const query = {
      firId: { $in: firIds },
    };

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { fatherName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    if (district) {
      query.$or = [
        ...(query.$or || []),
        { state: { $regex: district, $options: "i" } },
      ];
    }

    const total = await Accused.countDocuments(query);

    const accused = await Accused.find(query)
      .populate({
        path: "firId",
        select: "firNumber sections districtId thanaId",
        populate: [
          { path: "districtId", select: "name" },
          { path: "thanaId", select: "name" },
        ],
      })
      .populate("districtId", "name")
      .populate("thanaId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: accused,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Get Officer Accused Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};







//GET BAILER DETIALS
const getOfficerBailers = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, district } = req.query;

    const query = {
      officerId: new mongoose.Types.ObjectId(officerId),
    };

    if (status) query.status = status;

    if (district) {
      query.$or = [
        { state: { $regex: district, $options: "i" } },
      ];
    }

    if (search) {
      query.$or = [
        ...(query.$or || []),
        { name: { $regex: search, $options: "i" } },
        { fatherName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { aadhaar: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Bailer.countDocuments(query);

    const bailers = await Bailer.find(query)
      .populate("firId", "firNumber sections")
      .populate("districtId", "name")
      .populate("railPoliceStation", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: bailers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
      },
    });
  } catch (error) {
    console.error("Get Bailers Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBailerById = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    const bailer = await Bailer.findOne({
      _id: req.params.id,
      officerId,
    })
      .populate("firId", "firNumber sections")
      .populate("districtId", "name")
      .populate("railPoliceStation", "name");

    if (!bailer) {
      return res.status(404).json({
        success: false,
        message: "Bailer record not found",
      });
    }

    res.json({
      success: true,
      data: bailer,
    });
  } catch (error) {
    console.error("Get Bailer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const deleteBailer = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    const bailer = await Bailer.findOneAndDelete({
      _id: req.params.id,
      officerId,
    });

    if (!bailer) {
      return res.status(404).json({
        success: false,
        message: "Bailer record not found",
      });
    }

    res.json({
      success: true,
      message: "Bailer deleted successfully",
    });
  } catch (error) {
    console.error("Delete Bailer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



//USER PAGE KE LIYE UPDATE AND CHANGE PASSWORD
const updateOfficerProfile = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    const { name, email, mobile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      officerId,
      {
        name,
        email,
        mobile,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Officer Profile Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeOfficerPassword = async (req, res) => {
  try {
    const officerId = req.user?._id || req.user?.id;

    if (!officerId) {
      return res.status(401).json({
        success: false,
        message: "Officer not authenticated",
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(officerId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // IMPORTANT: yaha plain newPassword assign karo
    // pre-save hook automatically hash karega
    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error("Change Officer Password Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  getOfficerDashboard,
  createFIR,
  getDistricts,
  getThanasByDistrict,


  uploadFIRCSV,
  uploadAccusedCSV,
  uploadAccusedStatusCSV,
  uploadBailerCSV,


  getOfficerFIRs,
  getOfficerFIRById,
  updateOfficerFIR,
  deleteOfficerFIR,


  getOfficerAccusedList,


  getOfficerBailers,
  getBailerById,
  deleteBailer,

  updateOfficerProfile,
  changeOfficerPassword,
};