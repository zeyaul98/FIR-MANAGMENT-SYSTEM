const mongoose = require("mongoose");

const firSchema = new mongoose.Schema({
  firNumber: { type: String, required: true, unique: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District" },
  thanaId: { type: mongoose.Schema.Types.ObjectId, ref: "Thana" },
  description: { type: String, required: true },
  status: { type: String, enum: ["registered", "investigation", "closed"], default: "registered" },
  dateOfIncident: { type: Date, required: true },
  dateOfRegistration: { type: Date, default: Date.now },
  accused: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accused" }],
  totalAccused: { type: Number, default: 0 },
  bailed: { type: Number, default: 0 },
  inCustody: { type: Number, default: 0 },
}, { timestamps: true });

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: String,
  totalThanas: Number,
});

const thanaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District" },
  area: String,
  totalFIRs: { type: Number, default: 0 },
});

const accusedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  address: String,
  status: String,
  firId: { type: mongoose.Schema.Types.ObjectId, ref: "FIR" },
  bailDate: Date,
});

const FIR = mongoose.model("FIR", firSchema);
const District = mongoose.model("District", districtSchema);
const Thana = mongoose.model("Thana", thanaSchema);
const Accused = mongoose.model("Accused", accusedSchema);

async function seedData() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/railway_fir");
    console.log("✓ Connected to MongoDB");

    // Clear existing
    await FIR.deleteMany({});
    await Accused.deleteMany({});
    await Thana.deleteMany({});
    await District.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create districts
    const districtNames = ["Patna", "Bihar Sharif", "Madhubani", "Darbhanga", "Begusarai"];
    const districts = await District.insertMany(
      districtNames.map(name => ({ name, region: "Bihar", totalThanas: 5 }))
    );
    console.log(`✓ Created ${districts.length} districts`);

    // Create thanas
    const allThanas = [];
    for (const district of districts) {
      for (let i = 1; i <= 5; i++) {
        const thana = await Thana.create({
          name: `Railway Police Station ${i}, ${district.name}`,
          districtId: district._id,
          area: `${district.name} Area ${i}`,
          totalFIRs: 0,
        });
        allThanas.push(thana);
      }
    }
    console.log(`✓ Created ${allThanas.length} thanas`);

    // Sample data
    const trains = ["Jan Shatabdi Express", "Rajdhani Express", "Seemanchal Express"];
    const criminalTypes = ["Theft", "Robbery", "Assault", "Fraud"];
    const modusOperandi = ["Boarded illegally", "Chain snatching", "Hacked luggage"];
    const items = ["Mobile Phone", "Jewelry", "Cash", "Bag"];
    const places = ["In Train", "Platform", "Waiting Room"];
    const bailers = ["Mr. Sharma", "Mr. Patel", "Mr. Singh"];
    const accusedNames = [
      "Rajesh Kumar", "Vikram Singh", "Arun Verma", "Deepak Sharma", "Sanjay Patel",
      "Rahul Gupta", "Ajay Mishra", "Kiran Kumar", "Nikhil Rao", "Rohan Singh"
    ];

    // Create 100+ FIRs
    for (let i = 1; i <= 120; i++) {
      const district = districts[Math.floor(Math.random() * districts.length)];
      const thana = allThanas.find(t => t.districtId.equals(district._id));
      
      const dateOfIncident = new Date();
      dateOfIncident.setDate(dateOfIncident.getDate() - Math.floor(Math.random() * 365));

      // Create accused
      const accusedCount = 1 + Math.floor(Math.random() * 4);
      const accusedList = [];

      for (let j = 0; j < accusedCount; j++) {
        const accused = await Accused.create({
          name: accusedNames[Math.floor(Math.random() * accusedNames.length)] + ` (${i}-${j})`,
          age: 18 + Math.floor(Math.random() * 50),
          gender: Math.random() > 0.3 ? "male" : "female",
          address: `${Math.floor(Math.random() * 999)} Railway Road, ${district.name}`,
          status: ["arrested", "bail", "under-trial"][Math.floor(Math.random() * 3)],
          firId: null,
        });
        accusedList.push(accused._id);
      }

      // Create FIR
      const year = 2024 + Math.floor(Math.random() * 2);
      const firNumber = `${String(i).padStart(3, "0")}/${year}-${district.name.substring(0, 3).toUpperCase()}`;
      
      const fir = await FIR.create({
        firNumber,
        districtId: district._id,
        thanaId: thana._id,
        description: `${criminalTypes[Math.floor(Math.random() * criminalTypes.length)]}: ${modusOperandi[Math.floor(Math.random() * modusOperandi.length)]}. Looted ${items[Math.floor(Math.random() * items.length)]} at ${places[Math.floor(Math.random() * places.length)]}`,
        status: ["registered", "investigation", "closed"][Math.floor(Math.random() * 3)],
        dateOfIncident,
        dateOfRegistration: new Date(dateOfIncident.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        accused: accusedList,
        totalAccused: accusedCount,
        bailed: Math.floor(Math.random() * (accusedCount + 1)),
        inCustody: Math.floor(Math.random() * (accusedCount + 1)),
      });

      // Update accused with FIR reference
      await Accused.updateMany({ _id: { $in: accusedList } }, { firId: fir._id });

      if (i % 20 === 0) console.log(`✓ Created ${i} FIRs...`);
    }

    console.log("✅ Successfully seeded 120 FIRs!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedData();
