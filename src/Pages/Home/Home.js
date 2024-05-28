import { useState } from 'react';
import Feed from '../../components/Feed/Feed';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';

const HomePage= ({sidebar}) =>{
    const [category, setCategory] = useState(0);
    
return(
    <>
    <Sidebar sidebar={sidebar} category={category} setCategory={setCategory}/>     
    <div className={`container ${sidebar ? "" : 'large-container'}`}>
        <Feed category={category}/>
    </div>
    </>
)
}

export default HomePage;