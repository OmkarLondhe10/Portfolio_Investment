document.getElementById("calculate").addEventListener("click", () => {
    const age = document.getElementById("age").value;
    const savings = document.getElementById("savings").value;
    const years = document.getElementById("years").value;

    if (!age || !savings || !years) {
        alert("Please fill in all fields.");
        return;
    }

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            age: parseInt(age),
            savings: parseFloat(savings),
            years: parseInt(years)
        })
    })
    .then(response => response.json())
    .then(data => {
        // Update table
        const tableBody = document.querySelector("#investment-table tbody");
        tableBody.innerHTML = "";
        
        data.table_data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.type}</td>
                <td>${row.allocation}%</td>
                <td>₹${row.investment}</td>
                <td>₹${row.estimated_return}</td>
                <td>${row.avg_return}%</td>
            `;
            tableBody.appendChild(tr);
        });

        // Display total return and final portfolio value
        document.getElementById("total-return").textContent = `Total Estimated Returns: ₹${data.total_return}`;
        document.getElementById("final-amount").textContent = `Final Portfolio Value: ₹${data.final_amount}`;

        // Generate Charts
        generatePieChart(data.table_data.map(row => row.type), data.allocation_data);
        generateBarChart(data.table_data.map(row => row.type), data.returns_data);
    })
    .catch(error => console.error('Error:', error));
});

function generatePieChart(labels, data) {
    const ctx = document.getElementById("allocationChart").getContext("2d");
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCD56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"]
            }]
        }
    });
}

function generateBarChart(labels, data) {
    const ctx = document.getElementById("growthChart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estimated Returns',
                data: data,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
