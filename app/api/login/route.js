"use server"
const JWT = require("jsonwebtoken");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
import { NextResponse } from "next/server";
import mongoosedb from "@/app/lib/db";
import user from "@/app/lib/models/user";
import { cookies } from "next/headers";
const yup = require('yup')
const bcrypt = require('bcrypt');

const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required').min(4, 'Password must be at least 8 characters'),
  });

export const POST = async(req)=>{
    try{
        const dataReq = await req.json()
        await mongoosedb()
        await loginSchema.validate(dataReq)
        const emailinfo = dataReq.email.toUpperCase()
        const info = await user.findOne({ email: emailinfo });
        if (info == null) {
          return new NextResponse(JSON.stringify({success:false, message:'Email not found'}))
        }
        const result = await bcrypt.compare(dataReq.password, info.password);
        if (result) {
            const id = info._id;
            const token = JWT.sign({ id }, process.env.DB_JWTS);
        (await cookies()).set('accessToken', token,{
            httpOnly: true,
            maxAge: 60 * 30 * 24 * 60 * 60,
            sameSite: "strict"
        })
        const userdata = {
            user_name: info.user_name,
            _id: info._id,
            ban: info.ban,
          };
          return new NextResponse(JSON.stringify({success:true, data:userdata, token:token}))
        }
        else{
            return new NextResponse(JSON.stringify({success:false, message:'Password Wrong'}))
        }
    }
    catch(err){
        console.log(err)
        return new NextResponse(JSON.stringify({success:false, message: "An error occurred during login" }))
    }
}