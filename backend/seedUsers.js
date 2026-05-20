const mongoose = require("mongoose");

const User = require("./models/User");

require("dotenv").config();


const seedUsers = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("✓ Connected to MongoDB");


    await User.deleteMany({});

    console.log("✓ Cleared existing users");


    const users = [
      {
        name: "Admin User",
        username: "admin",
        password: "password",
        role: "admin",
      },
      {
        name: "Officer User",
        username: "officer",
        password: "password",
        role: "officer",
      },
    ];


    // SAVE USERS ONE BY ONE

    for (const user of users) {

      const newUser = new User(user);

      await newUser.save();

    }


    console.log("✅ Users Created");


    mongoose.connection.close();

  } catch (error) {

    console.log(error.message);

  }

};


seedUsers();