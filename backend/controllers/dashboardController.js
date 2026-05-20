const District = require("../models/District");
const Thana = require("../models/Thana");
const FIR = require("../models/FIR");
const Accused = require("../models/Accused");

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

module.exports = {
  getDashboardStats,
  getMonthlyTrend,
  getCaseStatusDistribution,
};
