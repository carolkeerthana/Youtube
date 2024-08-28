// import { registerUser } from "../RegisterApi";

// describe("registerUser function", () => {
//   test("should register user successfully", async () => {
//     // Mock the response from the API
//     const mockResponse = { token: "fake-token" };
//     global.fetch = jest.fn().mockResolvedValueOnce({
//       ok: true,
//       json: () => Promise.resolve(mockResponse),
//     });

//     // Define test data
//     const registerData = {
//       email: "test@example.com",
//       channelName: "tech",
//       password: "password123",
//       confirmPassword: "password123",
//     };

//     // Call the function
//     const result = await registerUser(registerData);

//     // Assert the result
//     expect(result.token).toBe("fake-token");
//   });
// });
