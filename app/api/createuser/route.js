"use server"
import { NextResponse } from "next/server";
import mongoosedb from "@/app/lib/db";
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
import user from "@/app/lib/models/user";
const yup = require('yup')
const bcrypt = require('bcrypt');



const registrationSchema = yup.object().shape({
    user_name: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters').max(15, 'Username must be at most 20 characters'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required').min(4, 'Password must be at least 8 characters'),
  });

export const POST = async(req)=>{
    try{
      const dataReq = await req.json()
        await mongoosedb()
        await registrationSchema.validate(dataReq);
        const pass = dataReq.password;
        const salt =  await bcrypt.genSalt(10);
        const hash =  await bcrypt.hash(pass, salt);
        const email = dataReq.email.toUpperCase();
        const useraccount = await user.find({ email: email });
        const username = await user.find({ user_name: dataReq.user_name });
          if (useraccount.length > 0) {
            return new NextResponse(JSON.stringify({success: false, message: "Email Already Exist" }));
          }
        
          if (username.length > 0) {
            return new NextResponse(JSON.stringify({ success: false, message: "Username Already Exist" }));
          }
        
          
            const data = await user.create({
              user_name: dataReq.user_name,
              email: email,
              password: hash,
              suspend: false,
              ban: false,
            });
        
            await data.save();
            return new NextResponse(JSON.stringify({message:"Account created", success:true}))

    }
    catch(error)
    {
      
      console.log(error)
      return new NextResponse(JSON.stringify({message:"Error", success:false}))

    }
}