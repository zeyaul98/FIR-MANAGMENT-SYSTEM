#!/usr/bin/env node

const https = require('https');
const http = require('http');

// This script seeds MongoDB with mock FIR data
// Run with: node manualSeed.js

const MONGO_URL = "mongodb://127.0.0.1:27017/railway_fir";
const mockData = {
  districts: ["Patna", "Bihar Sharif", "Madhubani", "Darbhanga", "Begusarai"],
  firs: [
    {
      firNumber: "160/2025-PAT",
      description: "Theft: Boarded illegally. Looted Mobile Phone at In Train",
      totalAccused: 4,
      bailed: 4,
    },
    {
      firNumber: "011/2025-BSH",
      description: "Robbery: Chain snatching. Looted Jewelry at Platform",
      totalAccused: 1,
      bailed: 1,
    },
    {
      firNumber: "202/2025-DAR",
      description: "Assault: Threatened staff. Looted Cash at Waiting Room",
      totalAccused: 1,
      bailed: 0,
    },
    {
      firNumber: "045/2025-MAD",
      description: "Fraud: Counterfeited currency. Looted Documents at Platform",
      totalAccused: 2,
      bailed: 1,
    },
    {
      firNumber: "089/2025-BEG",
      description: "Theft: Hacked luggage. Looted Bag at In Train",
      totalAccused: 3,
      bailed: 2,
    },
  ]
};

console.log("=".repeat(60));
console.log("FIR Database Seeding Instructions");
console.log("=".repeat(60));
console.log("\n");
console.log("1. Make sure MongoDB is running on localhost:27017");
console.log("2. Run: npm install mongoose");
console.log("3. Run: node seedMockData.js");
console.log("\n");
console.log("Or alternatively:");
console.log("=".repeat(60));
console.log("\n");
console.log("To manually insert data using MongoDB client:");
console.log("\n");
console.log("use railway_fir");
console.log("\n");
console.log("// Insert Districts");
console.log("db.districts.insertMany([");

mockData.districts.forEach((d, i) => {
  console.log(`  { name: "${d}", region: "Bihar", totalThanas: 5 }${i < mockData.districts.length - 1 ? ',' : ''}`);
});

console.log("]);");
console.log("\n");
console.log("// Check sample FIRs");
console.log("db.firs.count() // Shows number of FIRs");
console.log("\n");
console.log("=".repeat(60));
console.log("\nOr run from Node REPL:");
console.log("node -e \"require('./seedMockData.js')\"");
console.log("\n");
