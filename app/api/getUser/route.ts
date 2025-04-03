import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "../../models/User";
import dbConnect from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
    await dbConnect();

  if(req.method !== "POST"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }

  try {
    const body = await req.json();
    const token = body.token;
    console.log(body)
    const user = await User.findOne({userId:token})
    return NextResponse.json({ success: true, data: user});
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
