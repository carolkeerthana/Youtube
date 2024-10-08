export const createCommentsApi = async (commentsData) => {
  console.log("Actual createCommentsApi called with:", commentsData);
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const response = await fetch("https://apps.rubaktechie.me/api/v1/comments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentsData),
  });
  return await response.json();
};
