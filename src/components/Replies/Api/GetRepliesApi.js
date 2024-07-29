export const getReplies = async () => {
  const token = localStorage.getItem("token");
  console.log("Retrieved token:", token);
  if (!token) {
    return { success: false, message: "No token found" };
  }

  try {
    const response = await fetch(
      `https://apps.rubaktechie.me/api/v1/replies/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Check if response is successful
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return { success: false, message: "Failed to fetch replies" };
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    return { success: false, message: "Failed to fetch replies" };
  }
};
