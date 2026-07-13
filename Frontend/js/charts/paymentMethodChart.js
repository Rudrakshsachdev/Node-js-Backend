/**
 * Modular Pie Chart showing payment channels distribution.
 */
export function initPaymentMethodChart(canvasId, transactions) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Sum occurrences of payment methods
  const paymentTotals = {};
  transactions.forEach(tx => {
    // Only track payment distribution for expenses
    if (tx.type === "expense") {
      paymentTotals[tx.paymentMethod] = (paymentTotals[tx.paymentMethod] || 0) + tx.amount;
    }
  });

  const methods = Object.keys(paymentTotals);
  const values = Object.values(paymentTotals);

  return new Chart(ctx, {
    type: "pie",
    data: {
      labels: methods.length ? methods : ["No Data"],
      datasets: [{
        data: values.length ? values : [1],
        backgroundColor: [
          "#0284c7", // Cash
          "#eab308", // Credit Card
          "#ef4444", // Debit Card
          "#10b981", // UPI
          "#6366f1", // Net Banking
          "#ec4899"  // Wallet
        ],
        borderWidth: 2,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
