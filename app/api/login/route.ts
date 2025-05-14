import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "../../models/User";
import mongoose from "mongoose";



export async function POST(req: NextRequest) {
  if(req.method !== "POST"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }

  try {
    const body = await req.json();
    const url = body.body.url;
    const user_name = body.body.username;
    const password = body.body.password;
    const name = body.body.name;
    const uid = Math.random().toString(36).substring(2, 10+2)

    const resp = await axios.post("http://127.0.0.1:8000/login",{
        url: url,
        username: user_name,
        password: password
      });

      mongoose.connect(
        "mongodb+srv://abhishekdrai85:Abhishek29@cluster0.4kjtl.mongodb.net/hp?retryWrites=true&w=majority&appName=Cluster0");
      

      const exisitingUser = await User.findOne({name:name});
      
      if(exisitingUser){
        return NextResponse.json({ success: true, data: exisitingUser, userId:exisitingUser.userId});
      }

      const user = new User({
        userId: uid,
        name: name,
        ip: url,
        username: user_name,
        password: password
      })

      await user.save()
    return NextResponse.json({ success: true, data: resp.data, userId:uid});
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
