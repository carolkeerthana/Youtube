import { useState } from 'react';
import Feed from '../../components/Feed/Feed';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import SearchResults from '../../components/Navbar/Search/SearchResults';

const HomePage= ({sidebar}) =>{
    const [category, setCategory] = useState(0);
    
return(
    <>
    <Navbar />
    <div className="main-content">
    <Sidebar sidebar={sidebar} category={category} setCategory={setCategory}/>     
    <div className={`container ${sidebar ? "" : 'large-container'}`}>
        <Routes>
            <Route index element={<Feed category={category}/>}/>
            <Route path='/search-results' element={<SearchResults/>}/>
        </Routes>
    </div>
    </div>
    </>
)
}

export default HomePage;