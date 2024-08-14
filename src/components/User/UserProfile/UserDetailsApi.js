export const fetchUserDetails = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const response = await fetch("https://apps.rubaktechie.me/api/v1/auth/me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  const data = await response.json();
  return data.success ? data.data : null;
};
