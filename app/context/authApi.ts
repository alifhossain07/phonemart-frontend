export interface User {
  id: string;
  _id?: string | { toString(): string };
  name: string;
  email: string | null;
  phone: string;
  role?: string;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  result: boolean;
  message: string;
  access_token: string;
  token_type: string;
  expires_at: string | null;
  user: User;
}

export interface LogoutResponse {
  result: boolean;
  message: string;
}

export interface UserInfoResponse {
  result?: boolean;
  message?: string;
  data?: User;
}

export async function signup(payload: {
  name: string;
  phone: string;
  password: string;
  confirm_password: string;
}): Promise<AuthResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      password: payload.password,
      confirm_password: payload.confirm_password,
    }),
  });

  const result = await response.json();
  
  if (!response.ok || !result.result) {
    throw new Error(result.message || "Signup failed");
  }

  return result;
}

export async function login(payload: {
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: payload.phone,
      password: payload.password,
    }),
  });

  const result = await response.json();
  
  if (!response.ok || !result.result) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}

/**
 * Fetches user profile information using Bearer token authentication
 * @param access_token - The Bearer token for authentication
 * @returns User information response
 */
export async function fetchProfile(access_token: string): Promise<User> {
  const response = await fetch("/api/auth/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const result = await response.json();
  
  if (!response.ok || !result.result) {
    throw new Error(result.message || "Failed to fetch profile");
  }

  return result.data;
}

/**
 * Logs out the user by invalidating the Bearer token on the server
 * @param access_token - The Bearer token to invalidate
 * @returns Logout response
 */
export async function logout(access_token: string): Promise<LogoutResponse> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    // If logout API fails, still return success for local logout
    console.error("Logout error:", error);
    return { result: true, message: "Logged out locally" };
  }
}