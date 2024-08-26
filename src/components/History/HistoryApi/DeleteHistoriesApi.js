export const deleteAllHistory = async (type) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "No token found" };
  }
  const response = await fetch(
    `https://apps.rubaktechie.me//api/v1/histories/${type}/all`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
};
