document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("whatIfForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const investmentAmount = parseFloat(document.getElementById("investmentAmount").value);
        const stockSymbol = document.getElementById("stockSymbol").value;
        const years = parseInt(document.getElementById("years").value);

        // Define mock stock data with unique growth rates, colors, and tips
        const stockData = {
            "AAPL": { name: "Apple", growthRate: 0.12, color: "#1d76d2", tips: "Apple has shown consistent growth. A long-term hold is recommended." },
            "GOOG": { name: "Google", growthRate: 0.08, color: "#4285f4", tips: "Google is stable, good for a diversified portfolio." },
            "AMZN": { name: "Amazon", growthRate: 0.15, color: "#ff9900", tips: "Amazon is high-growth, but volatile. Ideal for long-term investors." },
            "TSLA": { name: "Tesla", growthRate: 0.2, color: "#ff0000", tips: "Tesla is high-risk, high-reward. Only for those with strong risk tolerance." },
            "MSFT": { name: "Microsoft", growthRate: 0.1, color: "#00a4ef", tips: "Microsoft has steady growth. Consider a balanced portfolio approach." },
            "FB": { name: "Facebook", growthRate: 0.1, color: "#3b5998", tips: "Facebook shows stable growth. It's good for conservative investors." },
            "NFLX": { name: "Netflix", growthRate: 0.12, color: "#e50914", tips: "Netflix is growing steadily, but faces competition. Diversification is key." },
            "NVDA": { name: "NVIDIA", growthRate: 0.18, color: "#76b900", tips: "NVIDIA is a growth stock with potential, though it can be volatile." },
            "INTC": { name: "Intel", growthRate: 0.07, color: "#00a2d1", tips: "Intel is a stable stock, with modest growth. Ideal for conservative investors." },
            "BABA": { name: "Alibaba", growthRate: 0.1, color: "#ff6a00", tips: "Alibaba is stable but faces regulatory risks. Consider with caution." },
            "SPY": { name: "SPDR S&P 500 ETF", growthRate: 0.08, color: "#2c3e50", tips: "SPY tracks the S&P 500. It’s great for passive investors." },
            "V": { name: "Visa", growthRate: 0.09, color: "#0066b3", tips: "Visa has steady growth, ideal for a low-risk portfolio." },
            "PYPL": { name: "PayPal", growthRate: 0.14, color: "#003087", tips: "PayPal is a strong player in the digital payment space." },
            "DIS": { name: "Disney", growthRate: 0.1, color: "#005f97", tips: "Disney shows steady growth, ideal for long-term holders." },
            "CSCO": { name: "Cisco", growthRate: 0.05, color: "#1e5b6e", tips: "Cisco is stable, but growth is slower. It's good for a conservative portfolio." },
            "UBER": { name: "Uber", growthRate: 0.12, color: "#000000", tips: "Uber is a growing company, but has high volatility." },
            "PFE": { name: "Pfizer", growthRate: 0.1, color: "#1c75bc", tips: "Pfizer is a reliable stock in the healthcare sector." },
            "JNJ": { name: "Johnson & Johnson", growthRate: 0.07, color: "#0072bc", tips: "Johnson & Johnson is a stable stock with a low-risk profile." },
            "KO": { name: "Coca-Cola", growthRate: 0.05, color: "#e60000", tips: "Coca-Cola offers slow but steady growth, ideal for conservative portfolios." },
            "PEP": { name: "Pepsi", growthRate: 0.06, color: "#009cde", tips: "Pepsi is a steady performer in the consumer goods sector." },
            "WMT": { name: "Walmart", growthRate: 0.04, color: "#0071ce", tips: "Walmart is a stable, low-growth stock, ideal for conservative investors." },
            "MCD": { name: "McDonald's", growthRate: 0.06, color: "#f8d02e", tips: "McDonald's is a stable performer in the fast-food industry." },
            "GM": { name: "General Motors", growthRate: 0.05, color: "#006ab6", tips: "General Motors offers steady growth with minimal volatility." },
            "EXXON": { name: "ExxonMobil", growthRate: 0.03, color: "#003f87", tips: "ExxonMobil offers stability but slow growth. It's a good defensive stock." },
            "XOM": { name: "ExxonMobil", growthRate: 0.03, color: "#003f87", tips: "ExxonMobil offers stability but slow growth. It's a good defensive stock." },
            "COST": { name: "Costco", growthRate: 0.08, color: "#0055a5", tips: "Costco is a stable stock with steady growth, ideal for conservative portfolios." },
            "TGT": { name: "Target", growthRate: 0.07, color: "#e23129", tips: "Target is a reliable stock with consistent growth." },
            "AMT": { name: "American Tower", growthRate: 0.1, color: "#f6b400", tips: "American Tower is a solid choice in the telecom sector with steady growth." }
        };

        // Get stock data for the selected symbol
        const stock = stockData[stockSymbol];

        // Calculate the projected value after the specified number of years
        const projectedValue = investmentAmount * Math.pow(1 + stock.growthRate, years);
        document.getElementById("projectedAmount").textContent = `Projected Value After ${years} Years: $${projectedValue.toFixed(2)}`;

        // Clear any existing chart before creating a new one
        const chartContainer = document.getElementById("chartContainer");
        chartContainer.innerHTML = '<canvas id="projectionChart"></canvas>'; // Recreate the canvas

        // Create a chart to visualize the stock's growth
        const ctx = document.getElementById("projectionChart").getContext("2d");
        const chart = new Chart(ctx, {
            type: "line", // Line chart type
            data: {
                labels: Array.from({ length: years }, (_, i) => i + 1), // Labels: Years
                datasets: [{
                    label: `${stock.name} Growth`, // Dataset label
                    data: Array.from({ length: years }, (_, i) => investmentAmount * Math.pow(1 + stock.growthRate, i + 1)), // Growth data
                    borderColor: stock.color, // Line color
                    backgroundColor: stock.color + "80", // Transparent fill color
                    fill: true, // Fill the area under the line
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Investment Value ($)' // Y-axis label
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Years' // X-axis label
                        }
                    }
                }
            }
        });

        // Show the result section
        document.getElementById("simulationResult").classList.remove("hidden");
    });
});
