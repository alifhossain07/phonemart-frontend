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
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, error: "Payment intent ID is required" },
        { status: 400 }
      );
    }
    
    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/stripe/verify-payment/${paymentIntentId}`;
    
    console.log("Verifying payment at:", backendUrl);

    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
    };

    const response = await fetch(backendUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Stripe verify payment error:", response.status, response.statusText);
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
      payment_status: result.payment_status,
      payment_intent: result.payment_intent,
    });

  } catch (error) {
    console.error("Stripe verify payment API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
