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
    const backendUrl = `${baseUrl}/api/v2/products/${slug}`;
    
    console.log("Fetching product from:", backendUrl);

    const res = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }
      console.error("Express backend error:", res.status, res.statusText);
      const errorText = await res.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${res.status}` },
        { status: res.status }
      );
    }

    const json = await res.json();

    // Backend returns data as an array, but we need a single object
    const productData = Array.isArray(json?.data) ? json.data[0] : json?.data;

    return NextResponse.json({
      success: true,
      data: productData || null,
    });

  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load product" },
      { status: 500 }
    );
  }
}

