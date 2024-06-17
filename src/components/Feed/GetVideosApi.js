export const fetchVideos = async () => {

    const response = await fetch(`https://apps.rubaktechie.me/api/v1/videos/public`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
                return await response.json();
    }