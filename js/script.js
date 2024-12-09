import barChart from "./barChart.mjs"; // Import the barChart function

async function fetchCryptoPrices() {
  try {
    const btcResponse = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    const ethResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const xrpResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd"
    );

    const btcData = await btcResponse.json();
    const ethData = await ethResponse.json();
    const xrpData = await xrpResponse.json();

    const data = [
      { name: "Bitcoin", value: btcData.bpi.USD.rate_float || 0 },
      { name: "Ethereum", value: ethData.ethereum.usd || 0 },
      { name: "XRP", value: xrpData.ripple.usd || 0 },
    ];

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Initialize the chart
const chart = barChart("#chartContainer", {
  width: 800,
  height: 400,
  colors: ["#ff7f0e", "#2ca02c", "#1f77b4"],
});

// Update chart every 5 seconds
setInterval(async () => {
  const data = await fetchCryptoPrices();
  if (data.length) {
    chart.update(data);
  }
}, 5000);
