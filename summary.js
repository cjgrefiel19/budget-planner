// Initialize charts
let expenseDistributionChart;
let monthlyComparisonChart;
let savingsBreakdownChart;
let creditCardChart;

// Initialize the summary page
function initializeSummary() {
    // Set default date range to current year
    const currentDate = new Date();
    document.getElementById('fromMonth').value = '1'; // January
    document.getElementById('toMonth').value = '12'; // December
    document.getElementById('fromYear').value = currentDate.getFullYear().toString();
    document.getElementById('toYear').value = currentDate.getFullYear().toString();

    // Initialize charts
    initializeCharts();
    
    // Update summary with default date range
    updateSummary();
}

// Initialize all charts
function initializeCharts() {
    // Expense Distribution Chart
    const expenseCtx = document.getElementById('expenseDistributionChart').getContext('2d');
    expenseDistributionChart = new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // Monthly Comparison Chart
    const monthlyCtx = document.getElementById('monthlyComparisonChart').getContext('2d');
    monthlyComparisonChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Income',
                    data: [],
                    backgroundColor: '#2ecc71'
                },
                {
                    label: 'Expenses',
                    data: [],
                    backgroundColor: '#e74c3c'
                },
                {
                    label: 'Savings',
                    data: [],
                    backgroundColor: '#3498db'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Savings Breakdown Chart
    const savingsCtx = document.getElementById('savingsBreakdownChart').getContext('2d');
    savingsBreakdownChart = new Chart(savingsCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#9b59b6',
                    '#f1c40f',
                    '#e67e22'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Credit Card Usage Chart
    const creditCtx = document.getElementById('creditCardChart').getContext('2d');
    creditCardChart = new Chart(creditCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Credit Card Spending',
                data: [],
                borderColor: '#e74c3c',
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update summary based on selected date range
function updateSummary() {
    const fromMonth = parseInt(document.getElementById('fromMonth').value);
    const fromYear = parseInt(document.getElementById('fromYear').value);
    const toMonth = parseInt(document.getElementById('toMonth').value);
    const toYear = parseInt(document.getElementById('toYear').value);

    // Get data from localStorage
    const budgetData = JSON.parse(localStorage.getItem('budgetData')) || {
        expenses: [],
        savings: [],
        loans: [],
        credit: []
    };

    // Filter transactions within date range
    const startDate = new Date(fromYear, fromMonth - 1, 1);
    const endDate = new Date(toYear, toMonth, 0);

    const filteredExpenses = filterTransactionsByDate(budgetData.expenses, startDate, endDate);
    const filteredSavings = filterTransactionsByDate(budgetData.savings, startDate, endDate);
    const filteredLoans = filterTransactionsByDate(budgetData.loans, startDate, endDate);
    const filteredCredit = filterTransactionsByDate(budgetData.credit, startDate, endDate);

    // Update overview cards
    updateOverviewCards(filteredExpenses, filteredSavings, filteredLoans, filteredCredit);

    // Update charts
    updateExpenseDistributionChart(filteredExpenses);
    updateMonthlyComparisonChart(startDate, endDate, budgetData);
    updateSavingsBreakdownChart(filteredSavings);
    updateCreditCardChart(filteredCredit, startDate, endDate);

    // Update detailed lists
    updateTopExpensesList(filteredExpenses);
    updateMonthlyTrendsList(startDate, endDate, budgetData);
    updateCategoryAnalysisList(filteredExpenses);
}

// Filter transactions by date range
function filterTransactionsByDate(transactions, startDate, endDate) {
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });
}

// Update overview cards
function updateOverviewCards(expenses, savings, loans, credit) {
    const totalExpenses = calculateTotal(expenses) + calculateTotal(credit);
    const totalSavings = calculateTotal(savings);
    const totalLoans = calculateTotal(loans);
    const netBalance = totalSavings - totalExpenses - totalLoans;

    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('totalSavings').textContent = formatCurrency(totalSavings);
    document.getElementById('netBalance').textContent = formatCurrency(netBalance);
}

// Update expense distribution chart
function updateExpenseDistributionChart(expenses) {
    const categoryTotals = {};
    expenses.forEach(expense => {
        const category = expense.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });

    expenseDistributionChart.data.labels = Object.keys(categoryTotals);
    expenseDistributionChart.data.datasets[0].data = Object.values(categoryTotals);
    expenseDistributionChart.update();
}

// Update monthly comparison chart
function updateMonthlyComparisonChart(startDate, endDate, budgetData) {
    const months = [];
    const expenseData = [];
    const savingsData = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const month = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        months.push(`${month} ${year}`);

        const monthExpenses = sumTransactionsForMonth(budgetData.expenses, currentDate);
        const monthSavings = sumTransactionsForMonth(budgetData.savings, currentDate);

        expenseData.push(monthExpenses);
        savingsData.push(monthSavings);

        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    monthlyComparisonChart.data.labels = months;
    monthlyComparisonChart.data.datasets[1].data = expenseData;
    monthlyComparisonChart.data.datasets[2].data = savingsData;
    monthlyComparisonChart.update();
}

// Update savings breakdown chart
function updateSavingsBreakdownChart(savings) {
    const categoryTotals = {};
    savings.forEach(saving => {
        const category = saving.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + saving.amount;
    });

    savingsBreakdownChart.data.labels = Object.keys(categoryTotals);
    savingsBreakdownChart.data.datasets[0].data = Object.values(categoryTotals);
    savingsBreakdownChart.update();
}

// Update credit card chart
function updateCreditCardChart(creditTransactions, startDate, endDate) {
    const months = [];
    const creditData = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const month = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        months.push(`${month} ${year}`);

        const monthTotal = sumTransactionsForMonth(creditTransactions, currentDate);
        creditData.push(monthTotal);

        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    creditCardChart.data.labels = months;
    creditCardChart.data.datasets[0].data = creditData;
    creditCardChart.update();
}

// Update top expenses list
function updateTopExpensesList(expenses) {
    const topExpensesList = document.getElementById('topExpensesList');
    topExpensesList.innerHTML = '';

    // Sort expenses by amount
    const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
    const top5Expenses = sortedExpenses.slice(0, 5);

    top5Expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'details-item';
        item.innerHTML = `
            <div class="label">
                <i class="fas fa-tag"></i>
                ${expense.category} - ${expense.subcategory}
            </div>
            <div class="value">₱${expense.amount.toFixed(2)}</div>
        `;
        topExpensesList.appendChild(item);
    });
}

// Update monthly trends list
function updateMonthlyTrendsList(startDate, endDate, budgetData) {
    const trendsList = document.getElementById('monthlyTrendsList');
    trendsList.innerHTML = '';

    let currentDate = new Date(startDate);
    let previousMonthTotal = null;

    while (currentDate <= endDate) {
        const monthTotal = sumTransactionsForMonth(budgetData.expenses, currentDate);
        
        if (previousMonthTotal !== null) {
            const difference = monthTotal - previousMonthTotal;
            const percentChange = (difference / previousMonthTotal) * 100;

            const item = document.createElement('div');
            item.className = 'details-item';
            item.innerHTML = `
                <div class="label">
                    ${currentDate.toLocaleString('default', { month: 'long' })}
                </div>
                <div class="trend ${difference >= 0 ? 'up' : 'down'}">
                    <i class="fas fa-${difference >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                    ${Math.abs(percentChange).toFixed(1)}%
                </div>
            `;
            trendsList.appendChild(item);
        }

        previousMonthTotal = monthTotal;
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
}

// Update category analysis list
function updateCategoryAnalysisList(expenses) {
    const analysisList = document.getElementById('categoryAnalysisList');
    analysisList.innerHTML = '';

    const categoryTotals = {};
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    expenses.forEach(expense => {
        const category = expense.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });

    Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, amount]) => {
            const percentage = (amount / totalExpenses) * 100;
            const item = document.createElement('div');
            item.className = 'details-item';
            item.innerHTML = `
                <div class="label">
                    <i class="fas fa-chart-pie"></i>
                    ${category}
                </div>
                <div class="value">${percentage.toFixed(1)}%</div>
            `;
            analysisList.appendChild(item);
        });
}

// Helper functions
function calculateTotal(transactions) {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

function sumTransactionsForMonth(transactions, date) {
    return transactions.reduce((sum, transaction) => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getMonth() === date.getMonth() && 
            transactionDate.getFullYear() === date.getFullYear()) {
            return sum + transaction.amount;
        }
        return sum;
    }, 0);
}

function formatCurrency(amount) {
    return `₱${amount.toFixed(2)}`;
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeSummary);
