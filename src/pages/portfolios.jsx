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
        const { data:portsList, error:portError } = await supabase
        .from("Portfolios")
        .select("port_id,port_name,start_date,end_date,benchmark,created_at")
        .eq("user_id", user.user_id);
        if (portError) {
            console.error("Error fetching portfolios:", portError.message);
        }

        for(let i=0; i < portsList.length; i++){
          var {data, error:assetError}=await supabase
            .from('Portfolios')
            .select(`PortfolioAssets!inner(Assets!inner(asset_id,symbol,asset_name))`)
            .eq('port_id',portsList[i].port_id);

          if (assetError) {
            console.error("Error fetching assets:", assetError.message);
          }

          let assetsList = data[0].PortfolioAssets;
          portsList[i].asset_ids = [];
          portsList[i].asset_symbols = [];
          portsList[i].asset_names = [];
          
          for(let j = 0; j < assetsList.length; j++){
            portsList[i].asset_ids.push( assetsList[j].Assets.asset_id );
            portsList[i].asset_symbols.push( assetsList[j].Assets.symbol );
            portsList[i].asset_names.push( assetsList[j].Assets.asset_name );
          }

          console.log( portsList[i].asset_ids );
          console.log( portsList[i].asset_symbols );
          console.log( portsList[i].asset_names );
        }

        setPortfolios(portsList);
    };
    const usePortfolio = async (e) => {
      /*
      e.preventDefault();
      const user_string = sessionStorage.getItem("user");
      if(!user_string){
      return;
      }
      const user = JSON.parse(user_string);

      const data = await supabase.from("Portfolios")
      .select("port_id,start_date,end_date,benchmark")
      .eq("user_id",user.user_id);
      console.log("data");
      console.log(data.port_id);

      /*
      data=
      {
      port_id : ...
      start_date: ...,
      end_date: ...,
      benchmark: ...
      }
      
      const port_id = data.port_id;
      if(!port_id){
      return;
      }

      const port_info = await supabase.from("Portfolios")
      .select("avg_return,volatility,beta")
      .eq("port_id",port_id);

      if(!port_info){
      return;
      }

      const assets = await supabase.from("PortfolioAssets")
      .select("asset_id")
      .eq("port_id",data.port_id);
      console.log("assets");
      console.log(assets);

      const history=[];
      for(let i=0;i<assets.length;i++){
        history[i] = await supabase.from("HistoricalAssets")
        .select("date,close")
        .eq("asset_id",ass)
        .between(start_date,end_date);
      }
      console.log("history");
      console.log(history);
      */
    };

    //print portfolios at every change
    useEffect(() => {console.log(portfolios)},[portfolios]);
    //fetch portfolios once
    useEffect(() => {fetchPortfolios()},[]);

    
    
    //rendering dinamico degli assets
    const [expandedPorts, setExpandedPorts] = useState([]);
    function showAssets(portId) {
      setExpandedPorts(prev =>
        prev.includes(portId)
          ? prev.filter(id => id !== portId)
          : [...prev, portId]
      );
    }
    function stringToHSL(str) {
      let hash = 0;

      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
    
      const h = hash % 360;
      const s = 70;
      const l = 50;
    
      return { h, s, l };
    }
    function getColors(str) {
      const { h, s, l } = stringToHSL(str);
    
      return {
        color: `hsl(${h}, ${s}%, ${l}%)`,
        background: `hsl(${h}, ${s}%, ${l - 30}%)`
      };
    }

    return (
        <>
          <h1>Your portfolios</h1>
          <div>
            {portfolios.length === 0 ? (
              <p>You have not created any portfolio. Go build one!</p>
            ) : (
              <div>
                {portfolios.map((p) => (
                    <div className="portfolio" key={p.port_id}>
                      <div className='divider'>
                        <div className='port-info-container'>
                          <h3 className='port-name'>{p.port_name}</h3>
                          <p className='port-info'>{new Date(p.start_date).toLocaleString("en-EN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })} - {new Date(p.end_date).toLocaleString("en-EN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            })}</p>
                          <p className='port-info'>Using {p.benchmark} as market benchmark</p>


                          <p className='port-info'>Holdings:</p>
                          <div className="assets" id={p.port_id}>
                            {
                            (expandedPorts.includes(p.port_id)
                              ? p.asset_names
                              : p.asset_names.slice(0, 3)
                            ).map(a => (
                              <span className="asset-badge" key={a} style={{ color: getColors(a).color,backgroundColor: getColors(a).background,borderColor:getColors(a).color}}>
                                {a}
                              </span>
                            ))}
                            {p.asset_names.length > 3 && (<button className='show-btn' onClick={() => showAssets(p.port_id)}>
                                {expandedPorts.includes(p.port_id)? '\u002D' : '\u002B'}
                                {expandedPorts.includes(p.port_id)? '' : p.asset_names.length - 3}
                              </button>)}
                          </div>
                        </div>
                        <button className='select-btn' onClick={(e) => usePortfolio(e,p.port_id)}>Use</button>
                      </div>

                      <p className='date'>Created at {new Date(p.created_at).toLocaleString("en-EN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}</p>
                    </div>
                ))}
              </div>
            )}
            <button type="button" className='create-btn' onClick={() => navigate('/create')}>Create new portfolio</button>
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