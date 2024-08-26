export const getLikedVideos = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "No token found" };
  }

  const response = await fetch(
    `https://apps.rubaktechie.me/api/v1/feelings/videos`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
};
