import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;

export async function POST(request: Request) {
  try {
    if (!API_BASE) {
      return NextResponse.json(
        { 
          result: false, 
          message: "Server configuration error - Missing API_BASE" 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { 
          result: false, 
          message: "Mobile number and password are required" 
        },
        { status: 400 }
      );
    }

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/auth/login`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ phone, password }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          result: false, 
          message: result.message || "Login failed" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { result: false, message: "Login failed" },
      { status: 500 }
    );
  }
}

