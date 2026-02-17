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
    
    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/stripe/create-payment-intent`;
    
    console.log("Creating payment intent at:", backendUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
    };

    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Stripe backend error:", response.status, response.statusText);
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
      client_secret: result.client_secret,
      payment_intent_id: result.payment_intent_id,
    });

  } catch (error) {
    console.error("Stripe payment intent API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
