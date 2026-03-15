import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react'
import { supabase } from "../services/supabaseClient";
import { useState } from 'react';
import './sign.css';

function Signup(){
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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async (event) => {
      event.preventDefault();
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        setMessage("Errore: " + error.message);
        return;
      }
      if (data.user) {
        console.log("Nuovo utente registrato:", data.user);
      } else {
        setMessage("Controlla la tua email per confermare l'account.");
        return;
      }

      //creazione user
      const user={
        user_id: data.user.id,
        name: name,
        email: email,
        last_login: new Date().toISOString()
      };
      //aggiunta user al session storage
      sessionStorage.setItem("user",JSON.stringify(user));
      //inserimento user nel db
      const { error: dbError } = await supabase.from("Users").insert([user,]);
      if (dbError) {
        setMessage("Errore salvataggio dati: " + dbError.message);
        return;
      }
      setMessage("Account creato correttamente!");

      useEffect(() => {
        if(from=="create")
          navigate("/create")
        else
          navigate("/portfolios")
      }, [user,from, navigate]);
    };
    return(
        <>
        <form id="sign" onSubmit={handleSignup}>
          <h4 className="title">Create your new account</h4>
          <div className='info'>
            <div className="field">
              <label>Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"/>
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"/>
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>
            </div>
          </div>
          <button id="current" type="submit">Sign up</button>
          <p>Already signed up? <button type="button" id="redirect" onClick={(e) => navigate('/signin')}>Login</button></p>
          {message && <p>{message}</p>}
        </form>
        </>
    );
}

export default Signup
