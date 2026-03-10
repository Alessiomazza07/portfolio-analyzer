import { useNavigate } from 'react-router-dom'
import './home.css'

function Home(){
    const navigate=useNavigate();

    return(
        <>
        <div id="herosection">
            <div id="cta">
              <h1 id="cta-title">Build<br />your own<br />portfolio</h1>
              <button id="cta-but" onClick={() => navigate('/signup')}>Start Now</button>
            </div>
            <img id="heroimg" src="src/assets/hero.png" alt="hero.png"/>
        </div>
        </>
    );
}

export default Home