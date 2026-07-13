/**
 * Modular Doughnut Chart showing category expenditure ratios.
 */
export function initCategoryDistributionChart(canvasId, transactions) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Sum expenses by category
  const categoryTotals = {};
  transactions.forEach(tx => {
    if (tx.type === "expense") {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });

  const categories = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);

  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: categories.length ? categories : ["No Expenses"],
      datasets: [{
        data: totals.length ? totals : [1],
        backgroundColor: [
          "#059669", // Food
          "#ef4444", // Transportation
          "#2563eb", // Shopping
          "#db2777", // Bills
          "#d97706", // Healthcare
          "#7c3aed", // Entertainment
          "#0284c7", // Education
          "#4f46e5", // Travel
          "#84cc16", // Salary
          "#06b6d4", // Investment
          "#71717a"  // Other
        ],
        borderWidth: 2,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 15,
            font: { size: 11, family: "Inter" }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return ` ${label}: ₹${value.toLocaleString('en-IN')}`;
            }
          }
        }
      }
    }
  });
}
