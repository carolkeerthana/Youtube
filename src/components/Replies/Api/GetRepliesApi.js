export const getReplies = async () => {
  try {
    const response = await fetch(
      `https://apps.rubaktechie.me/api/v1/replies/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch replies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error; // Or handle it as needed
  }
};
