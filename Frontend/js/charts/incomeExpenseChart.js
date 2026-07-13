/**
 * Modular Line Chart displaying monthly income vs expense trends.
 */
export function initIncomeExpenseChart(canvasId, transactions) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Aggregate income and expense totals grouped by 'YYYY-MM'
  const monthlyData = {};

  transactions.forEach(tx => {
    const monthKey = tx.date.substring(0, 7); // e.g. "2026-07"
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }
    if (tx.type === "income") {
      monthlyData[monthKey].income += tx.amount;
    } else {
      monthlyData[monthKey].expense += tx.amount;
    }
  });

  // Get sorted unique months
  const sortedMonths = Object.keys(monthlyData).sort();

  const incomeDataset = sortedMonths.map(m => monthlyData[m].income);
  const expenseDataset = sortedMonths.map(m => monthlyData[m].expense);

  // Format month names for labels (e.g. '2026-07' -> 'Jul 2026')
  const labels = sortedMonths.map(m => {
    const [year, month] = m.split("-");
    const dateObj = new Date(year, parseInt(month) - 1);
    return dateObj.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  });

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.length ? labels : ["No Data"],
      datasets: [
        {
          label: "Income (₹)",
          data: incomeDataset.length ? incomeDataset : [0],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: "#10b981"
        },
        {
          label: "Expenses (₹)",
          data: expenseDataset.length ? expenseDataset : [0],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.05)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: "#ef4444"
        }
      ]
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
            font: { size: 12, family: "Inter", weight: 500 }
          }
        },
        tooltip: {
          padding: 12,
          cornerRadius: 8
        }
      }
    }
  });
}
