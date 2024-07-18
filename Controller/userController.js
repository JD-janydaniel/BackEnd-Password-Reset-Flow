import User from "../Models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { mail } from "../Services/Nodemailer.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();

    res
      .status(200)
      .json({ message: "User Registered Successfully", result: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Registration Failed Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetail = await User.findOne({ email });
    if (!userDetail) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcryptjs.compare(password, userDetail.password);
    if (!passwordMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }
    //jwt part token created after signin
    const token = jwt.sign(
      { _id: userDetail._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1hr" }
    );
    // userDetail.token = token;
    // await userDetail.save();
    res
      .status(200)
      .json({ message: "User Logged In Successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).json({ message: "Authorized user", result: [user] });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error Failed to Fetch the user" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    //jwt part token created after signin
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1hr",
    });
    const passwordReset = `https://enchanting-bonbon-6a6623.netlify.app/resetpassword/${user.id}/${token}`;
    const mailLink = await mail(user.email, "Reset Password", passwordReset);
    if (mailLink) {
      return res.status(200).json({
        message: "Password reset link send to the provided Email",
        token: token,
      });
    } else {
      throw new Error("Failed to sent Reset Link");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error Forgot Password" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.status(404).json({ message: "Password Doesn't Match" });
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "password updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error Reset Password" });
  }
};
