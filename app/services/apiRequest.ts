import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiRequest = async (
  endPoint: string,
  method = "GET",
  body: unknown = null,
  isFormData = false
) => {
  const baseUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}`;
  const url = `${baseUrl}${endPoint}`;

  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("You must log in first.");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (method !== "GET" && method !== "HEAD") {
    options.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();

    if (!response.ok) {
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Request failed");
      } catch {
        throw new Error(text);
      }
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

