import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function PUT(request: Request) {
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

    const body = await request.json();

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/auth/profile`;

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          result: false, 
          message: result.message || "Failed to update profile" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update profile API error:", error);
    return NextResponse.json(
      { result: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

