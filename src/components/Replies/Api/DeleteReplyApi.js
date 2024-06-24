export const deleteReply = async (id) => {

    const token = localStorage.getItem('token');
    if(!token){
        return { success: false, message: 'No token found' };
    }
    try{
        const response = await fetch(`https://apps.rubaktechie.me/api/v1/replies/${id}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const result = await response.json();
                return result;
    }catch(error){
        console.error('deleting comment:', error);
        return { success: false, message: 'Could not delete the comment' };
    }
    }