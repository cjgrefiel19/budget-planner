// Initialize data structures
let budgetData = JSON.parse(localStorage.getItem('budgetData')) || {
    expenses: [],
    savings: [],
    loans: [],
    credit: []  // Initialize credit array
};

let incomes = JSON.parse(localStorage.getItem('incomes')) || [];

// Category data structure
const categoryData = {
    'expense': {
        'Utilities and Subscriptions': [
            'PLDT',
            'Smart',
            'Gomo',
            'Meralco',
            'Maynilad',
            'Garbage Collection Fee',
            'YouTube Premium',
            'Netflix',
            'HBO Go',
            'Property Tax',
            'Water Refills'
        ],
        'Insurance': [
            'AIA',
            'AIA Vitality',
            'Singlife Cash for Income Loss',
            'Singlife 100-in-1 Medical Plan'
        ],
        'Online Shopping': [
            'TikTok Shop',
            'Shopee',
            'Lazada',
            'Shein',
            'Other Online Sites'
        ],
        'Housing and Property': [
            'Land Property',
            'House Rent',
            'Labor',
            'Materials',
            'Service'
        ],
        'Food': [
            'Foods (cooked meals)',
            'Food Delivery',
            'Frozen Foods',
            'Coffee Shops & Bakeries',
            'Fast Food Cravings',
            'Snacks & Confectionery',
            'Junk Food',
            'Meat & Seafood',
            'Vegetables & Fresh Produce',
            'Grains & Bakery',
            'Drinks & Beverages',
            'Seasonings, Sauces, & Cooking Ingredients',
            'Spreads & Breakfast Items'
        ],
        'Personal and Household': [
            'Personal Hygiene Products',
            'Cleaning Materials',
            'Laundry',
            'Clothes',
            'Shoes',
            'Bags',
            'Accessories',
            'Medicines',
            'Vitamins',
            'Supplements',
            'Salon & Spa',
            'Dental Care',
            'Medical Check-up',
            'Optical',
            'Skin Care',
            'Make-up',
            'Perfume',
            'Gadgets',
            'Appliances',
            'Furniture',
            'Home Decor',
            'Kitchen Utensils',
            'Storage Solutions',
            'Pest Control'
        ],
        'Transportation': [
            'Grab',
            'Angkas',
            'Taxi',
            'Bus',
            'Train',
            'Jeep',
            'Gas',
            'Car Maintenance',
            'Car Insurance',
            'Car Registration',
            'Parking Fee',
            'Toll Fee'
        ]
    },
    'savings': {
        'Savings & Investments': [
            'GoTyme',
            'SeaBank',
            'CimBank',
            'MP2',
            'Maya',
            'BPI',
            'Unionbank',
            'SecurityBank',
            'SSS',
            'PagIbig',
            'ColFinancial',
            'Pioneer',
            'Bitcoin',
            'ADA',
            'Stellar'
        ]
    },
    'loans': {
        'Loans': [
            'SSS Loan',
            'UB Loan',
            'Maya Loan',
            'Seabank Loan',
            'CimBank Personal Loan',
            'SPayLater',
            'TALA',
            'SLOAN',
            'ACOM',
            'GGives',
            'CimBank Revi',
            'Tiktok PayLater'
        ],
        'Credit Cards': [
            'Security Bank',
            'Citi Simplicity',
            'BDO Shopmore',
            'BDO Installment',
            'RCBC Classic',
            'Citibank Simiplicity',
            'Eastwest',
            'Robinson',
            'PNB',
            'BPI Credit Card',
            'UB Cashback',
            'RCBC JCB'
        ]
    }
};

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        const dateInput = modal.querySelector('input[type="date"]');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }
        // Initialize selects if they exist
        const mainTypeSelect = modal.querySelector('[id$="MainType"]');
        if (mainTypeSelect) {
            populateMainTypeSelect(mainTypeSelect);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Transaction Modal Functions
function openAddTransactionModal() {
    openModal('addTransactionModal');
}

function closeAddTransactionModal() {
    closeModal('addTransactionModal');
}

function openAddIncomeModal() {
    openModal('addIncomeModal');
}

function closeAddIncomeModal() {
    closeModal('addIncomeModal');
}

function openCategoryModal() {
    openModal('categoryModal');
    updateCategoryList();
}

function closeCategoryModal() {
    closeModal('categoryModal');
}

// Credit Card Modal Functions
function showAddCreditCardModal() {
    openModal('creditCardExpenseModal');
}

function hideAddCreditCardModal() {
    closeModal('creditCardExpenseModal');
}

// Credit Card Expense Form Handler
function handleAddCreditCardExpense(event) {
    event.preventDefault();
    
    const expense = {
        date: document.getElementById('expenseDate').value,
        creditCard: document.getElementById('creditCard').value,
        merchant: document.getElementById('merchant').value,
        amount: parseFloat(document.getElementById('amount').value),
        installments: parseInt(document.getElementById('installments').value),
        description: document.getElementById('description').value,
        id: Date.now().toString()
    };

    budgetData.credit.push(expense);
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    
    hideAddCreditCardModal();
    filterCreditCardExpenses();
}

// Form submission handlers
function handleAddTransaction(event) {
    event.preventDefault();
    
    const mainType = document.getElementById('transactionMainType').value;
    const description = document.getElementById('transactionDescription').value.trim();
    
    const transaction = {
        date: document.getElementById('transactionDate').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        mainType: mainType,
        category: document.getElementById('transactionCategory').value,
        subcategory: document.getElementById('transactionSubcategory').value,
        description: description || '-', // Use '-' if description is empty
        id: Date.now().toString()
    };

    // Add to the correct array based on main type
    if (!budgetData[mainType]) {
        budgetData[mainType] = [];
    }
    budgetData[mainType].push(transaction);
    
    // Save to localStorage
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    
    closeAddTransactionModal();
    updateDashboard();
}

function handleAddIncome(event) {
    event.preventDefault();
    
    const income = {
        date: document.getElementById('incomeDate').value,
        category: document.getElementById('incomeCategory').value,
        amount: parseFloat(document.getElementById('incomeAmount').value),
        description: document.getElementById('incomeDescription').value,
        type: 'income',
        id: Date.now().toString()
    };

    incomes.push(income);
    localStorage.setItem('incomes', JSON.stringify(incomes));
    
    closeAddIncomeModal();
    updateDashboard();
}

// Delete transaction function
function deleteTransaction(id, type) {
    // Find the transaction in the appropriate array
    if (budgetData[type]) {
        budgetData[type] = budgetData[type].filter(transaction => transaction.id !== id);
        localStorage.setItem('budgetData', JSON.stringify(budgetData));
        
        // Refresh the display
        filterTransactions();
        updateDashboard();
    }
}

// Delete income function
function deleteIncome(id) {
    incomes = incomes.filter(income => income.id !== id);
    localStorage.setItem('incomes', JSON.stringify(incomes));
    
    // Refresh the display
    filterTransactions();
    updateDashboard();
}

// Delete credit card expense function
function deleteCreditCardExpense(id) {
    budgetData.credit = budgetData.credit.filter(expense => expense.id !== id);
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    filterCreditCardExpenses();
}

// Update categories based on main type selection
function updateCategories() {
    const mainType = document.getElementById('transactionMainType').value;
    const categorySelect = document.getElementById('transactionCategory');
    const subcategorySelect = document.getElementById('transactionSubcategory');
    
    // Clear existing options
    categorySelect.innerHTML = '';
    subcategorySelect.innerHTML = '';
    
    if (categoryData[mainType]) {
        // Add categories
        Object.keys(categoryData[mainType]).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        
        // Update subcategories for the first category
        const firstCategory = Object.keys(categoryData[mainType])[0];
        updateSubcategories(mainType, firstCategory);
    }
}

// Update subcategories based on selected category
function updateSubcategories(mainType, category) {
    const subcategorySelect = document.getElementById('transactionSubcategory');
    subcategorySelect.innerHTML = '';
    
    if (categoryData[mainType] && categoryData[mainType][category]) {
        categoryData[mainType][category].forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const mainTypeSelect = document.getElementById('transactionMainType');
    const categorySelect = document.getElementById('transactionCategory');
    
    if (mainTypeSelect) {
        mainTypeSelect.addEventListener('change', updateCategories);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const mainType = document.getElementById('transactionMainType').value;
            updateSubcategories(mainType, this.value);
        });
    }
    
    // Initialize categories if main type is pre-selected
    if (mainTypeSelect && mainTypeSelect.value) {
        updateCategories();
    }
});

function filterTransactions() {
    const selectedMonth = document.getElementById('month').value;
    const selectedYear = document.getElementById('year').value;
    const selectedType = document.getElementById('type')?.value || 'all';
    
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    // Clear the current list
    transactionsList.innerHTML = '';
    
    // Combine all transactions for filtering
    let allTransactions = [];
    
    // Only include non-credit card transactions
    ['expenses', 'savings', 'loans'].forEach(type => {
        if (Array.isArray(budgetData[type])) {
            budgetData[type].forEach(transaction => {
                allTransactions.push({...transaction, type});
            });
        }
    });

    // Add incomes if showing all or income type
    if (selectedType === 'all' || selectedType === 'income') {
        incomes.forEach(income => {
            allTransactions.push({...income, type: 'income'});
        });
    }
    
    // Filter by type if not showing all
    if (selectedType !== 'all') {
        allTransactions = allTransactions.filter(transaction => transaction.type === selectedType);
    }
    
    // Filter by month and year
    const filteredTransactions = allTransactions.filter(transaction => {
        const date = new Date(transaction.date);
        return (date.getMonth() + 1).toString() === selectedMonth &&
               date.getFullYear().toString() === selectedYear;
    });
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create transaction elements with delete buttons
    filteredTransactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = `transaction-item ${transaction.type}`;
        
        const amount = parseFloat(transaction.amount);
        const formattedDate = new Date(transaction.date).toLocaleDateString();
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.onclick = () => {
            if (transaction.type === 'income') {
                deleteIncome(transaction.id);
            } else {
                deleteTransaction(transaction.id, transaction.type);
            }
        };
        
        const transactionInfo = document.createElement('div');
        transactionInfo.className = 'transaction-info';
        transactionInfo.innerHTML = `
            <div class="transaction-date">${formattedDate}</div>
            <div class="transaction-category">
                ${transaction.type === 'income' ? 'Income' : `${transaction.mainType} - ${transaction.category}`}
            </div>
            <div class="transaction-description">${transaction.description}</div>
            <div class="transaction-amount ${transaction.type === 'income' ? 'positive' : 'negative'}">
                ₱${amount.toFixed(2)}
            </div>
        `;
        
        transactionInfo.appendChild(deleteButton);
        transactionElement.appendChild(transactionInfo);
        transactionsList.appendChild(transactionElement);
    });
}

function filterCreditCardExpenses() {
    const selectedMonth = document.getElementById('month').value;
    const selectedYear = document.getElementById('year').value;
    const expensesList = document.getElementById('creditCardExpensesList');
    
    // Clear the current list
    expensesList.innerHTML = '';
    
    // Get filtered expenses
    const filteredExpenses = budgetData.credit.filter(expense => {
        const date = new Date(expense.date);
        return (date.getMonth() + 1).toString() === selectedMonth && 
               date.getFullYear().toString() === selectedYear;
    });
    
    // Sort expenses by date (newest first)
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate total expenses
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Display expenses
    filteredExpenses.forEach(expense => {
        const date = new Date(expense.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const expenseElement = document.createElement('div');
        expenseElement.className = 'transaction-item';
        expenseElement.innerHTML = `
            <div class="transaction-date">
                <i class="fas fa-calendar"></i>
                ${formattedDate}
            </div>
            <div class="transaction-details">
                <div class="merchant-name">
                    <i class="fas fa-store"></i>
                    ${expense.merchant}
                </div>
                <div class="card-name">
                    <i class="fas fa-credit-card"></i>
                    ${expense.creditCard}
                    ${expense.installments > 1 ? `<span class="installment-badge">
                        <i class="fas fa-clock"></i> ${expense.installments} months
                    </span>` : ''}
                </div>
                ${expense.description ? `
                    <div class="description">
                        <i class="fas fa-sticky-note"></i>
                        ${expense.description}
                    </div>
                ` : ''}
            </div>
            <div class="transaction-amount">
                ₱${expense.amount.toFixed(2)}
            </div>
            <button class="transaction-delete" onclick="deleteCreditCardExpense('${expense.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        expensesList.appendChild(expenseElement);
    });
    
    // Update total display
    document.getElementById('totalCreditCardExpenses').textContent = `₱${totalExpenses.toFixed(2)}`;
}

// Update form fields based on selection type
function updateAddForm() {
    const addType = document.getElementById('addType').value;
    const formFields = document.getElementById('addFormFields');
    formFields.innerHTML = '';

    switch(addType) {
        case 'mainType':
            // For new main type, ask for main type name, category, and subcategory
            formFields.innerHTML = `
                <div class="form-group">
                    <label for="newMainType">New Main Type Name:</label>
                    <input type="text" id="newMainType" required>
                </div>
                <div class="form-group">
                    <label for="newCategory">First Category Name:</label>
                    <input type="text" id="newCategory" required>
                </div>
                <div class="form-group">
                    <label for="newSubcategory">First Subcategory Name:</label>
                    <input type="text" id="newSubcategory" required>
                </div>
            `;
            break;

        case 'category':
            // For new category, show main type selection and ask for category and first subcategory
            formFields.innerHTML = `
                <div class="form-group">
                    <label for="selectMainType">Select Main Type:</label>
                    <select id="selectMainType" required>
                        ${Object.keys(categoryData).map(type => 
                            `<option value="${type}">${type}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="newCategory">New Category Name:</label>
                    <input type="text" id="newCategory" required>
                </div>
                <div class="form-group">
                    <label for="newSubcategory">First Subcategory Name:</label>
                    <input type="text" id="newSubcategory" required>
                </div>
            `;
            break;

        case 'subcategory':
            // For new subcategory, show main type and category selection
            formFields.innerHTML = `
                <div class="form-group">
                    <label for="selectMainType">Select Main Type:</label>
                    <select id="selectMainType" required onchange="updateCategorySelect()">
                        ${Object.keys(categoryData).map(type => 
                            `<option value="${type}">${type}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="selectCategory">Select Category:</label>
                    <select id="selectCategory" required>
                        ${Object.keys(categoryData[Object.keys(categoryData)[0]] || {}).map(category => 
                            `<option value="${category}">${category}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="newSubcategory">New Subcategory Name:</label>
                    <input type="text" id="newSubcategory" required>
                </div>
            `;
            break;
    }
}

// Update category select when main type changes
function updateCategorySelect() {
    const mainType = document.getElementById('selectMainType').value;
    const categorySelect = document.getElementById('selectCategory');
    
    if (categorySelect && categoryData[mainType]) {
        categorySelect.innerHTML = Object.keys(categoryData[mainType]).map(category => 
            `<option value="${category}">${category}</option>`
        ).join('');
    }
}

// Add new category item
function addNewItem() {
    const addType = document.getElementById('addType').value;
    
    switch(addType) {
        case 'mainType':
            const mainTypeName = document.getElementById('newMainType').value;
            const firstCategory = document.getElementById('newCategory').value;
            const firstSubcategory = document.getElementById('newSubcategory').value;
            
            if (mainTypeName && firstCategory && firstSubcategory) {
                categoryData[mainTypeName] = {
                    [firstCategory]: [firstSubcategory]
                };
            }
            break;
            
        case 'category':
            const selectedMainType = document.getElementById('selectMainType').value;
            const newCategory = document.getElementById('newCategory').value;
            const newSubcategory = document.getElementById('newSubcategory').value;
            
            if (selectedMainType && newCategory && newSubcategory) {
                categoryData[selectedMainType][newCategory] = [newSubcategory];
            }
            break;
            
        case 'subcategory':
            const mainType = document.getElementById('selectMainType').value;
            const category = document.getElementById('selectCategory').value;
            const subcategory = document.getElementById('newSubcategory').value;
            
            if (mainType && category && subcategory) {
                categoryData[mainType][category].push(subcategory);
            }
            break;
    }
    
    // Save to localStorage
    localStorage.setItem('categoryData', JSON.stringify(categoryData));
    
    // Reset form and close modal
    document.getElementById('addType').value = 'mainType';
    document.getElementById('addFormFields').innerHTML = '';
    closeCategoryModal();
    
    // Update categories in the transaction form
    updateCategories();
}

// Transactions page modal functions
function openAddExpenseModal() {
    openModal('addExpenseModal');
    const mainTypeSelect = document.getElementById('expenseMainType');
    populateMainTypeSelect(mainTypeSelect, 'expenses');
}

function openAddSavingsModal() {
    openModal('addSavingsModal');
    const mainTypeSelect = document.getElementById('savingsMainType');
    populateMainTypeSelect(mainTypeSelect, 'savings');
}

function openAddLoanModal() {
    openModal('addLoanModal');
    const mainTypeSelect = document.getElementById('loanMainType');
    populateMainTypeSelect(mainTypeSelect, 'loans');
}

// Helper function to populate main type select
function populateMainTypeSelect(select, type) {
    if (!select) return;
    
    select.innerHTML = '';
    const categories = categoryData[type];
    
    for (const category in categories) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    }
    
    // Trigger category update
    const categorySelect = select.closest('form').querySelector(`#${type}Category`);
    if (categorySelect) {
        updateCategoriesForType(select, categorySelect, type);
    }
}

// Update categories based on main type for specific transaction type
function updateCategoriesForType(mainTypeSelect, categorySelect, type) {
    const selectedMainType = mainTypeSelect.value;
    categorySelect.innerHTML = '';
    
    if (selectedMainType && categoryData[type] && categoryData[type][selectedMainType]) {
        categoryData[type][selectedMainType].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Form submission handlers for each type
document.addEventListener('DOMContentLoaded', function() {
    // Expense form handler
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const expense = {
                id: Date.now().toString(),
                date: document.getElementById('expenseDate').value,
                mainType: document.getElementById('expenseMainType').value,
                category: document.getElementById('expenseCategory').value,
                subcategory: document.getElementById('expenseSubcategory').value,
                amount: parseFloat(document.getElementById('expenseAmount').value)
            };
            budgetData.expenses.push(expense);
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
            closeModal('addExpenseModal');
            filterTransactions();
        });
    }

    // Savings form handler
    const savingsForm = document.getElementById('savingsForm');
    if (savingsForm) {
        savingsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const saving = {
                id: Date.now().toString(),
                date: document.getElementById('savingsDate').value,
                mainType: document.getElementById('savingsMainType').value,
                category: document.getElementById('savingsCategory').value,
                subcategory: document.getElementById('savingsSubcategory').value,
                amount: parseFloat(document.getElementById('savingsAmount').value)
            };
            budgetData.savings.push(saving);
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
            closeModal('addSavingsModal');
            filterTransactions();
        });
    }

    // Loan form handler
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const loan = {
                id: Date.now().toString(),
                date: document.getElementById('loanDate').value,
                mainType: document.getElementById('loanMainType').value,
                category: document.getElementById('loanCategory').value,
                subcategory: document.getElementById('loanSubcategory').value,
                amount: parseFloat(document.getElementById('loanAmount').value)
            };
            budgetData.loans.push(loan);
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
            closeModal('addLoanModal');
            filterTransactions();
        });
    }

    // Add change event listeners for main type selects
    const mainTypeSelects = document.querySelectorAll('[id$="MainType"]');
    mainTypeSelects.forEach(select => {
        select.addEventListener('change', function() {
            const form = this.closest('form');
            const type = form.id.replace('Form', ''); // expenseForm -> expense
            const categorySelect = form.querySelector(`#${type}Category`);
            if (categorySelect) {
                updateCategoriesForType(this, categorySelect, type);
            }
        });
    });
});

// Initialize main type dropdowns
function initializeMainTypeDropdowns() {
    const mainTypes = {
        'expense': 'Expense',
        'savings': 'Savings',
        'loans': 'Debts'
    };

    const mainTypeSelects = document.querySelectorAll('[id$="MainType"]');
    mainTypeSelects.forEach(select => {
        // Clear existing options
        select.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select main type';
        select.appendChild(defaultOption);
        
        // Add main type options
        Object.entries(mainTypes).forEach(([value, text]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        });
        
        // Add change event listener
        select.addEventListener('change', function() {
            const form = this.closest('form');
            const type = this.value; // Use the selected value directly
            const categorySelect = form.querySelector(`[id$="Category"]`);
            if (categorySelect) {
                updateCategories(type, categorySelect);
            }
        });
    });
}

// Update categories based on main type selection
function updateCategories(mainType, categorySelect) {
    const subcategorySelect = categorySelect.closest('form').querySelector('[id$="Subcategory"]');
    
    // Clear existing options
    categorySelect.innerHTML = '';
    subcategorySelect.innerHTML = '';
    
    // Add default options
    categorySelect.innerHTML = '<option value="">Select category</option>';
    subcategorySelect.innerHTML = '<option value="">Select subcategory</option>';
    
    if (categoryData[mainType]) {
        // Add categories
        Object.keys(categoryData[mainType]).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        
        // Add change event listener to category select if not already added
        if (!categorySelect.hasChangeListener) {
            categorySelect.addEventListener('change', function() {
                updateSubcategories(mainType, this.value, subcategorySelect);
            });
            categorySelect.hasChangeListener = true;
        }
    }
}

// Update subcategories based on selected category
function updateSubcategories(mainType, category, subcategorySelect) {
    // Clear existing options
    subcategorySelect.innerHTML = '<option value="">Select subcategory</option>';
    
    if (categoryData[mainType] && categoryData[mainType][category]) {
        categoryData[mainType][category].forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMainTypeDropdowns();
    initializeMonthYearDropdowns();
    displayTransactions();
});

// Modal functions
function openAddExpenseModal() {
    const modal = document.getElementById('addExpenseModal');
    modal.style.display = 'block';
    
    // Set today's date
    const dateInput = document.getElementById('expenseDate');
    dateInput.value = new Date().toISOString().split('T')[0];
}

function openAddSavingsModal() {
    const modal = document.getElementById('addSavingsModal');
    modal.style.display = 'block';
    
    // Set today's date
    const dateInput = document.getElementById('savingsDate');
    dateInput.value = new Date().toISOString().split('T')[0];
}

function openAddLoanModal() {
    const modal = document.getElementById('addLoanModal');
    modal.style.display = 'block';
    
    // Set today's date
    const dateInput = document.getElementById('loanDate');
    dateInput.value = new Date().toISOString().split('T')[0];
}

// Initialize dropdowns with current month and year or saved values
function initializeMonthYearDropdowns() {
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    
    if (!monthSelect || !yearSelect) return;

    // Get saved values from localStorage or use current date
    const savedMonth = localStorage.getItem('selectedMonth');
    const savedYear = localStorage.getItem('selectedYear');
    
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const currentYear = currentDate.getFullYear().toString();

    // Set month dropdown
    if (monthSelect) {
        monthSelect.value = savedMonth || currentMonth;
        monthSelect.addEventListener('change', function() {
            localStorage.setItem('selectedMonth', this.value);
            updateDashboard();
        });
    }

    // Set year dropdown
    if (yearSelect) {
        yearSelect.value = savedYear || currentYear;
        yearSelect.addEventListener('change', function() {
            localStorage.setItem('selectedYear', this.value);
            updateDashboard();
        });
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        const form = event.target.querySelector('form');
        if (form) {
            form.reset();
        }
    }
};

function updateDashboard() {
    const selectedMonth = document.getElementById('month').value;
    const selectedYear = document.getElementById('year').value;
    
    // Make sure we have the latest data
    budgetData = JSON.parse(localStorage.getItem('budgetData')) || {
        expenses: [],
        savings: [],
        loans: [],
        credit: []
    };
    
    // Get monthly income
    const monthlyIncome = incomes.reduce((total, income) => {
        const date = new Date(income.date);
        const incomeMonth = (date.getMonth() + 1).toString();
        const incomeYear = date.getFullYear().toString();
        
        if (incomeMonth === selectedMonth && incomeYear === selectedYear) {
            return total + parseFloat(income.amount);
        }
        return total;
    }, 0);

    // Calculate totals for cash transactions only (excluding credit)
    const cashTypes = ['expenses', 'savings', 'loans'];
    const totals = {
        expenses: 0,
        savings: 0,
        loans: 0
    };

    // Process cash transactions
    cashTypes.forEach(type => {
        if (!Array.isArray(budgetData[type])) return;
        
        budgetData[type].forEach(transaction => {
            const date = new Date(transaction.date);
            const transactionMonth = (date.getMonth() + 1).toString();
            const transactionYear = date.getFullYear().toString();
            
            if (transactionMonth === selectedMonth && transactionYear === selectedYear) {
                const amount = parseFloat(transaction.amount);
                totals[type] += amount;
            }
        });
    });

    // Calculate current balance (income - expenses - savings - loans)
    const currentBalance = monthlyIncome - totals.expenses - totals.savings - totals.loans;

    // Update the current balance display
    const balanceElement = document.getElementById('currentBalance');
    if (balanceElement) {
        balanceElement.textContent = `₱${currentBalance.toFixed(2)}`;
    }

    // Update individual totals in the UI
    Object.keys(totals).forEach(type => {
        const element = document.getElementById(`${type}-total`);
        if (element) {
            element.textContent = `₱${totals[type].toFixed(2)}`;
        }
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Make sure we have the latest data from localStorage
    budgetData = JSON.parse(localStorage.getItem('budgetData')) || {
        expenses: [],
        savings: [],
        loans: [],
        credit: []  // Initialize credit array
    };
    incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    
    // Initialize dropdowns
    initializeMonthYearDropdowns();
    
    // Initialize page-specific features
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('transactions.html')) {
        filterTransactions();
        
        // Add event listeners for filters
        const monthSelect = document.getElementById('month');
        const yearSelect = document.getElementById('year');
        if (monthSelect) monthSelect.addEventListener('change', filterTransactions);
        if (yearSelect) yearSelect.addEventListener('change', filterTransactions);
    }
    
    if (currentPath.includes('credit-card.html')) {
        // Ensure credit array exists
        if (!budgetData.credit) {
            budgetData.credit = [];
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
        }
        filterCreditCardExpenses();
        
        // Add event listeners for filters
        const monthSelect = document.getElementById('month');
        const yearSelect = document.getElementById('year');
        if (monthSelect) monthSelect.addEventListener('change', filterCreditCardExpenses);
        if (yearSelect) yearSelect.addEventListener('change', filterCreditCardExpenses);
    }

    // Update dashboard if on main page
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        updateDashboard();
    }
    
    // Add event listeners for dashboard filters
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    
    if (monthSelect && yearSelect) {
        monthSelect.addEventListener('change', updateDashboard);
        yearSelect.addEventListener('change', updateDashboard);
    }
});