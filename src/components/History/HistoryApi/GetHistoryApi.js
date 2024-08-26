export const fetchHistories = async (page, type) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "No token found" };
  }
  const response = await fetch(
    `https://apps.rubaktechie.me/api/v1/histories?page=${page}&type=${type}`,
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
