export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Parametro 'q' mancante" });
  }

  try {
    const response = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Yahoo Finance error: ${response.statusText}` });
    }

    const data = await response.json();

    return res.status(200).json({ quotes: data.quotes });
  } catch (err) {
    console.error("Errore nel proxy Yahoo:", err);
    return res.status(500).json({ error: "Errore interno server" });
  }
}