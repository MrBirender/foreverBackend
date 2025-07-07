import { User } from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// create token using jwt:
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECERET);
};

// user Login:
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if user exists or not:
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // matching the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Wrong password!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user registration
const registerUser = async (req, res) => {
  try {
    // destructuring data from req.body:
    const { name, email, password } = req.body;

    // checking if the user exists:
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists." });
    }

    // validating email and strong password:
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please provide a valid email.",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password.",
      });
    }

    // hashing the user password:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating new user:
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // token generation for user login
    const token = createToken(user._id);

    // sending response that user has logged in:
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECERET);
      res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
