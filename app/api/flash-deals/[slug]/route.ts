import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params;
    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/flash-deals/${slug}`;
    console.log("Fetching flash deal from:", backendUrl);

    const flashDealRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!flashDealRes.ok) {
      if (flashDealRes.status === 404) {
        return NextResponse.json(
          { success: false, error: "Flash deal not found" },
          { status: 404 }
        );
      }
      console.error("Express backend error:", flashDealRes.status, flashDealRes.statusText);
      const errorText = await flashDealRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${flashDealRes.status}` },
        { status: flashDealRes.status }
      );
    }

    const flashDealJson = await flashDealRes.json();

    return NextResponse.json({
      success: true,
      data: flashDealJson?.data ?? null,
    });

  } catch (error) {
    console.error("Flash deal API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load flash deal" },
      { status: 500 }
    );
  }
}

