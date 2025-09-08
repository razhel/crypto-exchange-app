document.addEventListener("DOMContentLoaded", function () {
  const refreshBtn = document.getElementById("refreshBtn");
  const lastUpdate = document.getElementById("lastUpdate");
  const ratesGrid = document.getElementById("ratesGrid");
  const pricesGrid = document.getElementById("pricesGrid");

  async function fetchExchangeRates() {
    try {
      const res = await fetch("/api/exchange-rates");
      const json = await res.json();
      if (json.success) {
        displayRates(json.data);
        lastUpdate.textContent = `Last updated: ${new Date(json.timestamp).toLocaleTimeString()}`;
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      console.error("Failed to fetch exchange rates:", err);
      lastUpdate.textContent = "Failed to update rates";
    }
  }

  async function fetchPrices() {
    try {
      const res = await fetch("/api/prices");
      const json = await res.json();
      if (json.success) {
        displayPrices(json.data);
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      console.error("Failed to fetch prices:", err);
    }
  }

  function displayRates(rates) {
    ratesGrid.innerHTML = "";
    for (const key in rates) {
      const rate = rates[key];
      const div = document.createElement("div");
      div.className = "rate-card";
      div.innerHTML = `
        <h3>${rate.name} (${rate.unit.toUpperCase()})</h3>
        <p>Value: ${rate.value}</p>
        <p>Type: ${rate.type}</p>
      `;
      ratesGrid.appendChild(div);
    }
  }

  function displayPrices(prices) {
    pricesGrid.innerHTML = "";
    for (const coin in prices) {
      const data = prices[coin];
      const div = document.createElement("div");
      div.className = "price-card";
      div.innerHTML = `
        <h3>${coin.toUpperCase()}</h3>
        <p>USD: $${data.usd}</p>
        <p>EUR: €${data.eur}</p>
        <p>BTC: ${data.btc}</p>
        <p>24h Change: ${data.usd_24h_change?.toFixed(2) ?? 'N/A'}%</p>
        <p>Market Cap: $${data.usd_market_cap?.toLocaleString() ?? 'N/A'}</p>
      `;
      pricesGrid.appendChild(div);
    }
  }

  refreshBtn.addEventListener("click", () => {
    fetchExchangeRates();
    fetchPrices();
  });

  // Initial fetch
  fetchExchangeRates();
  fetchPrices();
});
