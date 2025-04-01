import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
 
export async function POST(req: NextRequest) {
  if(req.method !== "POST"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }
 
  try {
    const url = "10.132.147.215"
    const user_name = "Administrator";
    const password = "GXJYN722";
 
    const resp = await axios.post("http://127.0.0.1:8000/test",{
        url:url,
        username:user_name,
        password:password
      });
    console.log(resp)
    return NextResponse.json({ success: true, data:resp.data });
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}