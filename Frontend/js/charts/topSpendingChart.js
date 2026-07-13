/**
 * Modular Horizontal Bar Chart outlining categories with highest expenditure.
 */
export function initTopSpendingChart(canvasId, transactions) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Sum expenses by category
  const categoryTotals = {};
  transactions.forEach(tx => {
    if (tx.type === "expense") {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });

  // Sort and grab top 5 categories
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = sortedCategories.map(item => item[0]);
  const data = sortedCategories.map(item => item[1]);

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.length ? labels : ["No Expenses"],
      datasets: [{
        label: "Spent Amount (₹)",
        data: data.length ? data : [0],
        backgroundColor: "rgba(99, 102, 241, 0.85)", // Indigo theme color
        hoverBackgroundColor: "rgba(99, 102, 241, 1)",
        borderRadius: 4,
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: "y", // Render horizontally
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            borderDash: [5, 5],
            color: "#e4e4e7"
          },
          ticks: {
            font: { size: 10, family: "Inter" }
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            font: { size: 11, family: "Inter", weight: 500 }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 6
        }
      }
    }
  });
}
