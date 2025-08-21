import { create } from "zustand";
import { axiosInstance } from "../Lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE==="developement" ? "http://localhost:5001/Api" : "/";

export const useAuthStore = create((set,get) => ({
  userAuth: null,
  onlineUsers : [],
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/Auth/check-Auth");
      set({ userAuth: res.data.data});
      get().connectSocket();
    } catch (err) {
      console.log(
        "Something Went Wrong in CheckAuth Function",
        err.response.data
      );
      set({ userAuth: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  Signup: async (formdata) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/Auth/signup", formdata);
      set({ userAuth: res.data.data });
      toast.success("Account created successfully.");
      get().connectSocket();
    } catch (err) {
      console.log(
        "Something went wrong in signing user Function.",
        err.response.data
      );
      toast.error("Something went wrong!!", err.res.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/Auth/login", formData);
      set({ userAuth: res.data.data });
      toast.success("Logged In Successfully.");
      get().connectSocket();
    } catch (err) {
      console.log(
        "Something went wrong in login function",
        err.response.data.message
      );
      toast.error("Something went wrong!!", err.response.data.message);
    } finally {
      set({ isLogginIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/Auth/logout");
      set({ userAuth: null });
      toast.success("Logged Out Successfully. ");
      get().disconnectSocket();
    } catch (err) {
      console.log(err.response.data);
      toast.error("Something went wrong!!", err.response.data.message);
    }
  },

  updateProfile: async(data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/Auth/update-profile", data);
      set({ userAuth: res.data.data });
      toast.success("Profile image updated successfully.");
    } catch (err) {
      console.log(
        "Something went wrong in update profile function.",
        err.response.data
      );
      toast.error("Something went wrong!!", err.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: ()=>{
    const {userAuth} = get();
    if(!userAuth || get().socket?.connected) return;
    const socket = io(BASE_URL,{
      query:{
        userId: userAuth._id,
      }
    });
    socket.connect();
    set({socket:socket});
    socket.on("onlineUsersData",(usersId)=>{
       set({onlineUsers:usersId});
    });
  },

  disconnectSocket: ()=>{
    if(get().socket?.connected){ 
      get().socket.disconnect();  
    };
  },
}));
