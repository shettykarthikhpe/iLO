import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  if(req.method !== "GET"){
    return NextResponse.json({ success: false, message: "Not allowed" });
  }

  try {
    const url = "http://127.0.0.1:5000/api/table"
    const user_name = "Administrator";
    const password = "GXJYN722";

    const response = await fetch(url, { method:'GET' });

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error("Error", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
