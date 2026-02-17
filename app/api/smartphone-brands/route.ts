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
    const backendUrl = `${baseUrl}/api/v2/smartphone-brands`;
    console.log("Fetching smartphone brands from:", backendUrl);

    const smartphoneBrandsRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!smartphoneBrandsRes.ok) {
      console.error("Express backend error:", smartphoneBrandsRes.status, smartphoneBrandsRes.statusText);
      const errorText = await smartphoneBrandsRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${smartphoneBrandsRes.status}` },
        { status: smartphoneBrandsRes.status }
      );
    }

    const smartphoneBrandsJson = await smartphoneBrandsRes.json();

    return NextResponse.json({
      success: true,
      data: smartphoneBrandsJson?.data || { title: '', subtitle: '' },
    });

  } catch (error) {
    console.error("Smartphone brands API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load smartphone brands" },
      { status: 500 }
    );
  }
}

