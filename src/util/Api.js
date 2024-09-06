const API_BASE_URL = "https://apps.rubaktechie.me/api/v1";

export const apiRequest = async ({
  endpoint,
  method = "GET",
  headers = {},
  body = null,
  auth = false,
}) => {
  try {
    if (auth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        throw new Error("Authorization token not found");
      }
    }

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server responded with error:", errorData);
      throw new Error(errorData.message || "Request failed");
    }

    const responseData = await response.json();
    console.log("Server responded with success:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error during API request:", error.message);
    throw error;
  }
};
