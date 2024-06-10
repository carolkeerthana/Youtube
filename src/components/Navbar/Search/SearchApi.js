export const searchText = async (textData) => {
    console.log(textData)
    
    const token = localStorage.getItem('token');
    if(!token){
        return null;
    }

    try{
        const response = await fetch('https://apps.rubaktechie.me/api/v1/search?limit=0',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(textData)
                });
            return await response.json();
            }catch(error){
                throw new Error('Error fetching search results');
            }
    }