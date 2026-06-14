"use server"
import { NextResponse } from "next/server";
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
import mongoosedb from "@/app/lib/db";
import user from "@/app/lib/models/user";

export const GET = async (req) => {
    try {
      await mongoosedb();
  
      const userId = req.headers.get('user_id');
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page'), 10) || 1; // Default to page 1 if not provided
  
      if (!userId) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'User ID is missing' }),
          { status: 400 }
        );
      }
  
      const userData = await user.findOne({ _id: userId });
  
      if (!userData) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'User not found' }),
          { status: 404 }
        );
      }
  
      const itemsPerPage = 20;
      const wishlist = userData.wishlist || [];
      const totalItems = wishlist.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
  
      if (page < 1 || page > totalPages) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'Invalid page number' }),
          { status: 400 }
        );
      }
  
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedWishlist = wishlist.slice(startIndex, startIndex + itemsPerPage);
  
      return new NextResponse(
        JSON.stringify({
          success: true,
          data: paginatedWishlist,
          totalPages,
          currentPage: page,
        }),
        { status: 200 }
      );
    } catch (err) {
      console.error(err);
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Server error' }),
        { status: 500 }
      );
    }
  };
  