import { useNavigate } from 'react-router-dom'
import './navbar.css'

function Navbar(){
    const navigate=useNavigate();

    return(
        <>
        <div class="navbar">
            <div class="logo">
              <img src="src/assets/MAGG-logo.png" alt="logo" />
              <h4>MAGGweb</h4>
            </div>
            <div class="sections">
              <button onClick={() => navigate('/')}>Home</button>
              <button onClick={() => navigate('/about')}>About</button>
              <button onClick={() => navigate('/signin')}>Login</button>
              <button onClick={() => navigate('/signup')}>Sign up</button>
            </div>
        </div>
        </>
    );
}

export default Navbar