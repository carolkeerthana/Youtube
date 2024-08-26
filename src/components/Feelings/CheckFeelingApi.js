export const checkFeeling = async (videoId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "No token found" };
  }
  const response = await fetch(
    "https://apps.rubaktechie.me/api/v1/feelings/check",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(videoId),
    }
  );
  return await response.json();
};
