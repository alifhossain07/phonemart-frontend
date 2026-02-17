import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(request: Request) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { 
          result: false, 
          message: "Server configuration error" 
        },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { result: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/user/orders?page=${page}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          result: false, 
          message: result.message || "Failed to get orders" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get orders API error:", error);
    return NextResponse.json(
      { result: false, message: "Failed to get orders" },
      { status: 500 }
    );
  }
}

