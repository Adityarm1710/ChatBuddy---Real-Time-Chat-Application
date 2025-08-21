import jwt from 'jsonwebtoken';

const generate_jwt_token = (userId,res)=>{

    //Generating the Token
    const token = jwt.sign({userId},process.env.JWT_SECRET_KEY,{expiresIn: "7d"});//Why? object as parameter

    //Sending cookie to user browser
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=='development'
    });

    return token; //Why this returning when returned thing is not using
};

export default generate_jwt_token;