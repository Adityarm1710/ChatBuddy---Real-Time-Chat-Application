import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/Auth.Route.js";
import messageRoutes from "./routes/Message.Route.js";
import dotenv from "dotenv";
import { connect_DB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {App,server,io} from "./lib/socket.js";
import path from "path";

//const App = express(); //This is normal App from express not from socket.io 
dotenv.config();

App.use(bodyParser.json({limit:"10mb"})); // for parsing application/json
App.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
App.use(cookieParser());
App.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
App.use("/Api/Auth", authRoutes);
App.use("/Api/Message", messageRoutes);

const port = process.env.PORT;

//Making frontend as a static file and place it in the backend codebase
const __dirname = path.resolve();
if(process.env.NODE_ENV=="production"){
  App.use(express.static(path.join(__dirname,"../frontend/dist")));

  App.get(/(.*)/,(req,res)=>{
      res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  });
}

server.listen(port, () => {
  console.log("Backend Server is configured at port:", port);
  connect_DB();
});
