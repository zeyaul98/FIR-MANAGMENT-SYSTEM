const User = require("../models/User");

let jwt;
try {
  jwt = require("jsonwebtoken");
} catch (err) {
  console.error("jsonwebtoken module not installed!");
  jwt = null;
}

// LOGIN USER

const loginUser = async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // FIND USER

    const user = await User.findOne({ username });

    // CHECK USER

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // VERIFY PASSWORD

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // GENERATE JWT TOKEN

    if (!jwt) {
      return res.status(500).json({
        success: false,
        message: "JWT module not installed - run: npm install jsonwebtoken",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    // SUCCESS

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  loginUser,
};