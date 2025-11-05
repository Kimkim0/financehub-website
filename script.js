// SCRIPT.JS - FinanceHub Finance Management Features

// Data storage
let expenses = [];
let budgets = {};
let monthlyIncome = 50000;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Set Monthly Income
function setIncome() {
    const income = parseFloat(document.getElementById('monthlyIncome').value);
    if (income > 0) {
        monthlyIncome = income;
        document.getElementById('income').textContent = income.toLocaleString();
        updateDashboard();
        alert('Monthly income updated: ₹' + income.toLocaleString());
    } else {
        alert('Please enter a valid income amount');
    }
}

// Add Expense
function addExpense() {
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    if (!name || !amount || !category) {
        alert('Please fill all fields');
        return;
    }

    const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: new Date().toLocaleDateString()
    };

    expenses.push(expense);
    
    // Clear form
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';

    // Update display
    displayExpenses();
    updateDashboard();
}

// Display Expenses
function displayExpenses() {
    const list = document.getElementById('expensesList');
    
    if (expenses.length === 0) {
        list.innerHTML = '<p style="color: #999;">No expenses added yet</p>';
        return;
    }

    list.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <h4>${expense.name}</h4>
                <p>${expense.category} • ${expense.date}</p>
            </div>
            <div class="expense-amount">₹${expense.amount.toLocaleString()}</div>
            <button class="btn" onclick="deleteExpense(${expense.id})" style="background: #FF6B6B; color: white; padding: 0.5rem 1rem;">Delete</button>
        </div>
    `).join('');
}

// Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    displayExpenses();
    updateDashboard();
}

// Set Budget
function setBudget() {
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);

    if (!category || !amount) {
        alert('Please fill all fields');
        return;
    }

    budgets[category] = amount;
    
    // Clear form
    document.getElementById('budgetCategory').value = '';
    document.getElementById('budgetAmount').value = '';

    // Update display
    displayBudgets();
    updateDashboard();
}

// Display Budgets
function displayBudgets() {
    const list = document.getElementById('budgetList');
    
    if (Object.keys(budgets).length === 0) {
        list.innerHTML = '<p style="color: #999;">No budgets set yet</p>';
        return;
    }

    list.innerHTML = Object.entries(budgets).map(([category, limit]) => {
        const spent = expenses
            .filter(e => e.category === category)
            .reduce((sum, e) => sum + e.amount, 0);
        
        const percentage = (spent / limit) * 100;
        const remaining = limit - spent;
        const status = spent > limit ? 'Over Budget' : 'On Track';
        const color = spent > limit ? '#FF6B6B' : '#70AD47';

        return `
            <div class="budget-item">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h4>${category}</h4>
                    <span style="color: ${color}; font-weight: 600;">${status}</span>
                </div>
                <div class="budget-bar">
                    <div class="budget-fill" style="width: ${Math.min(percentage, 100)}%; background: ${color};"></div>
                </div>
                <div class="budget-info">
                    <span>Spent: ₹${spent.toLocaleString()}</span>
                    <span>Limit: ₹${limit.toLocaleString()}</span>
                    <span>Remaining: ₹${Math.max(remaining, 0).toLocaleString()}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Update Dashboard
function updateDashboard() {
    // Calculate totals
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const savings = monthlyIncome - totalExpenses;
    
    // Calculate budget from all budgets
    const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);
    const budgetRemaining = totalBudget - totalExpenses;

    // Update dashboard
    document.getElementById('income').textContent = monthlyIncome.toLocaleString();
    document.getElementById('expenses-total').textContent = totalExpenses.toLocaleString();
    document.getElementById('savings').textContent = savings.toLocaleString();
    document.getElementById('remaining').textContent = Math.max(budgetRemaining, 0).toLocaleString();
}

// Page load animations
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.feature-card, .metric-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Initialize dashboard with default values
    updateDashboard();
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animations to elements
document.querySelectorAll('.feature-card, .metric-card').forEach(el => {
    observer.observe(el);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Close mobile menu when link clicked
if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.style.display = 'none';
        });
    });
}

// Add console message
console.log('FinanceHub - Personal Finance Manager');
console.log('Ready to manage your finances!');
console.log('Features: Expense Tracking, Budget Planning, Financial Dashboard'
