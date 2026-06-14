"use server";
import { NextResponse } from "next/server";
import mongoosedb from "@/app/lib/db";
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
import user from "@/app/lib/models/user";

export const DELETE = async (req) => {
  try {
    await mongoosedb();
    const body = await req.json()
    const userId = req.headers.get("user_id");
    const itemId =  body.item_id;

    const userData = await user.findById(userId);

    if (!userData) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const itemIndex = userData.wishlist.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Item not found in wishlist" }),
        { status: 404 }
      );
    }

    userData.wishlist.splice(itemIndex, 1);

    await userData.save();
    return new NextResponse(JSON.stringify({results:{ success: true }}), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
};
