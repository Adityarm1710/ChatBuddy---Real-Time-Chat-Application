import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const App = express();
const server = http.createServer(App);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId){
    return onlineUsersData[userId];
};

const onlineUsersData = {};

io.on("connection", (socket) => {
  console.log("User is connected", socket.id);
  const userId = socket.handshake.query.userId;
  if(userId) onlineUsersData[userId] = socket.id;
  io.emit("onlineUsersData",Object.keys(onlineUsersData));
  socket.on("disconnect", () => {
    console.log("User is disconnected.", socket.id);
    delete(onlineUsersData[userId]);
    io.emit("onlineUsersData",Object.keys(onlineUsersData));
  });
});

export { server, App, io };
