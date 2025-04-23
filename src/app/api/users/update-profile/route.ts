import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";

// Use PUT for updating existing resources
export async function PUT(req: NextRequest) {
    try {
      const body = await req.json();
      const { email, userName, fullName, profilePicture } = body;
  
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }
  
      await dbConnect();
  
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          ...(userName && { userName }),
          ...(fullName && { fullName }),
          ...(profilePicture && { profilePicture }),
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
