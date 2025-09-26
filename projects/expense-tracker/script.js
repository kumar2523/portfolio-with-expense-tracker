let expenses = [];

const form = document.getElementById('expense-form');
const tableBody = document.querySelector('#expense-table tbody');

let categoryChart, trendChart;

form.addEventListener('submit', e => {
  e.preventDefault(); // stop page refresh

  // read input values
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;

  // create new expense object
  const expense = { category, amount, date };
  expenses.push(expense);

  // update UI
  updateTable();
  updateCharts();

  // reset form
  form.reset();
});

function updateTable() {
  tableBody.innerHTML = "";
  expenses.forEach(exp => {
    const row = `<tr>
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>₹${exp.amount}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

function updateCharts() {
  // Category breakdown
  const categoryTotals = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(document.getElementById('categoryChart'), {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']
      }]
    }
  });

  // Monthly trend
  const monthlyTotals = {};
  expenses.forEach(exp => {
    const month = exp.date.slice(0,7); // YYYY-MM
    monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
  });

  const months = Object.keys(monthlyTotals);
  const totals = Object.values(monthlyTotals);

  if (trendChart) trendChart.destroy();
  trendChart = new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Expenses over time',
        data: totals,
        borderColor: '#2563eb',
        fill: false
      }]
    }
  });
}
