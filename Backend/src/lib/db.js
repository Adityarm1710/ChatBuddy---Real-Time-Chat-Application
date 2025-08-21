import mongoose from 'mongoose';

export const connect_DB = async ()=>{
  try{
     const conn = await mongoose.connect(process.env.MONGODB_URL);
     console.log(`DATABASE is connected...ENJOY!!! ${conn.connection.host}`);
  }catch(err){
     console.log("Something went wrong in DATABASE connection:",err);
  }
};