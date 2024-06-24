export const getReplies = async () => {

    const token = localStorage.getItem('token');
    if(!token){
        return { success: false, message: 'No token found' };
    }

    const response = await fetch(`https://apps.rubaktechie.me/api/v1/replies/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
                return await response.json();
    }