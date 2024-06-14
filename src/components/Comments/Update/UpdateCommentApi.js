export const updateComment = async (updateComment, videoId) => {

    const token = localStorage.getItem('token');
    if(!token){
        return { success: false, message: 'No token found' };
    }
        const response = await fetch(`https://apps.rubaktechie.me/api/v1/comments/${videoId}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const result = await response.json();
                return result;
}