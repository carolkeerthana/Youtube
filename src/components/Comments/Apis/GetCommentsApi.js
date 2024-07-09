export const fetchComments = async (videoId) => {

    const response = await fetch(`https://apps.rubaktechie.me/api/v1/comments/${videoId}/videos`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
                return await response.json();
    }