import Feed from '../../components/Feed/Feed';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';
import { Route, Routes } from 'react-router-dom';
import SearchResults from '../../components/Search/SearchResults';
import Trending from '../../components/Trending/Trending';
import Subscriptions from '../../components/Subscriptions/Subscriptions';
import LikedVideos from '../../components/LikedVideos/LikedVideos';
import History from '../../components/History/History';

const HomePage= ({sidebar,setSidebar}) =>{

return(
    <>
    {/* <Navbar setSidebar={setSidebar}/> */}
    <div className="home-container">
    <Sidebar sidebar={sidebar} setSidebar={setSidebar} page='home'/>     
    <div className={`container ${sidebar ? "" : 'large-container'}`}>
        <Routes>
            <Route index element={<Feed />}/>         
            <Route path='/search-results' element={<SearchResults/>} />
            <Route path='/trending' element={<Trending/>} />
            <Route path='/subscriptions' element={<Subscriptions/>} />
            <Route path='/liked-videos' element={<LikedVideos/>} />
            <Route path='/history' element={<History/>}/>
        </Routes>
    </div>
    </div>
    </>
)
}

export default HomePage;