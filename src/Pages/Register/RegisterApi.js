export const registerUser = async (registerData) => {
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
  return await response.json();
};
