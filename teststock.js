import YahooFinance from "yahoo-finance2";
import fs from "fs";

const yahooFinance = new YahooFinance();

async function main() {

  const data = await yahooFinance.historical("AAPL", {
    period1: "2023-01-01",
    period2: "2023-06-01",
    interval: "1d"
  });

  const filtered = data.map(d => ({
    date: d.date,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume
  }));

  fs.writeFileSync("stock.json", JSON.stringify(filtered, null, 2));

  console.log("File JSON creato");
}

main();








/*
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const quote = await yahooFinance.quote('AAPL');

console.log(quote);

const { regularMarketPrice : price, currency } = quote;
console.log(price);
console.log(currency);
*/