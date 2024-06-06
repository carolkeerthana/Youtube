export const commentsApi = async (commentsData) => {
    const response = await fetch('https://apps.rubaktechie.me/api/v1/comments/',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentsData)
            });
                return await response.json();
    }