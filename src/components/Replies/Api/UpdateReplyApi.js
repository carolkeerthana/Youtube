export const updateReplyApi = async (updateData, id) => {

    const token = localStorage.getItem('token');
    if(!token){
        return { success: false, message: 'No token found' };
    }
        const response = await fetch(`https://apps.rubaktechie.me/api/v1/replies/${id}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                });
                const result = await response.json();
                return result;
}