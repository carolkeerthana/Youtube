export const CreateHistory = async (historiesData) => {

    const token = localStorage.getItem('token');
    if(!token){
        return { success: false, message: 'No token found' };
    }
    const response = await fetch('https://apps.rubaktechie.me/api/v1/histories',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(historiesData)
            });
                return await response.json();
    }