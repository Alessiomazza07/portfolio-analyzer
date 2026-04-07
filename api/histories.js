import YahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  try {
    const { assets: assetsQuery, start, end } = req.query;
    if (!assetsQuery || !start || !end) {
      return res.status(400).json({ error: "Parametri mancanti" });
    }

    const assets = assetsQuery.split(",");
    const startDate = Number(start); // timestamp in secondi
    const endDate = Number(end);

    const yahooFinance = new YahooFinance();
    const interval = "1d";

    const histories = await Promise.all(
      assets.map(async (asset) => {
        const history = await yahooFinance.historical(asset, {
          period1: startDate,
          period2: endDate,
          interval,
        });

        return {
          symbol: asset,
          prices: history.map((d) => ({ date: d.date, close: d.close })),
        };
      })
    );

    res.status(200).json(histories);
  } catch (err) {
    console.error("Errore Yahoo Finance:", err.message);
    res.status(500).json({ error: "Errore server" });
  }
}
/*
Versione 4
import YahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  console.log("chiamata api");
  var { assets } = req.query;
  console.log("assets: ",assets);
  try {
    const { assets: assetsQuery, start, end } = req.query;
    if (!assetsQuery || !start || !end) {
      return res.status(400).json({ error: "Parametri mancanti" });
    }

    const assets = assetsQuery.split(",");
    const startDate = parseInt(start);
    const endDate = parseInt(end);

    const yahooFinance = new YahooFinance();
    const interval = "1d";

    const histories = await Promise.all(
      assets.map(async (asset) => {
        const { data: history, error } = await yahooFinance.historical(asset, {
          period1: startDate,
          period2: endDate,
          interval,
        });

        if (error) {
          console.log("Errore:", error.message);
          return [];
        }

        return {
          symbol: asset,
          prices: history.map((d) => ({ date: d.date, close: d.close })),
        };
      })
    );

    res.status(200).json(histories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore server" });
  }
}
*/

/*
Versione 3
export default async function handler(req, res) {
  console.log("chiamata api");
  var { assets } = req.query;
  console.log("assets: ",assets);
  
  try {
    const assets = req.query.assets?.split(",");
    console.log("QUERY:", req.query);
    console.log("ASSETS:", assets);

    if (!assets || !Array.isArray(assets)) {
      return res.status(400).json({ error: "assets deve essere un array" });
    }

    const yahooFinance = new YahooFinance();
    const interval = "1d";

    const histories = await Promise.all(
      assets.map(async (asset) => {
        const { data: history, error } = await yahooFinance.historical(asset, {
          period1: startDate,
          period2: endDate,
          interval,
        });

        if (error) {
          console.log("Errore:", error.message);
          return [];
        }

        return history.map(d => ({
          date: d.date,
          close: d.close,
        }));
      })
    );

    res.status(200).json(histories);
  } catch (err) {
    res.status(500).json({ error: "Errore server" });
  }
}
*/

/*
versione 2
export default async function handler(req, res) {
  try {
    const yahooFinance = new YahooFinance();
    const interval = "1d";

    const histories = await Promise.all(
      assetList.map(async (asset) => {
        const { data: history, error } = await yahooFinance.historical(asset, {
          period1: startDate,
          period2: endDate,
          interval,
        });

        if (error) {
          console.log("Error retrieving data:", error.message);
          return [];
        }

        return history.map(d => ({
          date: d.date,
          close: d.close,
        }));
      })
    );

    res.status(200).json(histories);
  } catch (err) {
    res.status(500).json({ error: "Errore server" });
  }
}
*/

/*
versione 1
export default async function handler(req, res) {

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

    app.get("/api/histories", async (req, res) => {
      const histories = Promise.all(
        assetList.map(async (asset) => {
            const { data } = await yahooFinance.historical(asset, {
            period1: startDate,
            period2: endDate,
            interval: interval
            });
            if(error){
            console.log("Error retrieving data: ",error.message);
            return;
          }
          return data;
        })
      );
    
      res.json(histories);
    });
}
*/
