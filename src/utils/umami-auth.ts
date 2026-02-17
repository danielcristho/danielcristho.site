// Shared authentication utility for Umami API
let authToken: string | null = null;
let tokenExpiry: number = 0;

export async function getUmamiAuthToken(): Promise<string | null> {
  // Check if there is a valid cached token
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  try {
    const umamiApiUrl = import.meta.env.PUBLIC_UMAMI_URL;
    const username = import.meta.env.UMAMI_USERNAME;
    const password = import.meta.env.UMAMI_PASSWORD;

    if (!umamiApiUrl || !username || !password) {
      console.error("Missing Umami credentials in environment variables");
      return null;
    }

    // Remove trailing slash and /login if present
    const baseUrl = umamiApiUrl.replace(/\/(login)?$/, "");

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to authenticate with Umami:",
        response.status,
        errorText,
      );
      return null;
    }

    const data = await response.json();

    if (!data.token) {
      console.error("No token received from Umami API");
      return null;
    }

    authToken = data.token;
    // Set token to expire in 23 hours (Umami tokens typically last 24h)
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

    console.log("Successfully authenticated with Umami API");
    return authToken;
  } catch (error) {
    console.error("Error getting Umami auth token:", error);
    return null;
  }
}

export function clearAuthToken(): void {
  authToken = null;
  tokenExpiry = 0;
}

export async function makeUmamiRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response | null> {
  const token = await getUmamiAuthToken();
  if (!token) {
    return null;
  }

  const umamiApiUrl = import.meta.env.PUBLIC_UMAMI_URL;
  const baseUrl = umamiApiUrl.replace(/\/(login)?$/, "");

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // If unauthorized, clear token and retry once
    if (response.status === 401) {
      clearAuthToken();
      const newToken = await getUmamiAuthToken();

      if (newToken) {
        return fetch(`${baseUrl}${endpoint}`, {
          ...options,
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
        });
      }
    }

    return response;
  } catch (error) {
    console.error("Error making Umami request:", error);
    return null;
  }
}
