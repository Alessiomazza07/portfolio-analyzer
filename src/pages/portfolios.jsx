import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import './portfolios.css'

function Portfolios() {
    const navigate= useNavigate();

    const [portfolios, setPortfolios] = useState([]);

    const user = JSON.parse(sessionStorage.getItem("user"));
    useEffect(() => {
      if(!user)
        navigate("/");
    }, [user, navigate]);

    /*
    function updatePortfolios(newPortfolio) {
      const newPortfolios = [...portfolios];
      newPortfolios.push(newPortfolio);
      setPortfolios(newPortfolios);
      console.log(portfolios);
    }
    */

    const fetchPortfolios = async () => {
        const { data, error } = await supabase
        .from("portfolios")
        .select("port_id,port_name,start_date,end_date,benchmark,tickers")
        .eq("user_id", user.user_id);
        if (error) {
            console.error("Error fetching portfolios:", error);
        } else {
            setPortfolios(data);
        }
    };
    useEffect(() => {console.log(portfolios);}, [portfolios]);
    useEffect(() => {fetchPortfolios()},[]);
    return (
        <>
          <h1>I tuoi portafogli</h1>
          <div>
            {portfolios.length === 0 ? (
              <p>Nessun portafoglio trovato.</p>
            ) : (
              <div>
                {portfolios.map((p) => (
                  <div key={p.port_id}>{p.port_name}</div>
                ))}
              </div>
            )}
          </div>
        </>
  );
}

export default Portfolios

/*
function Portfolios(){
    const navigate=useNavigate();

    return(
        <>
        <h1>Your portfolios</h1>
        <div className="container">
            {
            <div className="portfolio"></div>
            }
        </div>
        </>
    );
}
*/