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
    const { name, phone, password, confirm_password } = body;

    if (!name || !phone || !password || !confirm_password) {
      return NextResponse.json(
        { 
          result: false, 
          message: "Name, mobile number, password, and confirm password are required" 
        },
        { status: 400 }
      );
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { 
          result: false, 
          message: "Password and confirm password do not match" 
        },
        { status: 400 }
      );
    }

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const backendUrl = `${baseUrl}/api/v2/auth/register`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, phone, password, confirm_password }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          result: false, 
          message: result.message || "Registration failed" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { result: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}

