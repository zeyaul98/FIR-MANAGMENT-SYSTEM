const mongoose = require("mongoose");
require("dotenv").config();

const District = require("./models/District");
const Thana = require("./models/Thana");
const FIR = require("./models/FIR");
const Accused = require("./models/Accused");

const seedDashboardData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await District.deleteMany({});
    await Thana.deleteMany({});
    await FIR.deleteMany({});
    await Accused.deleteMany({});
    console.log("✓ Cleared existing data");

    // Bihar Railway districts
    const districtNames = [
      "Patna", "Nalanda", "Araria", "Arwal", "Aurangabad", "Banka",
      "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran",
      "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Jitpur Sharif", "Kaimur",
      "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani",
      "Munger", "Muzaffarpur"
    ];

    const regions = ["North Bihar", "South Bihar", "Central Bihar", "East Bihar", "West Bihar"];

    // Create districts
    const districts = await Promise.all(
      districtNames.map((name, index) => 
        District.create({
          name,
          region: regions[index % regions.length],
          totalThanas: 6 + Math.floor(Math.random() * 8),
        })
      )
    );
    console.log(`✓ Created ${districts.length} districts`);

    // Create thanas for each district
    const thanaNames = [
      "City", "East", "West", "North", "South", "Central", "New", "Old",
      "Police Line", "Market", "Highway", "Rural", "Urban", "Zone"
    ];

    const allThanas = [];
    for (const district of districts) {
      const numThanas = district.totalThanas;
      for (let i = 0; i < numThanas; i++) {
        const thana = await Thana.create({
          name: `${district.name} ${thanaNames[i % thanaNames.length]} Thana`,
          districtId: district._id,
          area: `Area ${i + 1}`,
          totalFIRs: 0,
        });
        allThanas.push(thana);
      }
    }
    console.log(`✓ Created ${allThanas.length} thanas`);

    // Create FIRs and Accused
    const crimeTypes = [
      "Theft", "Assault", "Fraud", "Robbery", "Burglary",
      "Vandalism", "Harassment", "Breach of Peace", "Criminal Intimidation",
      "Forgery", "Criminal Breach of Trust", "Counterfeiting"
    ];

    const statuses = ["registered", "investigation", "closed"];
    let totalAccused = 0;
    let totalBailed = 0;

    // Create 324 FIRs
    for (let i = 0; i < 324; i++) {
      const randomThana = allThanas[Math.floor(Math.random() * allThanas.length)];
      const randomDistrict = districts.find(d => d._id.equals(randomThana.districtId));
      
      const dateOfIncident = new Date();
      dateOfIncident.setMonth(dateOfIncident.getMonth() - Math.floor(Math.random() * 7));
      
      const accusedCount = 1 + Math.floor(Math.random() * 4);
      const accusedList = [];

      // Create accused for this FIR
      for (let j = 0; j < accusedCount; j++) {
        const accusedStatus = ["arrested", "bail", "under-trial"][Math.floor(Math.random() * 3)];
        const accused = await Accused.create({
          name: `Accused ${totalAccused + j + 1}`,
          age: 18 + Math.floor(Math.random() * 50),
          gender: ["male", "female", "other"][Math.floor(Math.random() * 3)],
          address: `Address ${j + 1}, ${randomDistrict.name}`,
          status: accusedStatus,
          firId: null, // Will set after creating FIR
          bailDate: accusedStatus === "bail" ? new Date(dateOfIncident.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
        });
        accusedList.push(accused._id);
        if (accusedStatus === "bail") totalBailed++;
      }

      const fir = await FIR.create({
        firNumber: `FIR/2026/${String(i + 1).padStart(4, "0")}`,
        districtId: randomDistrict._id,
        thanaId: randomThana._id,
        description: `${crimeTypes[Math.floor(Math.random() * crimeTypes.length)]} case filed at ${randomThana.name}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        dateOfIncident,
        dateOfRegistration: new Date(dateOfIncident.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        accused: accusedList,
        totalAccused: accusedCount,
        bailed: accusedList.filter((_, idx) => Math.random() < 0.3).length,
        inCustody: accusedList.length - accusedList.filter((_, idx) => Math.random() < 0.3).length,
      });

      // Update accused with FIR reference
      await Accused.updateMany({ _id: { $in: accusedList } }, { firId: fir._id });

      // Update thana FIR count
      await Thana.updateOne({ _id: randomThana._id }, { $inc: { totalFIRs: 1 } });

      totalAccused += accusedCount;
    }

    console.log(`✓ Created 324 FIRs with ${totalAccused} accused records`);
    console.log(`✓ Total bailed: ${totalBailed}`);
    console.log(`✓ Total in custody: ${totalAccused - totalBailed}`);

    mongoose.connection.close();
    console.log("✅ Dashboard data seeded successfully!");

  } catch (error) {
    console.error("Error seeding data:", error.message);
    process.exit(1);
  }
};

seedDashboardData();
