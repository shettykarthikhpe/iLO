import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { userId } = body;

    // Validate `userId`
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    // Make the API call
    const response = await fetch(`${process.env.BACKEND_URL}/api/track/getconnections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profiles. Status: ${response.status}`);
    }

    // Parse the response from the backend
    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching profiles:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
