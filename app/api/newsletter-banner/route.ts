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
    const backendUrl = `${baseUrl}/api/v2/home-bottom-banner`;
    console.log("Fetching newsletter banner from:", backendUrl);

    const newsletterBannerRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!newsletterBannerRes.ok) {
      console.error("Express backend error:", newsletterBannerRes.status, newsletterBannerRes.statusText);
      const errorText = await newsletterBannerRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${newsletterBannerRes.status}` },
        { status: newsletterBannerRes.status }
      );
    }

    const newsletterBannerJson = await newsletterBannerRes.json();

    // Backend now returns a single object or null (not an array)
    const bannerData = newsletterBannerJson?.data || null;

    return NextResponse.json({
      success: true,
      data: bannerData,
    });

  } catch (error) {
    console.error("Newsletter banner API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load newsletter banner" },
      { status: 500 }
    );
  }
}

