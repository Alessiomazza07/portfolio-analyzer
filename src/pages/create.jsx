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
  const [stocks, setStocks] = useState([""]);

  function addStock(e) {
    e.preventDefault();
    setStocks([...stocks,""]);
  }
  
  function removeStock(e,index) {
    e.preventDefault();
    setStocks(stocks.filter((_, i) => i !== index));
  }

  function updateStock(index, e) {
    const newStocks = [...stocks];
    newStocks[index] = e.target.value;
    setStocks(newStocks);
  }

  const handleData = async (event) => {
    event.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const {data:portfoliosList}=await supabase.from("Portfolios").select("*").eq("user_id",user.user_id);
    for (let row of portfoliosList) {
      if(portName==row.port_name){
        console.log("Portafoglio già esistente, cambia il nome");
        return;
      }
    }
    const portfolio={
      user_id: user.user_id,
      port_name: portName,
      start_date: startDate,
      end_date: endDate,
      benchmark: benchmark,
      tickers: JSON.stringify(stocks),
    };
    const { error: dbError } = await supabase.from("Portfolios").insert([portfolio,]);
    if (dbError) {
      console.log("Errore salvataggio dati: " + dbError.message);
      return;
    }
    navigate("/dashboard");
  };
    return(
        <>
            <h1>Create your portfolio</h1>
            <form id="create" action="" method="post" acceptCharset="utf-8">
              <div className="parameter">
                <label>Name</label> 
                <input type="text" value={portName} onChange={(e) => setPortName(e.target.value)}/>
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
              <div className="stocks">
                {stocks.map((value, i) => (
                  <div className="stock" key={i}>
                    <label>{`Stock ${i + 1}`}</label>
                    <input type="text" value={value} onChange={(e) => updateStock(i,e)}/>
                    <button className="remove" onClick={(e) => removeStock(e,i)}>{'\u002D'}</button>
                  </div>
                ))}
                <button className="add" onClick={(e) => addStock(e)}>{'\u002B'}</button>
              </div>
              <button id="build" onClick={(e) => handleData(e)}>Build</button>
            </form>
        
        </>
    );
}
export default Create