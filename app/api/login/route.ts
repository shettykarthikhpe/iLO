import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "../../models/User";



export async function POST(req: NextRequest) {
  if(req.method !== "POST"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }

  try {
    const body = await req.json();
    const url = body.body.url;
    const user_name = body.body.username;
    const password = body.body.password;
    const uid = Math.random().toString(36).substring(2, 10+2)

    const resp = await axios.post("http://127.0.0.1:8000/login",{
        url: url,
        username: user_name,
        password: password
      });
      
      const user = new User({
        userId: uid,
        name: "shetty",
        ip:url,
        username: user_name,
        password: password
      })

      await user.save()
    return NextResponse.json({ success: true, data: resp.data, token:uid});
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
