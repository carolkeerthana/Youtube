import ErrorPage from "../Error/ErrorPage";

export const registerUser = async (registerData) => {
    // try {
        const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/user/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
            });
            // if(!response.ok){
            //     const errorData = await response.json();
            //     throw new Error(<ErrorPage/>);
            // }
            return await response.json();
            // } catch (error) {
            //     console.error('Error:', error);
            //     throw error;
            // }
}
