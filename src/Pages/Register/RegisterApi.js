export const registerUser = async (registerData) => {
  try {
    const response = await fetch(
      "https://apps.rubaktechie.me/api/v1/auth/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server responded with error:", errorData); // Log server error
      throw new Error(errorData.message || "Registration failed");
    }

    const responseData = await response.json();
    console.log("Server responded with success:", responseData); // Log success response
    return responseData;
  } catch (error) {
    console.error("Error during registration:", error.message);
    throw error;
  }
};
