import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/User";
import { authenticate } from "../../../../../middleware/auth";

// Use PUT for updating existing resources
export async function PUT(req: NextRequest) {
    try {
      const auth = await authenticate(req);
      if (auth instanceof NextResponse) return auth;

      const body = await req.json();
      const { userName, fullName, profilePicture } = body;
  
      await dbConnect();
  
      const updatedUser = await User.findByIdAndUpdate(
        auth._id,
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
