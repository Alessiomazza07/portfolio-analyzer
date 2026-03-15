import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import { supabase } from '../services/supabaseClient.js';
import { useState } from 'react';
import './sign.css';

function Signin(){
  const navigate=useNavigate();
  const user=JSON.parse(sessionStorage.getItem("user"));
  const from=sessionStorage.getItem("from");
  useEffect(() => {
    if(user){
      if(from=="create")
        navigate("/create")
      else
        navigate("/portfolios")
    }
  }, [user,from, navigate]);
    
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

        await supabase
        .from("Users")
        .update({ last_login: new Date().toISOString() })
        .eq("user_id", data.user.id);

        const {data:result}=await supabase.from("Users").select("name").eq("user_id",data.user.id);

        const user={
          user_id: data.user.id,
          name: result[0].name,
          email: email,
          last_login: new Date().toISOString()
        };
        sessionStorage.setItem("user",JSON.stringify(user));
        if(from=="create")
          navigate("/create")
        else
          navigate("/portfolios")
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