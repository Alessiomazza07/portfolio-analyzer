import { useNavigate } from 'react-router-dom'
import userIcon from '../assets/user-icon.svg';
import './navbar.css'

function Navbar(){
    const navigate=useNavigate();

    const user=JSON.parse(sessionStorage.getItem("user"));

    return(
        <>
        <div className="navbar">
            <div className="logo">
              <img src="/MAGG-logo.png" alt="logo" />
              <h4>MAGGweb</h4>
            </div>
            <div className="sections">
              <button onClick={() => navigate('/')}>Home</button>
              <button onClick={() => navigate('/about')}>About</button>

              {user ? (
                <>
                  <button onClick={() => navigate('/create')}>Create</button>
                  <button onClick={() => navigate('/portfolios')}>Portfolios</button>
                  <button className='user-icon' onClick={() => navigate('/account')}>
                    <img src={userIcon} alt="User" width={20} height={20}/>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/signin')}>Login</button>
                  <button onClick={() => navigate('/signup')}>Sign up</button>
                </>
              )}

              
            </div>
        </div>
        </>
    );
}

export default Navbar