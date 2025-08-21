import cloudinary from "../lib/Cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getSidebarUsers = async (req, res) => {
  try {
    const currrentUserId = req.user._id;
    const otherUsersList = await User.find({
      _id: { $ne: currrentUserId },
    }).select("-password");
    return res.status(200).json({
      Message: "Other Loggedin Users List Fetching done.",
      data: otherUsersList,
    });
  } catch (err) {
    console.log(
      "Something went wrong in SidebarUsers Controller.",
      err.message
    );
    return res.status(505).json({ Message: "Internal Server Error." });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const currrentUserId = req.user._id;
    const { id: otherSideUserId } = req.params; //Dynamic Routing
    const Messages = await Message.find({
      $or: [
        { SenderId: currrentUserId, RecieverId: otherSideUserId },
        { SenderId: otherSideUserId, RecieverId: currrentUserId },
      ],
    });

    return res.status(200).json({
      Message: "Messages Successfully Fetched.",
      data:Messages,
    });
  } catch (err) {
    console.log(
      "Something went wrong in getMessages Controller.",
      err.message
    );
    return res.status(505).json({ Message: "Internal Server Error." });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { Text, Image } = req.body;
    const currrentUserId = req.user._id;
    const { id: otherSideUserId } = req.params;

    let ImageUrl;
    if (Image) {
      const imageuplaod = await cloudinary.uploader.upload(Image);
      ImageUrl = imageuplaod.secure_url;
    }

    const newMessage = new Message({
      SenderId: currrentUserId,
      RecieverId: otherSideUserId,
      Text: Text,
      Image: ImageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(otherSideUserId);
    if(receiverSocketId){io.to(receiverSocketId).emit("newMessage",newMessage);}

    return res.status(201).json({
      Message: "New Message Created.",
      newMessage,
    });
  } catch (err) {
    console.log(
      "Something went wrong in SidebarUsers Controller.",
      err.message
    );
    return res.status(505).json({ Message: "Internal Server Error." });
  }
};
