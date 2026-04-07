import { useNavigate} from 'react-router-dom';
import { useEffect,useState } from 'react';
import { supabase } from "../services/supabaseClient";
import './create.css';
import AssetDropdown from '../components/assetDropdown';
//import YahooFinance from "yahoo-finance2";

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
  const [weights, setWeights] = useState([null]);
  const [assets, setAssets] = useState([""]);
  const [dropdown, setDropdown] = useState({});
  const [message, setMessage] = useState([""]);

  function addWeight(e) {
    e.preventDefault();
    setWeights([...weights,0]);
  }
  
  const removeWeight = (e, index) => {
    e.preventDefault();
    setWeights(weights.filter((_, idx) => idx !== index));
  };

  const updateWeight = (index, e) => {
    const newWeights = [...weights];
    newWeights[index] = e.target.value;
    setWeights(newWeights);
  };

  function addAsset(e) {
    e.preventDefault();
    setAssets([...assets,""]);
  }
  
  const removeAsset = (e, index) => {
    e.preventDefault();
    setAssets(assets.filter((_, idx) => idx !== index));
  };

  const updateAsset = (index, e) => {
    const newAssets = [...assets];
    newAssets[index] = e.target.value;
    setAssets(newAssets);
  };

  const selectAsset = (index, asset) => {
    const newAssets = [...assets];
    newAssets[index] = `${asset.name} (${asset.symbol})`;
    setAssets(newAssets);
  };

  const searchAsset = async (query) => {
    if (!query) return [];
    try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        console.log(data.quotes);
        return data.quotes;
    } catch (error) {
        console.error("Errore API:", error);
        return [];
    }
  }

  const checkPortfolioName = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const {data:portfoliosList}=await supabase
    .from("Portfolios")
    .select("*")
    .eq("user_id",user.user_id);

    /*console.log("Lista portafogli utente: ",portfoliosList);
    console.log("Nome scelto da verificare: ",portName);*/

    for (let p of portfoliosList) {
      /*console.log("Controllando con: ",p.port_name," -> ",(portName==p.port_name));*/
      if(portName==p.port_name){
        //gestire l'errore displaying a message per l'utente
        setMessage("Change your portfolio name. You already have one named like this");
        console.log("Portafoglio già esistente, cambia il nome");
        return true;
      }
    }
    setMessage(" ");
    return false;
  }

  const acquireAssetsParameters = async() =>{
    const assetList = [];
    const assetInputs=document.querySelectorAll('.asset>div>input');
    for(let a of assetInputs){
      let assetResult = await searchAsset(a.value);
      //console.log(assetResult);
      let assetObject = {
        symbol: assetResult[0].symbol,
        asset_name: a.value,
      }
      console.log(assetObject);
      assetList.push(assetObject);
    }
    return assetList;
  }

  const filterAssetsAlreadyPresent = async(assetList) => {
    const filteredAssetList = [...assetList];
    const {data:assetsAlreadyPresent, error} = await supabase.from("Assets").select("symbol");
    if(error){
      console.log("Error retrieving data: ",error.message);
      return;
    }
    return filteredAssetList.filter(a => !assetsAlreadyPresent.some(alrA => alrA.symbol === a.symbol));
  }

  const insertIntoTableDB = async(list,tableName) => {
    const { error: insertError } = await supabase.from(tableName).insert(list);
    if (insertError) {
      console.log("Errore salvataggio dati: " + insertError.message);
      return;
    }
    console.log(list," inserito in ",tableName);
  }

  const checkParameters = () => {
    const inputs = document.querySelectorAll("input");
    for(let i of inputs){
      if(!i.value){
        console.log("Parametro mancante: ",i);
        setMessage("Fill in all the fields");
        return false;
      }
    }
    if(startDate>endDate){
      setMessage("The end date must be after the start date");
      console.log("La data di fine deve essere dopo la data d'inizio");
      return false;
    }
    setMessage(" ");
    return true;
  }

  const checkWeights = () => {
    var s=0;
    for(let w of weights){
      s+=parseFloat(w);
    }
    if(s !== 100){
      setMessage("The sum of the weights must add up to 100%");
      console.log("La somma dei pesi non è 100");
      return false;
    }
    setMessage(" ");
    return true;
  }

  const getHistories = async (assets) => {
    try {
      const query = new URLSearchParams({
        assets: assets.join(','),
        start: Math.floor(new Date(startDate) / 1000),
        end: Math.floor(new Date(endDate) / 1000),
      });

      const res = await fetch(`/api/histories?${query.toString()}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Errore API: ${text}`);
      }

      const data = await res.json();
      //console.log("Dati storici:", data);
      return data;
    } catch (err) {
      console.error("Errore chiamata getHistories:", err);
      return null;
    }
  };

  const getAvailability = async (assets) => {
    try {
      const query = new URLSearchParams({
        assets: assets.join(','),
        start: Math.floor(new Date(startDate) / 1000),
        end: Math.floor(new Date(endDate) / 1000),
      });

      const res = await fetch(`/api/checkDatesAvailability?${query.toString()}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Errore API: ${text}`);
      }

      const data = await res.json();
      console.log("Disponibilità dati:", data);
      return data;
    } catch (err) {
      console.error("Errore chiamata getAvailability:", err);
      return null;
    }
  };


  const areDatesAvailable = async () => {
    const availability = await getAvailability(assets);
    availability.forEach(a => {
      if (!a.available) {
        console.log(`${a.symbol} non ha dati nel range richiesto`);
        setMessage("Unavailable data for selected period");
        return false;
      }
      console.log(`${a.symbol} ha dati da ${new Date(a.firstDate).toLocaleDateString()} a ${new Date(a.lastDate).toLocaleDateString()}`);
      setMessage(" ");
      return true;
    });
  }

  /*
  const areDatesAvailableNO = async(assetList) => {
    const yahooFinance = new YahooFinance();
    const interval = "1d";

    var histories = await assetList.map(async (asset) => {
      var {data:history, error} = await yahooFinance.historical(asset, {
        period1: startDate,
        period2: endDate,
        interval: interval
      });
      if(error){
        console.log("Error retrieving data: ",error.message);
        return;
      }
  
      const filtered = history.map(d => ({
        date: d.date,
        close: d.close,
      }));

      return filtered;
    });

    console.log(histories);
  
  }
  */


  const handleData = async (event) => {
    event.preventDefault();
    const isDuplicate = await checkPortfolioName();
    if(isDuplicate){return;}
    if(!checkParameters()){return;}
    if(!checkWeights()){return;}
    const checkDates = await areDatesAvailable();
    if(!checkDates){return;}

    
    const assetList = await acquireAssetsParameters();
    /*
    #Aggiungere nel db gli asset non ancora presenti
    const assetListToAdd = await filterAssetsAlreadyPresent(assetList);
    if(assetListToAdd.length > 0){
      insertIntoTableDB(assetListToAdd,"Assets");
      console.log("Assets mancanti inseriti nella tabella db Assets:",assetListToAdd);
    }

    #Creare oggetto portfolio
    const portfolio={
      user_id: user.user_id,
      port_name: portName,
      start_date: startDate,
      end_date: endDate,
      benchmark: benchmark,
    };
    //console.log(portfolio);

    #Inserimento portfolio nel db
    insertIntoTableDB([portfolio,],"Portfolios");

    #Prendere portfolio id
    const {data:portfolio_id,error:portfolio_idError} = await supabase
    .from("Portfolios")
    .select("port_id")
    .eq("user_id",portfolio.user_id)
    .eq("port_name",portfolio.port_name);
    if(portfolio_idError){
      console.log("Errore retrieving portfolio_id: ",portfolio_idError.message);
      return;
    }
    */

    const symbolList = assetList.map(a => a.symbol);
    const histories = await getHistories(symbolList);
    console.log(histories);

    
    /*
    #Prendere l'id di tutti gli asset selezionati
    const {data:asset_ids,error:asset_idListError} = await supabase
    .from("Assets")
    .select("asset_id")
    .in("symbol",symbolList);
    if(asset_idListError){
      console.log("Errore retrieving asset ids:",asset_idListError.message);
      return;
    }

    #Creare righe tabella di raccordo PortfolioAssets
    const association = [];
    for(let i=0;i<asset_ids.length;i++){
      association.push(
        {
          port_id: portfolio_id[0].port_id,
          asset_id: asset_ids[i].asset_id,
          weight: parseFloat(weights[i])/100,
        }
      );
    }
    //console.log(association);

    #Inserimento association nel db
    insertIntoTableDB(association,"PortfolioAssets");

    

    #Reindirizzamento dashboard
    //navigate("/dashboard");

    */
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
                  <input required type="date" max={new Date().toISOString().split("T")[0]} value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                </div>
                <div className="parameter">
                  <label>End date</label>
                  <input required type="date" max={new Date().toISOString().split("T")[0]}value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                </div>
                <div className="parameter">
                  <label>Market benchmark</label>
                  <input required type="text" value={benchmark} onChange={(e) => setBenchmark(e.target.value)} placeholder='INDEXSP:.INX'/>
                </div>
              </div>

              <div className="assets-container">

                {assets.map((value, i) => (
                  <div className="asset" key={i}>

                    <label style={{ width: "4rem",textAlign: "center" }}>{`Asset ${i + 1}`}</label>
                    <AssetDropdown value={value} onChange={(e) => updateAsset(i,e)}/>
                      <label>at</label>
                      <input required className="percent" onChange={(e) => updateWeight(i,e)} type="number" min="0" max="100" step="0.01" placeholder="..."></input>
                      <label>%</label>

                    <button className="remove" onClick={(e) => {removeAsset(e, i);removeWeight(e, i)}}>
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

                <button className="add" onClick={(e) => {addAsset(e);addWeight(e);}}>{'\u002B'}</button>

              </div>
              <button id="build" onClick={(e) => handleData(e)}>Build</button>
              {message && <p className='error-message'>{message}</p>}
            </form>
        
        </>
    );
}
export default Create