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
    const backendUrl = `${baseUrl}/api/v2/business-settings`;
    console.log("Fetching business settings from:", backendUrl);

    const settingsRes = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!settingsRes.ok) {
      console.error("Express backend error:", settingsRes.status, settingsRes.statusText);
      const errorText = await settingsRes.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${settingsRes.status}` },
        { status: settingsRes.status }
      );
    }

    const settingsJson = await settingsRes.json();

    // Convert array format to object format for easier frontend usage
    const settingsObj: Record<string, unknown> = {};
    if (settingsJson?.data && Array.isArray(settingsJson.data)) {
      settingsJson.data.forEach((setting: { type: string; value: unknown }) => {
        settingsObj[setting.type] = setting.value;
      });
    }

    return NextResponse.json({
      success: true,
      data: settingsObj,
    });

  } catch (error) {
    console.error("Business settings API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load business settings" },
      { status: 500 }
    );
  }
}

