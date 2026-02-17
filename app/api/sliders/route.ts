import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY environment variables");
      return NextResponse.json(
        { 
          success: false, 
          error: "Server configuration error - Missing API_BASE or SYSTEM_KEY. Please create .env.local file with API_BASE=http://localhost:5000 and SYSTEM_KEY=your-key" 
        },
        { status: 500 }
      );
    }

    // Remove trailing slash from API_BASE if present, then construct URL
    const baseUrl = API_BASE.replace(/\/+$/, ''); // Remove trailing slashes
    const backendUrl = `${baseUrl}/api/v2/sliders`;
    console.log("Fetching sliders from:", backendUrl);

    const slidersRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!slidersRes.ok) {
      console.error("Express backend error:", slidersRes.status, slidersRes.statusText);
      const errorText = await slidersRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${slidersRes.status}` },
        { status: slidersRes.status }
      );
    }

    const slidersJson = await slidersRes.json();

    return NextResponse.json({
      success: true,
      data: slidersJson?.data ?? [],
    });

  } catch (error) {
    console.error("Sliders API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load sliders" },
      { status: 500 }
    );
  }
}

