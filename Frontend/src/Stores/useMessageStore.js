import {create} from "zustand";
import {toast} from "react-hot-toast";
import { axiosInstance } from "../Lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set,get)=>({
    messages: [],
    sidbarUsers :[],
    selectedUser: null,
    isSidebarUsersLoading: false,
    isMessagesLoading: false,

    getSidebarUsers: async ()=>{
      set({isSidebarUsersLoading: true});
      try{
         const res = await axiosInstance.get("/Message/userslist");
         set({sidebarUsers: res.data.data});
      }catch(err){
        console.log("Something went wrong in getsidebarusers functon.",err.response.data);
        toast.error("Something went wronng!!",err.response.data.messages);
      }finally{
        set({isSidebarUsersLoading: false});
      }
    },

    getMessages: async(userId)=>{
      set({isMessagesLoading: true});
      try{
        const res = await axiosInstance.get(`/Message/getMessages/${userId}`);
        set({messages: res.data.data});
      }catch(err){
        console.log("Something went wrong in getmessages function.",err.response.data);
        toast.error("Something went wrong!!",err.response.data.message);
      }finally{
        set({isMessagesLoading: false});
      }
    },

    sendMessages: async(messageData)=>{
       const {messages,selectedUser} = get();
       try{
         const res = await axiosInstance.post(`/Message/sendMessage/${selectedUser._id}`,messageData);
         set({messages:[...messages,res.data.data]});
       }catch(err){
         console.log("Something went wrong in Send Messages Function.",err.response.data);
         toast.error("Something went wrong",err.response.data.message);
       }
    },

    subscribeToMessages: ()=>{
       const {messages,selectedUser} = get();
       if(!selectedUser) return;
       const socket = useAuthStore.getState().socket;

       socket.on("newMessage",(newMessage) =>{
        if(newMessage.SenderId!==selectedUser._id) return;
        set({messages: [...messages,newMessage]});
       }) 
    },

    unsubscribeToMessage: ()=>{
       const socket = useAuthStore.getState().socket;
       socket.off("newMessage");
    },

    //Need updation
    setSelectedUser: (selectedUser)=> set({selectedUser}),
}));