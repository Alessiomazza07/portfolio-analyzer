import { useNavigate} from 'react-router-dom';
import { useEffect,useState } from 'react';
import { supabase } from "../services/supabaseClient";
import './create.css';

function Create(){
  const navigate = useNavigate();
  
  const user=JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    if(!user){
      navigate("/"); 
    }
  }, [user,navigate]);
  
  const [portName, setPortName] = useState([""]);
  const [startDate, setStartDate] = useState([""]);
  const [endDate, setEndDate] = useState([""]);
  const [benchmark, setBenchmark] = useState([""]);
  const [assets, setAssets] = useState([""]);
  const [dropdown, setDropdown] = useState({});

  function addAsset(e) {
    e.preventDefault();
    setAssets([...assets,""]);
  }
  
  const removeAsset = (e, index) => {
    e.preventDefault();
    setAssets(assets.filter((_, idx) => idx !== index));

    const newDropdown = { ...dropdown };
    delete newDropdown[i];
    setDropdown(newDropdown);
  };

  const updateAsset = (index, e) => {
    const newAssets = [...assets];
    newAssets[index] = e.target.value;
    setAssets(newAssets);

    // Chiama la funzione searchAsset solo se ci sono almeno 2 caratteri
    if (e.target.value.length >= 2) {
      searchAsset(e.target.value).then(results => {
        setDropdown(prev => ({ ...prev, [index]: results }));
      });
    } else {
      setDropdown(prev => ({ ...prev, [index]: [] }));
    }
  };

  const selectAsset = (index, asset) => {
    const newAssets = [...assets];
    newAssets[index] = `${asset.name} (${asset.symbol})`;
    setAssets(newAssets);

    setDropdown(prev => ({ ...prev, [index]: [] }));
  };

  /*
async function searchAsset(query) {
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${query}`
    )}`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    if (!data.quotes) return [];
  
    return data.quotes.map(q => ({
      symbol: q.symbol,
      name: q.shortname || q.longname || "Unknown"
    }));
  }
  console.log(searchAsset("app"));
 */

  const checkPortfolioName = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const {data:portfoliosList}=await supabase
    .from("Portfolios")
    .select("*")
    .eq("user_id",user.user_id);

    for (let p of portfoliosList) {
      if(portName==p.port_name){
        //gestire l'errore displaying a message per l'utente
        console.log("Portafoglio già esistente, cambia il nome");
        return true;
      }
    }
    return false;
  }

  const validateAssets = async(assetList) => {

  }

  async function searchAsset(query){
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    console.log(data.quotes);
  }
  /*esempio*/
  searchAsset("apple");


/*
  async function searchAsset(query) {
    if (!query) return [];

    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${query}`
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.quotes) return [];

    return data.quotes.map(q => ({
      symbol: q.symbol,
      name: q.shortname || q.longname || "Unknown"
    }));
  }
    */

  const handleData = async (event) => {
    event.preventDefault();
    if(checkPortfolioName()){return;}

    const validatedAssets = validateAssets(assets);

    const portfolio={
      user_id: user.user_id,
      port_name: portName,
      start_date: startDate,
      end_date: endDate,
      benchmark: benchmark,
      assets: validatedAssets,/*JSON.stringify(assets),*/
    };

    const { error: insertError } = await supabase.from("Portfolios").insert([portfolio,]);
    if (insertError) {
      console.log("Errore salvataggio dati: " + insertError.message);
      return;
    }

    navigate("/dashboard");
  };
    return(
        <>
            <h1>Create your portfolio</h1>
            <form id="create" action="" method="post" acceptCharset="utf-8">
              <div className="name">
                <input type="text" value={portName} onChange={(e) => setPortName(e.target.value)} placeholder='Enter portfolio name...'/>
              </div>
              <div className="parameters">
                <div className="parameter">
                  <label>Start date</label> 
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                </div>
                <div className="parameter">
                  <label>End date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                </div>
                <div className="parameter">
                  <label>Market benchmark</label>
                  <input type="text" value={benchmark} onChange={(e) => setBenchmark(e.target.value)} placeholder='INDEXSP:.INX'/>
                </div>
              </div>
              <div className="assets-container">
                {/*assets.map((value, i) => (
                  <div className="asset" key={i}>
                    <label>{`Asset ${i + 1}`}</label>
                    <input type="text" value={value} onChange={(e) => updateAsset(i,e)}/>
                    <button className="remove" onClick={(e) => removeAsset(e,i)}>{'\u002D'}</button>
                  </div>
                ))*/}
                {assets.map((value, i) => (
                  <div className="asset" key={i} style={{ position: "relative" }}>
                    <label>{`Asset ${i + 1}`}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateAsset(i, e)}
                      autoComplete="off"
                    />
                    <button className="remove" onClick={(e) => removeAsset(e, i)}>
                      {'\u002D'}
                    </button>
                    {dropdown[i] && dropdown[i].length > 0 && (
                    <div className="dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "white",
                      border: "1px solid #ccc",
                      zIndex: 10
                    }}>
                      {dropdown[i].map((a, idx) => (
                        <div
                          key={idx}
                          style={{ padding: "5px", cursor: "pointer" }}
                          onClick={() => selectAsset(i, a)}
                        >
                          {a.name} ({a.symbol})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
                <button className="add" onClick={(e) => addAsset(e)}>{'\u002B'}</button>
              </div>
              <button id="build" onClick={(e) => handleData(e)}>Build</button>
            </form>
        
        </>
    );
}
export default Create