export const forgotPasswordApi = async (emailData) => {
  try {
    const response = await fetch(
      "https://apps.rubaktechie.me/api/v1/auth/forgotpassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in forgotPasswordApi:", error);
    throw error; // rethrow the error to handle it in ForgotPassword component
  }
};
