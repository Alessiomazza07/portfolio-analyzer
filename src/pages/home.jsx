import { useNavigate } from 'react-router-dom'
import './home.css'

function Home(){
    const navigate=useNavigate();

    function fromHeroSection(e){
        e.preventDefault();
        sessionStorage.setItem("from","create");
        navigate('/signup');
    }

    return(
        <>
        <div id="herosection">
            <div id="cta">
              <h1 id="cta-title">Build<br />your own<br />portfolio</h1>
              <button id="cta-but" onClick={(e) => fromHeroSection(e)}>Start Now</button>
            </div>
            <img id="heroimg" src="src/assets/hero.png" alt="hero.png"/>
        </div>
        </>
    );
}

export default Home