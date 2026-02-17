import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(request: Request) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Server configuration error" 
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = searchParams.get("limit") || "10";

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/search/suggestions?q=${encodeURIComponent(q)}&limit=${limit}`;

    const res = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Failed to get suggestions" }));
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.message || "Failed to get suggestions" 
        },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json({
      success: true,
      data: json?.data ?? [],
    });

  } catch (error) {
    console.error("Search suggestions API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}

