import YahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  try {
    const { assets: assetsQuery, start, end } = req.query;
    if (!assetsQuery || !start || !end) {
      return res.status(400).json({ error: "Parametri mancanti" });
    }

    const assets = assetsQuery.split(",");
    const startDate = Number(start);
    const endDate = Number(end);

    const yahooFinance = new YahooFinance();
    const interval = "1d";

    const availability = await Promise.all(
      assets.map(async (asset) => {
        try {
          const history = await yahooFinance.historical(asset, {
            period1: startDate,
            period2: endDate,
            interval,
          });

          if (!history || history.length === 0) {
            return { symbol: asset, available: false };
          }

          const firstDate = history[0].date;
          const lastDate = history[history.length - 1].date;

          return {
            symbol: asset,
            available: true,
            firstDate,
            lastDate,
          };
        } catch (err) {
          return { symbol: asset, available: false, error: err.message };
        }
      })
    );

    res.status(200).json(availability);
  } catch (err) {
    console.error("Errore Yahoo Finance:", err.message);
    res.status(500).json({ error: "Errore server" });
  }
}
