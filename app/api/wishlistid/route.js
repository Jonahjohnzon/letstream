"use server";
import { NextResponse } from "next/server";
import mongoosedb from "@/app/lib/db";
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
import user from "@/app/lib/models/user";

export const GET = async (req) => {
  try {
    await mongoosedb();
    const userId = req.headers.get("user_id");

    const data = await user.findOne({ _id: userId });
    if (data) {
        
      const wishlistIds = data.wishlist.map((item) => item.id); 
      return new NextResponse(
        JSON.stringify({ success: true, data: wishlistIds }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
};
