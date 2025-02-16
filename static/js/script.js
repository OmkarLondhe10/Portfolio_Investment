document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("calculate")) {
        document.getElementById("calculate").addEventListener("click", calculateInvestment);
    }
    if (document.getElementById("savePortfolio")) {
        document.getElementById("savePortfolio").addEventListener("click", savePortfolio);
    }
    if (document.getElementById("clearPortfolio")) {
        document.getElementById("clearPortfolio").addEventListener("click", clearPortfolio);
    }

    loadSavedPortfolios();
});

// 🎯 Fixed asset categories with return rates
const assets = {
    "Equity": 0.12,
    "Real Estate": 0.08,
    "Gold": 0.05,
    "Debt": 0.05,
    "Fixed Deposit (FD)": 0.05,
    "Stock Market": 0.15,
    "SIP": 0.124
};

let allocationChart, growthChart, comparisonChart; // Chart instances

function calculateInvestment() {
    const age = parseInt(document.getElementById("age").value) || 0;
    const savings = parseFloat(document.getElementById("savings").value) || 0;
    const years = parseInt(document.getElementById("years").value) || 0;

    if (!age || !savings || !years) {
        alert("Please fill in all fields.");
        return;
    }

    let investmentData = Object.entries(assets).map(([type, returnRate]) => {
        let allocation = 100 / Object.keys(assets).length;
        let investmentAmount = (savings * allocation) / 100;
        let estimatedReturn = investmentAmount * (1 + returnRate * years);
        return {
            type,
            allocation,
            investment: investmentAmount,
            estimated_return: estimatedReturn,
            avg_return: (returnRate * 100).toFixed(2)
        };
    });

    const totalReturn = investmentData.reduce((acc, val) => acc + val.estimated_return, 0);
    const portfolioValue = savings + totalReturn;

    updateUI(investmentData, totalReturn, portfolioValue);
    updateCharts(investmentData);
}

// 📊 Update UI Table
function updateUI(data, totalReturn, portfolioValue) {
    const tableBody = document.querySelector("#investment-table tbody");
    tableBody.innerHTML = "";

    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.type}</td>
            <td>${row.allocation.toFixed(2)}%</td>
            <td>₹${row.investment.toLocaleString()}</td>
            <td>₹${row.estimated_return.toLocaleString()}</td>
            <td>${row.avg_return}%</td>
        `;
        tableBody.appendChild(tr);
    });

    document.getElementById("total-return").textContent = `Total Estimated Returns: ₹${totalReturn.toLocaleString()}`;
    document.getElementById("final-amount").textContent = `Final Portfolio Value: ₹${portfolioValue.toLocaleString()}`;
}

// 🎨 Update Investment & Growth Charts
function updateCharts(data) {
    const labels = data.map(row => row.type);
    const allocationData = data.map(row => row.investment);
    const returnsData = data.map(row => row.estimated_return);

    if (allocationChart) allocationChart.destroy();
    if (growthChart) growthChart.destroy();

    const ctx1 = document.getElementById("allocationChart").getContext("2d");
    const ctx2 = document.getElementById("growthChart").getContext("2d");

    // 🟠 Investment Allocation Pie Chart
    allocationChart = new Chart(ctx1, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: allocationData,
                backgroundColor: ["#ffcc00", "#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#33fff1", "#A133FF"]
            }]
        }
    });

    // 📊 Estimated Growth Bar Chart
    growthChart = new Chart(ctx2, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Estimated Returns",
                data: returnsData,
                backgroundColor: "#64ffda"
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

// 💾 Save Portfolio
function savePortfolio() {
    const portfolioData = JSON.parse(localStorage.getItem("savedPortfolios")) || {};
    const timestamp = new Date().toISOString();
    const tableRows = document.querySelectorAll("#investment-table tbody tr");

    if (tableRows.length === 0) {
        alert("No portfolio data to save!");
        return;
    }

    let newPortfolio = {};
    tableRows.forEach(row => {
        const columns = row.querySelectorAll("td");
        newPortfolio[columns[0].innerText] = {
            allocation: parseFloat(columns[1].innerText),
            investment: parseFloat(columns[2].innerText.replace(/₹|,/g, '')),
            estimated_return: parseFloat(columns[3].innerText.replace(/₹|,/g, '')),
            avg_return: parseFloat(columns[4].innerText.replace('%', ''))
        };
    });

    portfolioData[timestamp] = newPortfolio;
    localStorage.setItem("savedPortfolios", JSON.stringify(portfolioData));
    alert("Portfolio saved successfully!");
    loadSavedPortfolios();
}


// 🔄 Load Saved Portfolios 
function loadSavedPortfolios() {
    const savedData = JSON.parse(localStorage.getItem("savedPortfolios")) || {};
    const tableHeaderRow = document.getElementById("portfolioHeaders");
    const tableBody = document.getElementById("portfolioData");

    tableHeaderRow.innerHTML = "<th>Asset Type</th>"; // Reset headers
    tableBody.innerHTML = ""; // Reset table body

    const assetTypes = Object.keys(assets);

    // ✅ Dynamically create portfolio headers
    Object.keys(savedData).forEach((key, index) => {
        let th = document.createElement("th");
        th.textContent = `Portfolio ${index + 1}`;
        tableHeaderRow.appendChild(th);
    });

    // ✅ Populate table with asset types as rows, portfolios as columns
    assetTypes.forEach(asset => {
        let tr = document.createElement("tr");
        let tdType = document.createElement("td");
        tdType.textContent = asset;
        tr.appendChild(tdType);

        Object.values(savedData).forEach(portfolio => {
            let td = document.createElement("td");
            td.textContent = portfolio[asset] ? `₹${portfolio[asset].investment.toLocaleString()}` : "N/A";
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });

    updateComparisonChart(savedData);
}

// 📊 Update Comparison Chart
// 📊 Update Comparison Chart with Toggle Feature
function updateComparisonChart(savedData) {
    const ctx = document.getElementById("comparisonChart").getContext("2d");
    const labels = Object.keys(assets);
    let datasets = [];

    Object.entries(savedData).forEach(([timestamp, portfolio], index) => {
        const data = labels.map(type => portfolio[type] ? portfolio[type].estimated_return : 0);
        datasets.push({
            label: `Portfolio ${index + 1}`,
            data: data,
            backgroundColor: index % 2 === 0 ? "#3498db" : "#2ecc71", // Alternate colors for better contrast
            borderColor: index % 2 === 0 ? "#2980b9" : "#27ae60",
            borderWidth: 2,
            fill: false
        });
    });

    if (comparisonChart) comparisonChart.destroy();

    // Default to Bar Chart
    let chartType = "bar";

    function renderChart() {
        if (comparisonChart) comparisonChart.destroy();
        comparisonChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    renderChart();

    // Add toggle button if not already added
    if (!document.getElementById("toggleChartType")) {
        let toggleBtn = document.createElement("button");
        toggleBtn.id = "toggleChartType";
        toggleBtn.innerText = "Switch to Line Chart";
        toggleBtn.style.margin = "10px";
        toggleBtn.onclick = function () {
            chartType = chartType === "bar" ? "line" : "bar";
            this.innerText = chartType === "bar" ? "Switch to Line Chart" : "Switch to Bar Chart";
            renderChart();
        };
        document.querySelector(".chart-section").appendChild(toggleBtn);
    }
}



// ❌ Clear Portfolios
function clearPortfolio() {
    if (confirm("Are you sure you want to clear all saved portfolios?")) {
        localStorage.removeItem("savedPortfolios");
        alert("Saved portfolios cleared!");
        loadSavedPortfolios();
    }
}
