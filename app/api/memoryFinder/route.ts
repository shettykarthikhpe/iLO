import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if(req.method !== "POST"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }

  try {
    const body = await req.json();
    const partNumber = body.partNumber;
    const userId = body.userId;

    const resp = await axios.post("http://127.0.0.1:8000/local",{
        partNumber:partNumber,
        userId:userId
      });
    // console.log(resp)
    return NextResponse.json({ success: true, data:resp.data });
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
