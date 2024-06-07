import React, { useEffect, useState } from 'react'
import './Recommended.css'
import thumbnail1 from '../../assets/thumbnail5.png'
import thumbnail2 from '../../assets/thumbnail6.png'
import thumbnail3 from '../../assets/thumbnail7.png'
import thumbnail4 from '../../assets/thumbnail8.png'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const Recommended = ({videoId}) => {
    const [data, setData] = useState([]);  
    const navigate = useNavigate(); 

    const fetchData = async () => {
        const videoUrl = `https://apps.rubaktechie.me/api/v1/videos/public`

        try {
            const response = await fetch(videoUrl);
            const json = await response.json();
            console.log('API response:', json);
            if(json.success && Array.isArray(json.data)) {
                setData(json.data);
            }else{
              console.error('API response is not in the expected format:', json);
            }   
          } catch (error) {
            navigate('/error');
          }
    }

    useEffect(()=>{
        fetchData();
    },[videoId, navigate]);

    const handleVideoClick = (id) =>{
        console.log('Navigating to videoId:', id);
        navigate(`/watch/${id}`)
    }

  return (
    <div className='recommended'>
        <hr/>
        <p className='next'>Up next</p>
        {data.map((item) => {
        return(
        <div key={item._id} className='side-video-list' onClick={()=>handleVideoClick(item._id)}>
            <img src={`https://apps.rubaktechie.me/uploads/thumbnails/${item.thumbnailUrl}`} alt=''/>
            <div className='vid-info'>
                <h4>{item.title}</h4>
                <p>{item.userId.channelName}</p>
                <p>{item.views} Views &bull; {moment(item.createdAt).fromNow()}</p>
            </div>
        </div>
        )}
    )}
    </div>
  )
}

export default Recommended
