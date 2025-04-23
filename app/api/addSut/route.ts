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
    const ip = body.ip;
    const username = body.username;
    const password = body.password;
    const userId = body.userId;

    const exisIp = await Sut.findOne({userId: userId});
 
    if(exisIp){
       if(!exisIp.sut.includes(ip)){
        exisIp.sut.push({ip:ip, username:username, password:password});
        const response = exisIp.save();
        return NextResponse.json({ success: true, data: response});
       }else{
        return NextResponse.json({ success: true, data: "Already ip exist"});
       }
    }

    const newIp = new Sut({
        userId: userId,
        sut:{ip:ip, username:username, password:password}
    });
    const resp = await newIp.save();

    return NextResponse.json({ success: true, data: resp});
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
