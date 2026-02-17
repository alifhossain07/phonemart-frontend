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
    const backendUrl = `${baseUrl}/api/v2/shipping-config`;
    
    console.log("Fetching shipping config from:", backendUrl);

    const response = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Express backend error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: result.result || false,
      data: result.data || null,
    });

  } catch (error) {
    console.error("Shipping config API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load shipping config" },
      { status: 500 }
    );
  }
}

