import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import dbConnect from '../../lib/mongodb';

export async function POST(req: NextRequest) {
  if(req.method !== "POST"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }
  

  try {
    await dbConnect();
    return NextResponse.json({ success: true, data:"conn"});
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
