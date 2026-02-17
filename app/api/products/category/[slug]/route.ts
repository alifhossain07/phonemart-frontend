import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
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
    const colors = searchParams.get("colors");
    const choiceOptions = searchParams.get("choice_options");

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const queryParams = new URLSearchParams();
    queryParams.set("page", page);
    queryParams.set("per_page", perPage);
    if (colors) queryParams.set("colors", colors);
    if (choiceOptions) queryParams.set("choice_options", choiceOptions);

    const backendUrl = `${baseUrl}/api/v2/products/category/${params.slug}?${queryParams.toString()}`;

    const res = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Failed to fetch category products" }));
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.message || "Failed to fetch category products" 
        },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json({
      success: true,
      data: json?.data ?? [],
      meta: json?.meta ?? {},
      subtitle: json?.subtitle || "",
    });

  } catch (error) {
    console.error("Category products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load category products" },
      { status: 500 }
    );
  }
}

