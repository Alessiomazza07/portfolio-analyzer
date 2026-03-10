import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient.js';
import { useState } from 'react';
import './sign.css';

function Signin(){
    const navigate=useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const handleSignin = async (event) => {
        event.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) {
          setMessage("Errore: " + error.message);
          return;
        }
        if (data.user) {
          console.log("Utente loggato:", data.user);
        } else {
          setMessage("Login fallito: controlla email e password.");
          return;
        }
        setMessage("Login riuscito!");
        navigate("/create");
    };
    return(
        <>
            <form id="sign" onSubmit={handleSignin}>
                <h2 className="title">Login</h2>
                <div className='info'>
                  <div className="field">
                    <label>Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"/>
                  </div>
                  <div className="field">
                    <label>Password</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>
                  </div>
                </div>
                <button id="current" type="submit">Login</button>
                <p>New to Portfolio-Analyzer?{" "}<button id="redirect" type="button" onClick={() => navigate('/signup')}>Sign up</button></p>
                {message && <p>{message}</p>}
            </form>
        </>
    );
}

export default Signin