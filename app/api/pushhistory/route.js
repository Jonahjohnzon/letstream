"use server"
import { NextResponse } from "next/server";
import mongoosedb from "@/app/lib/db";
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
import user from "@/app/lib/models/user";

    export const PUT = async (req) => {
        try {
            await mongoosedb();
            
            const userId = req.headers.get('user_id');
            const newItem = await req.json();
            
            const userData = await user.findById(userId);
    
            if (!userData) {
                return new NextResponse(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
            }
            userData.history = userData.history.filter(item => item.id != newItem.id);
            userData.history.unshift(newItem);
    
            if (userData.history.length > 60) {
                userData.history = userData.history.slice(0, 60);
            }
    
            await userData.save();
    
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        } catch (err) {
            console.error(err);
            return new NextResponse(JSON.stringify({ success: false, error: err.message }), { status: 500 });
        }
    };
    