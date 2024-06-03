export const forgotPasswordApi = async (emailData) => {

const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/forgotpassword',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
        });
        return await response.json();
}