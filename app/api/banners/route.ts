import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Remove trailing slash from API_BASE if present, then construct URL
    const baseUrl = API_BASE.replace(/\/+$/, '');
    let backendUrl = `${baseUrl}/api/v2/banners`;
    if (type) {
      backendUrl += `?type=${encodeURIComponent(type)}`;
    }

    const bannersRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!bannersRes.ok) {
      console.error("Express backend error:", bannersRes.status, bannersRes.statusText);
      const errorText = await bannersRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${bannersRes.status}` },
        { status: bannersRes.status }
      );
    }

    const bannersJson = await bannersRes.json();

    return NextResponse.json({
      success: true,
      data: bannersJson?.data ?? [],
    });

  } catch (error) {
    console.error("Banners API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load banners" },
      { status: 500 }
    );
  }
}

