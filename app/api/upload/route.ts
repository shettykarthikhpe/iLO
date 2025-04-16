import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // Get file data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create /uploads folder if it doesn't exist
    const uploadDir = path.join(process.cwd(), "uploads");
    mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) console.error("Error creating uploads directory:", err);
    });

    // Convert File to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Save the file to /uploads
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, fileBuffer);

    const resp = await axios.post("http://127.0.0.1:8000/upload",{
        filename:file.name
    })
    
    return NextResponse.json({
      message: "File uploaded successfully",
      path: filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
