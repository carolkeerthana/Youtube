export const fetchVideosById = async (videoId) => {

    const response = await fetch(`https://apps.rubaktechie.me/api/v1/videos/${videoId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
                return await response.json();
    }