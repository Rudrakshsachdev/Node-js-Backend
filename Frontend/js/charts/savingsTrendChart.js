/**
 * Modular Bar Chart representing the monthly savings trend (Income - Expenses).
 */
export function initSavingsTrendChart(canvasId, transactions) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Aggregate monthly savings
  const monthlySavingsMap = {};

  transactions.forEach(tx => {
    const monthKey = tx.date.substring(0, 7); // e.g. "2026-07"
    if (!monthlySavingsMap[monthKey]) {
      monthlySavingsMap[monthKey] = { income: 0, expense: 0 };
    }
    if (tx.type === "income") {
      monthlySavingsMap[monthKey].income += tx.amount;
    } else {
      monthlySavingsMap[monthKey].expense += tx.amount;
    }
  });

  const sortedMonths = Object.keys(monthlySavingsMap).sort();

  const savingsDataset = sortedMonths.map(m => {
    return monthlySavingsMap[m].income - monthlySavingsMap[m].expense;
  });

  const labels = sortedMonths.map(m => {
    const [year, month] = m.split("-");
    const dateObj = new Date(year, parseInt(month) - 1);
    return dateObj.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  });

  // Dynamically color bars: Green for positive savings, Red for net negative (overspent)
  const barColors = savingsDataset.map(val => (val >= 0 ? "#10b981" : "#ef4444"));

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.length ? labels : ["No Data"],
      datasets: [{
        label: "Net Savings (₹)",
        data: savingsDataset.length ? savingsDataset : [0],
        backgroundColor: barColors,
        borderRadius: 4,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [5, 5],
            color: "#e4e4e7"
          },
          ticks: {
            font: { size: 11, family: "Inter" }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 11, family: "Inter" }
          }
        }
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            font: { size: 12, family: "Inter" }
          }
        }
      }
    }
  });
}
