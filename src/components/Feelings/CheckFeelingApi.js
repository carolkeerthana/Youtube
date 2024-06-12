export const checkFeeling = async (videoId) => {

    const response = await fetch('https://apps.rubaktechie.me/api/v1/feelings/check',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(videoId)
            });
                return await response.json();
    }