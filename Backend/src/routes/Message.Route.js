import express from 'express';
import { protectRoute } from "../middlewares/Auth.Middleware.js";
import { getAllMessages, getSidebarUsers, sendMessages } from "../controllers/Message.Controller.js";


const router = express.Router();

router.get('/userslist',protectRoute,getSidebarUsers);
router.get('/getMessages/:id',protectRoute,getAllMessages);
router.post('/sendMessage/:id',protectRoute,sendMessages);

export default router;