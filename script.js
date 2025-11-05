// SCRIPT.JS - FinanceHub Complete Finance Management System

// Data storage
let expenses = [];
let incomes = [];
let bills = [];
let budgets = {};
let familyMembers = [];
let sharedExpenses = [];

// Initialize charts
let incomeExpenseChart = null;
let expenseBreakdownChart = null;

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== INCOME MANAGEMENT =====
function addIncome() {
    const name = document.getElementById('incomeName').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const date = document.getElementById('incomeDate').value;
    const category = document.getElementById('incomeCategory').value;

    if (!name || !amount || !date || !category) {
        alert('Please fill all income fields');
        return;
    }

    const income = {
        id: Date.now(),
        name: name,
        amount: amount,
        date: date,
        category: category
    };

    incomes.push(income);
    document.getElementById('incomeName').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeDate').value = '';
    document.getElementById('incomeCategory').value = '';

    displayIncomes();
    updateDashboard();
}

function displayIncomes() {
    const list = document.getElementById('incomeList');
    if (incomes.length === 0) {
        list.innerHTML = '<p style="color: #999;">No income added yet</p>';
        return;
    }

    list.innerHTML = incomes.map(income => `
        <div class="transaction-item income-item">
            <div class="transaction-info">
                <h4>${income.name}</h4>
                <p>${income.category} • ${new Date(income.date).toLocaleDateString()}</p>
            </div>
            <div class="transaction-amount income-amount">+₹${income.amount.toLocaleString()}</div>
            <button class="btn btn-danger" onclick="deleteIncome(${income.id})">Delete</button>
        </div>
    `).join('');
}

function deleteIncome(id) {
    incomes = incomes.filter(i => i.id !== id);
    displayIncomes();
    updateDashboard();
}

// ===== EXPENSE MANAGEMENT =====
function addExpense() {
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;

    if (!name || !amount || !category || !date) {
        alert('Please fill all expense fields');
        return;
    }

    const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(expense);
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDate').value = '';

    displayExpenses();
    updateDashboard();
    generateInsights();
}

function displayExpenses() {
    const list = document.getElementById('expensesList');
    if (expenses.length === 0) {
        list.innerHTML = '<p style="color: #999;">No expenses added yet</p>';
        return;
    }

    const recentExpenses = expenses.slice(-10).reverse();
    list.innerHTML = recentExpenses.map(expense => `
        <div class="transaction-item expense-item">
            <div class="transaction-info">
                <h4>${expense.name}</h4>
                <p>${expense.category} • ${new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <div class="transaction-amount">-₹${expense.amount.toLocaleString()}</div>
            <button class="btn btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `).join('');
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    displayExpenses();
    updateDashboard();
    generateInsights();
}

// ===== BILL MANAGEMENT =====
function addBill() {
    const name = document.getElementById('billName').value;
    const amount = parseFloat(document.getElementById('billAmount').value);
    const date = document.getElementById('billDate').value;
    const frequency = document.getElementById('billFrequency').value;
    const autoPay = document.getElementById('autoPay').checked;

    if (!name || !amount || !date || !frequency) {
        alert('Please fill all bill fields');
        return;
    }

    const bill = {
        id: Date.now(),
        name: name,
        amount: amount,
        dueDate: date,
        frequency: frequency,
        autoPay: autoPay,
        paid: false
    };

    bills.push(bill);
    document.getElementById('billName').value = '';
    document.getElementById('billAmount').value = '';
    document.getElementById('billDate').value = '';
    document.getElementById('billFrequency').value = '';
    document.getElementById('autoPay').checked = false;

    displayBills();
    updateDashboard();
}

function displayBills() {
    const list = document.getElementById('billsList');
    if (bills.length === 0) {
        list.innerHTML = '<p style="color: #999;">No bills added yet</p>';
        return;
    }

    const upcomingBills = bills.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    list.innerHTML = upcomingBills.map(bill => `
        <div class="bill-item ${bill.paid ? 'paid' : 'pending'}">
            <div class="bill-info">
                <h4>${bill.name}</h4>
                <p>Due: ${new Date(bill.dueDate).toLocaleDateString()} • Frequency: ${bill.frequency}</p>
                <p>${bill.autoPay ? '✓ Auto-pay enabled' : 'Manual payment'}</p>
            </div>
            <div class="bill-amount">₹${bill.amount.toLocaleString()}</div>
            <div class="bill-actions">
                <button class="btn btn-success" onclick="markBillPaid(${bill.id})">Mark Paid</button>
                <button class="btn btn-danger" onclick="deleteBill(${bill.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function markBillPaid(id) {
    const bill = bills.find(b => b.id === id);
    if (bill) {
        bill.paid = !bill.paid;
        displayBills();
        updateDashboard();
    }
}

function deleteBill(id) {
    bills = bills.filter(b => b.id !== id);
    displayBills();
    updateDashboard();
}

// ===== BUDGET MANAGEMENT =====
function createBudget() {
    const category = document.getElementById('budgetCategory').value;
    const limit = parseFloat(document.getElementById('budgetLimit').value);
    const period = document.getElementById('budgetPeriod').value;

    if (!category || !limit || !period) {
        alert('Please fill all budget fields');
        return;
    }

    budgets[category] = {
        limit: limit,
        period: period,
        created: new Date().toLocaleDateString()
    };

    document.getElementById('budgetCategory').value = '';
    document.getElementById('budgetLimit').value = '';
    document.getElementById('budgetPeriod').value = '';

    displayBudgets();
    updateDashboard();
}

function displayBudgets() {
    const list = document.getElementById('budgetList');
    
    if (Object.keys(budgets).length === 0) {
        list.innerHTML = '<p style="color: #999;">No budgets created yet</p>';
        return;
    }

    list.innerHTML = Object.entries(budgets).map(([category, budget]) => {
        const spent = expenses
            .filter(e => e.category === category)
            .reduce((sum, e) => sum + e.amount, 0);
        
        const percentage = (spent / budget.limit) * 100;
        const status = spent > budget.limit ? 'Over Budget' : 'On Track';
        const color = spent > budget.limit ? '#FF6B6B' : '#70AD47';

        return `
            <div class="budget-item">
                <div class="budget-header">
                    <h4>${category}</h4>
                    <span style="color: ${color}; font-weight: 600;">${status}</span>
                </div>
                <div class="budget-bar">
                    <div class="budget-fill" style="width: ${Math.min(percentage, 100)}%; background: ${color};"></div>
                </div>
                <div class="budget-info">
                    <span>Spent: ₹${spent.toLocaleString()}</span>
                    <span>Limit: ₹${budget.limit.toLocaleString()}</span>
                    <span>Remaining: ₹${Math.max(budget.limit - spent, 0).toLocaleString()}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ===== FAMILY MANAGEMENT =====
function addFamilyMember() {
    const name = document.getElementById('memberName').value;
    const role = document.getElementById('memberRole').value;

    if (!name || !role) {
        alert('Please fill all member fields');
        return;
    }

    const member = {
        id: Date.now(),
        name: name,
        role: role
    };

    familyMembers.push(member);
    document.getElementById('memberName').value = '';
    document.getElementById('memberRole').value = '';

    displayFamilyMembers();
    updateDashboard();
}

function displayFamilyMembers() {
    const list = document.getElementById('familyList');
    
    if (familyMembers.length === 0) {
        list.innerHTML = '<p style="color: #999;">No family members added yet</p>';
        return;
    }

    list.innerHTML = `
        <div class="members-grid">
            ${familyMembers.map(member => `
                <div class="member-card">
                    <h4>${member.name}</h4>
                    <p>${member.role}</p>
                    <button class="btn btn-danger" onclick="deleteFamilyMember(${member.id})">Remove</button>
                </div>
            `).join('')}
        </div>
    `;
}

function deleteFamilyMember(id) {
    familyMembers = familyMembers.filter(m => m.id !== id);
    displayFamilyMembers();
}

// ===== SMART INSIGHTS =====
function generateInsights() {
    const insightsList = document.getElementById('insightsList');
    const insights = [];

    // Analyze spending patterns
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    
    if (totalExpenses > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1);
        
        if (savingsRate > 30) {
            insights.push({
                title: 'Great Savings Rate!',
                description: `You're saving ${savingsRate}% of your income. Keep it up!`,
                type: 'positive'
            });
        } else if (savingsRate < 10) {
            insights.push({
                title: 'Increase Savings',
                description: `Your savings rate is ${savingsRate}%. Try to save more.`,
                type: 'warning'
            });
        }

        // Category spending analysis
        const categories = {};
        expenses.forEach(e => {
            categories[e.category] = (categories[e.category] || 0) + e.amount;
        });

        const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
        if (topCategory) {
            insights.push({
                title: `High Spending on ${topCategory[0]}`,
                description: `You spent ₹${topCategory[1].toLocaleString()} on ${topCategory[0]}.`,
                type: 'info'
            });
        }

        // Bill reminders
        const unpaidBills = bills.filter(b => !b.paid && b.frequency !== 'OneTime');
        if (unpaidBills.length > 0) {
            insights.push({
                title: `${unpaidBills.length} Unpaid Bills`,
                description: `You have ${unpaidBills.length} bills pending. Don't forget to pay!`,
                type: 'warning'
            });
        }
    }

    if (insights.length === 0) {
        insightsList.innerHTML = '<p style="color: #999;">Add transactions to see insights</p>';
        return;
    }

    insightsList.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <i class="fas fa-lightbulb"></i>
            <h4>${insight.title}</h4>
            <p>${insight.description}</p>
        </div>
    `).join('');
}

// ===== DASHBOARD UPDATE =====
function updateDashboard() {
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const upcomingBills = bills
        .filter(b => !b.paid)
        .reduce((sum, b) => sum + b.amount, 0);
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = totalIncome.toLocaleString();
    document.getElementById('total-expenses').textContent = totalExpenses.toLocaleString();
    document.getElementById('upcoming-bills').textContent = upcomingBills.toLocaleString();
    document.getElementById('balance').textContent = balance.toLocaleString();

    updateCharts();
}

// ===== CHARTS =====
function updateCharts() {
    updateIncomeExpenseChart();
    updateExpenseBreakdownChart();
}

function updateIncomeExpenseChart() {
    const ctx = document.getElementById('incomeExpenseChart');
    if (!ctx) return;

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Amount (₹)',
                data: [totalIncome, totalExpenses],
                backgroundColor: ['#70AD47', '#FF6B6B'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateExpenseBreakdownChart() {
    const ctx = document.getElementById('expenseBreakdownChart');
    if (!ctx) return;

    const categories = {};
    expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    if (expenseBreakdownChart) {
        expenseBreakdownChart.destroy();
    }

    expenseBreakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#2E75B6', '#70AD47', '#FF6B6B', '#FFC000',
                    '#667eea', '#f093fb', '#4facfe', '#43e97b'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    updateDashboard();
    generateInsights();
    displayIncomes();
    displayExpenses();
    displayBills();
    displayBudgets();
    displayFamilyMembers();
});

console.log('FinanceHub - Complete Finance Management System Loaded');
