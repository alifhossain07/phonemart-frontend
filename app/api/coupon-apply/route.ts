import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function POST(request: Request) {
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

    const body = await request.json();
    const { code, amount } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Coupon code is required" },
        { status: 400 }
      );
    }
    
    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/coupon-apply`;
    
    console.log("Applying coupon at:", backendUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
    };

    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ code, amount }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Coupon apply error:", response.status, result);
      return NextResponse.json(
        { 
          success: false, 
          error: result.message || `Backend error: ${response.status}`,
          message: result.message || `Backend error: ${response.status}`
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: result.result || result.success || false,
      message: result.message,
      data: result.data || null,
    });

  } catch (error) {
    console.error("Coupon apply API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to apply coupon" },
      { status: 500 }
    );
  }
}
