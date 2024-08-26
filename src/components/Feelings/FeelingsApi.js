export const updateFeelings = async (feelingsData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, message: "No token found" };
  }
  const response = await fetch("https://apps.rubaktechie.me/api/v1/feelings/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feelingsData),
  });
  return await response.json();
};
