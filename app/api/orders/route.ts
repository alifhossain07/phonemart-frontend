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
    
    // Get auth token from Authorization header if present (optional for guest checkout)
    const authHeader = request.headers.get("authorization");
    
    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/order/checkout`;
    
    console.log("Creating order at:", backendUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
    };
    
    // Include Authorization header if token is present (for logged-in users)
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Express backend error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { 
            success: false, 
            error: errorJson.message || `Backend error: ${response.status}` 
          },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { success: false, error: `Backend error: ${response.status}` },
          { status: response.status }
        );
      }
    }

    const result = await response.json();

    return NextResponse.json({
      success: result.result || false,
      message: result.message || "Order placed successfully",
      data: result.data || null,
    });

  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    );
  }
}

