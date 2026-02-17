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
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "20";
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const sortKey = searchParams.get("sort_key");
    const colors = searchParams.get("colors");
    const choiceOptions = searchParams.get("choice_options");

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("per_page", perPage);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    if (sortKey) params.set("sort_key", sortKey);
    if (colors) params.set("colors", colors);
    if (choiceOptions) params.set("choice_options", choiceOptions);

    // Use search endpoint with empty name to get all products
    const backendUrl = `${baseUrl}/api/v2/products/search?${params.toString()}`;

    const res = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Failed to fetch products" }));
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.message || "Failed to fetch products" 
        },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json({
      success: true,
      data: json?.data ?? [],
      meta: json?.meta ?? {},
    });

  } catch (error) {
    console.error("All products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

