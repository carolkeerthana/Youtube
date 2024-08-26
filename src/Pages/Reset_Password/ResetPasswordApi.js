export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(
      `https://apps.rubaktechie.me/api/v1/auth/resetpassword/${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
