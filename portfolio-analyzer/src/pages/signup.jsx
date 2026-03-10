import { useNavigate} from 'react-router-dom';
import { supabase } from "../services/supabaseClient";
import { useState } from 'react';
import './sign.css';

function Signup(){
    const navigate=useNavigate();
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
      const userId = data.user.id;
      const { error: dbError } = await supabase.from("users").insert(
          {
            user_id: userId,
            name: name,
            email: email,
            last_login: new Date().toISOString()
          },
      );
     /* Altra chiamata equivalente che mostra la riga appena inserita
        const { data, error } = await supabase
        .from('users')
        .insert([
          { some_column: 'someValue', other_column: 'otherValue' },
        ])
        .select();*/
      if (dbError) {
        setMessage("Errore salvataggio dati: " + dbError.message);
      } else {
        setMessage("Account creato correttamente!");
        navigate("/create");
      }
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
          <p>Already signed up? <button type="button" id="redirect" onClick={() => navigate('/signin')}>Login</button></p>
          {message && <p>{message}</p>}
        </form>
        </>
    );
}

export default Signup
