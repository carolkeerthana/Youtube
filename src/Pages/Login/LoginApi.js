export const loginUser = async (loginData) => {
    const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/user/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
                return await response.json();
    }