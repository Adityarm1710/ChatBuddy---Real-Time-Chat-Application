import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/Auth.Controller.js';
import { protectRoute } from '../middlewares/Auth.Middleware.js';

const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check-Auth",protectRoute,checkAuth);

export default router;