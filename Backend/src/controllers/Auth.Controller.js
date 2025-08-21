import User from "../models/user.model.js";
import generate_jwt_token from "../lib/Utils.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../lib/Cloudinary.js";

export const signup = async (req, res) => {
  const { email, fullname, password } = req.body;
  try {
    //All Fields are required Check
    if (!email || !fullname || !password)
      return res.status(404).json({ Message: "All Fields are Required." });

    //Password Check
    if (password.length < 6)
      return res
        .status(400)
        .json({ Message: "Password Must be having 6 characters" });

    //Old User Check
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ Message: "User already exist, Please Login." });

    //Salt for hasing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //New user creation
    const newUser = new User({
      email: email,
      fullname: fullname,
      password: hashedPassword,
    });

    if (newUser) {
      //Token Formation and cookie update
      generate_jwt_token(newUser._id, res); //Is it value or an object

      await newUser.save();

      return res.status(201).json({
        Message: "User has been created.",
        // _id: newUser._id,
        // fullname: newUser.fullname,
        // email: newUser.email,
        // profilepic: newUser.profilepic,
        data:newUser,
      });
    } else {
      res.status(400).json({ Message: "Invalid Signup Details." });
    }
  } catch (err) {
    console.log("Something went wrong in Signing User.", err.message);
    res.status(500).json({ Message: "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Existing User Check
    if (!email || !password)
      return res.status(400).json({ Message: "All Fields are Required." });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ Message: "Invalid Credentials" });

    //Password Check
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ Message: "Invalid Credentials." });

    //Genrating Login Token
    generate_jwt_token(existingUser._id, res);

    return res.status(201).json({
      Message: "User Successfully Loggedin.",
      // _id: existingUser._id,
      // fullname: existingUser.fullname,
      // email: existingUser.email,
      // profilepic: existingUser.profilepic,
      data: existingUser,
    });
  } catch (err) {
    console.log("Something went wrong in Login User.", err.message);
    res.status(500).json({ Message: "Internal Server Error." });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(201).json({ Message: "User Successfully Logged out." });
  } catch (err) {
    console.log("Something went wrong in Logout.", err.message);
    res.status(500).json({ Message: "Internal Server Error." });
  }
};

export const updateProfile = async (req, res) => {
  const { profilepic } = req.body;
  try {
    if (!profilepic)
      return res.status(400).json({ Message: "Profile Picture Required." });
    const userId = req.user._id;
    const uploadImage = await cloudinary.uploader.upload(profilepic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadImage.secure_url },
      { new: true }
    ); 

    return res.status(201).json({
      Message: "Profile Picture Successfully Updated.",
      data: updatedUser,
    });
  } catch (err) {
    console.log("Something went wrong in Update Profile Section.", err.message);
    res.status(500).json({ Message: "Internal Server Error." });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(201).json({ 
      Message: "User is Authenticated.",
      data: req.user,
    });
  } catch (err) {
    console.log("Something went wrong in checkAuth Controller.", err.message);
    res.status(500).json({ Message: "Internal Server Error." });
  }
};
