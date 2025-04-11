import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Sut from "@/app/models/Sut";

export async function POST(req: NextRequest) {
    await dbConnect();

  if(req.method !== "POST"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }

  try {
    const body = await req.json();
    const userId = body.userId

    const exisIp = await Sut.findOne({userId: userId});

    if(!exisIp){
      return NextResponse.json({ success: true, data: "No SUT's found"});
    }
  
    return NextResponse.json({ success: true, data: exisIp});
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
