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
          error: "Server configuration error - Missing API_BASE or SYSTEM_KEY" 
        },
        { status: 500 }
      );
    }

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/flash-deals`;
    console.log("Fetching flash deals from:", backendUrl);

    const flashDealsRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!flashDealsRes.ok) {
      console.error("Express backend error:", flashDealsRes.status, flashDealsRes.statusText);
      const errorText = await flashDealsRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${flashDealsRes.status}` },
        { status: flashDealsRes.status }
      );
    }

    const flashDealsJson = await flashDealsRes.json();

    return NextResponse.json({
      success: true,
      data: flashDealsJson?.data ?? [],
    });

  } catch (error) {
    console.error("Flash deals API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load flash deals" },
      { status: 500 }
    );
  }
}

