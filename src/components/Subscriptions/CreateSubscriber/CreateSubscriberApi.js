export const CreateSubscriberApi = async (channelId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "No token found" };
  }
  const response = await fetch(
    "https://apps.rubaktechie.me/api/v1/subscriptions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(channelId),
    }
  );
  return await response.json();
};
