import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req,res,next) => {
    try{
       const token = req.cookies.jwt;
      
       //Available Token Check
       if(!token) return res.status(401).json({Message: "Unauthorized - Token Not Found."});

       //Token Verification
       const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
       if(!decodedToken) return res.status.json({Message: "Unauthorized - Invalid Token"});
       const authorizedUser = await User.findById(decodedToken.userId); 

       if(!authorizedUser) return res.status(404).json({Message: "User Not Found."});

       req.user = authorizedUser;
       
       next();

    }catch(err){
      console.log("Something went wrong in protectRoute Middleware.", err.message);
    res.status(500).json({ Message: "Internal Server Error." });
    }
};