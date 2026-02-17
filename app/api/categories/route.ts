import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY environment variables");
      console.error("API_BASE:", API_BASE);
      console.error("SYSTEM_KEY:", SYSTEM_KEY ? "***" : "undefined");
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
    const backendUrl = `${baseUrl}/api/v2/categories`;
    console.log("Fetching categories from:", backendUrl);

    const categoriesRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!categoriesRes.ok) {
      console.error("Express backend error:", categoriesRes.status, categoriesRes.statusText);
      const errorText = await categoriesRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${categoriesRes.status}` },
        { status: categoriesRes.status }
      );
    }

    const categoriesJson = await categoriesRes.json();

    return NextResponse.json({
      success: true,
      data: categoriesJson?.data ?? [],
    });

  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

