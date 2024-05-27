import Feed from '../../components/Feed/Feed';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';

const HomePage= ({sidebar}) =>{
    
    
return(
    <>
    <Sidebar sidebar={sidebar}/> 
    <div className={`container ${sidebar ? "" : 'large-container'}`}>
        <Feed/>
    </div>
    </>
)
}

export default HomePage;