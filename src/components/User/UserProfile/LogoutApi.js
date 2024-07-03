export const logoutUser = async () => {

    const token = localStorage.getItem('token');
    if(!token){
        return { success: false, message: 'No token found' };
    }

        const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify()
        });
                return await response.json();
    }
